import { hashString } from '../../utils/encryptionUtils';
import { generateToken } from '../../utils/tokenUtils';
import AuthDbService from '../services/auth/auth.db.service';

function AuthController() {
    this.authDbService = new AuthDbService();

    this.authenticateUser = async (req, res) => {
        try {
            const { username, password } = req.body;

            const userId = await this.authDbService.validatePasswordHash(username, password);
            if (!userId) {
                throw new Error('Unauthorized');
            }

            const token = generateToken(userId);
            res.status(200).json({ token });
        } catch (e) {
            res.status(403).json({
                error: e.message || 'Unauthorized'
            });
        }
    };

    this.hashMessage = async (req, res) => {
        try {
            const { message } = req.body;

            const hash = hashString(message);

            res.status(200).json({ hash });
        } catch (e) {
            res.status(500).json({
                error: e.message || 'Error Hashing Message',
                stack: e.stack
            })
        }
    };
};

export default AuthController;
