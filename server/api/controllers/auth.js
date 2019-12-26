import { generateToken } from '../../utils/tokenUtils';
import AuthDbService from '../services/auth/auth.db.service';

function AuthController() {
    this.authDbService = new AuthDbService();

    this.authenticateUser = async (req, res) => {
        try {
            const { username, password } = req.body;

            const { userId } = await this.authDbService.validatePasswordHash(username, password);
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

    this.updatePassword = async (req, res) => {
        try {
            const { username, currentPassword, newPassword } = req.body;

            await this.authDbService.updateUserPassword(username, currentPassword, newPassword);

            res.status(200).json({});
        } catch (e) {
            res.status(403).json({
                error: e.message || 'Unauthorized'
            });
        }
    };
};

export default AuthController;
