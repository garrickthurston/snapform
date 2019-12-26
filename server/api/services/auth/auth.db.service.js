import { executeQuery, dataTypes } from '../../../utils/dbUtils';
import { hashString } from '../../../utils/encryptionUtils';

export default function AuthDbService() {
    const _getPasswordHashByUsername = async (username) => {
        const params = [
            { name: 'username', type: dataTypes.NVarChar, value: username }
        ];
        const result = await executeQuery(_queries.getPasswordHashByUsername, params);

        if (result && result.recordset && result.recordset.length) {
            return result.recordset[0].passhash;
        }

        return null;
    };

    this.validatePasswordHash = async (username, password) => {
        const currentPassHash = await _getPasswordHashByUsername(username);
        const incomingPassHash = hashString(password);

        if (currentPassHash !== incomingPassHash) {
            throw new Error('Unauthorized');
        }

        const params = [
            { name: 'username', type: dataTypes.NVarChar, value: username }
        ];
        const result = await executeQuery(_queries.getUserIdByUsername, params);

        if (result.recordset.length) {
            return {
                userId: result.recordset[0].user_id,
                currentPassHash
            };
        }

        throw new Error('Unauthorized');
    };

    this.updateUserPassword = async (username, currentPassword, newPassword) => {
        if (!username || !currentPassword || !newPassword) {
            throw new Error('Unauthorized');
        }

        const { userId, currentPassHash } = await this.validatePasswordHash(username, currentPassword);
        if (!userId || !currentPassHash) {
            throw new Error('Unauthorized');
        }

        const newPassHash = hashString(newPassword);

        const params = [
            { name: 'user_id', type: dataTypes.NVarChar, value: userId },
            { name: 'current_pash_hash', type: dataTypes.NVarChar, value: currentPassHash },
            { name: 'new_pass_hash', type: dataTypes.NVarChar, value: newPassHash }
        ];

        await executeQuery(_queries.updatePasswordHash, params);
    };
};

const _queries = {
    getPasswordHashByUsername: `
        SELECT [passhash]
        FROM [auth].[app_user]
        WHERE [email] = @username
    `,
    getUserIdByUsername: `
        SELECT [user_id]
        FROM [auth].[app_user]
        WHERE [email] = @username
    `,
    updatePasswordHash: `
        UPDATE [auth].[app_user]
        SET [passhash] = @new_pass_hash
        WHERE [user_id] = @user_id AND passhash = @current_pash_hash
    `
};
