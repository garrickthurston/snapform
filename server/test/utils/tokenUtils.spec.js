import * as token from '../../utils/tokenUtils';
import sinon from 'sinon';

const { assert } = sinon;

describe('Token Utils', () => {
    it('should encrypt and decrypt payload', async () => {
        const payload = {
            prop1: 'prop1',
            prop2: 'prop2',
            prop3: 'prop3'
        };
        const userId = 'sub';

        const newToken = token.generateToken(userId, payload);

        const { data, sub } = token.decodeToken(newToken);

        assert.match(payload, data);
        assert.match(sub, userId);
    });
});
