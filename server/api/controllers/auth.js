import { hashString } from '../../utils/encryptionUtils';

function AuthController() {
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
