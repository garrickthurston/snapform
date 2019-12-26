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

        if (result && result.recordset && result.recordset.length) {
            return result.recordset[0].user_id;
        }

        throw new Error('Unauthorized');
    };

    this.updateUserPassword = async (username, currentPassword, newPassword) => {
        const currentPassIsValid = await this.validatePasswordHash(username, currentPassword);
        if (!currentPassword) {
            throw new Error('Unauthorized');
        }


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
    `
};
