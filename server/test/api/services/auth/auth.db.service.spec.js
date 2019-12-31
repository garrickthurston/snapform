import sinon from 'sinon';
import AuthDbService from '../../../../api/services/auth/auth.db.service';
import * as db from '../../../../utils/dbUtils';
import * as crypt from '../../../../utils/encryptionUtils';

const { assert } = sinon;

describe('Auth DB Service', () => {
    let executeQueryStub;
    let hashStringStub;

    afterEach(() => {
        executeQueryStub && executeQueryStub.restore();
        hashStringStub && hashStringStub.restore();
    });

    describe('validatePasswordHash', () => {
        it('should validate password hash', async () => {
            const service = new AuthDbService();

            executeQueryStub = sinon.stub(db, 'executeQuery');
            executeQueryStub.onCall(0).resolves({
                recordset: [{
                    passhash: 'passhash'
                }]
            });
            executeQueryStub.onCall(1).resolves({
                recordset: [{
                    user_id: 'user_id'
                }]
            });
            hashStringStub = sinon.stub(crypt, 'hashString').returns('passhash');

            const result = await service.validatePasswordHash('username', 'password');

            assert.match(result, {
                currentPassHash: 'passhash',
                userId: 'user_id'
            });
            assert.match(executeQueryStub.callCount, 2);
            assert.match(executeQueryStub.args[0][1][0].value, 'username');
            assert.match(executeQueryStub.args[1][1][0].value, 'username');
            assert.match(hashStringStub.callCount, 1);
            assert.match(hashStringStub.args[0][0], 'password');
        });

        it('should throw if username password not found', async () => {
            const service = new AuthDbService();
    
            executeQueryStub = sinon.stub(db, 'executeQuery').resolves({ recordset: [] });
            hashStringStub = sinon.stub(crypt, 'hashString').returns('passhash');
    
            let e;
            let result;
            try {
                result = await service.validatePasswordHash('username', 'password');
            } catch(err) {
                e = err;
            } finally {
                assert.match(result, undefined);
                assert.match(!!e, true);
                assert.match(e.message, 'Unauthorized');
                assert.match(executeQueryStub.callCount, 1);
                assert.match(executeQueryStub.args[0][1][0].value, 'username');
                assert.match(hashStringStub.callCount, 1);
                assert.match(hashStringStub.args[0][0], 'password');
            }
        });
    
        it('should throw if passhash does not match', async () => {
            const service = new AuthDbService();
    
            executeQueryStub = sinon.stub(db, 'executeQuery').resolves({
                recordset: [{
                    passhash: 'passhash'
                }]
            });
            hashStringStub = sinon.stub(crypt, 'hashString').returns('different-passhash');
    
            let e;
            let result;
            try {
                result = await service.validatePasswordHash('username', 'password');
            } catch(err) {
                e = err;
            } finally {
                assert.match(result, undefined);
                assert.match(!!e, true);
                assert.match(e.message, 'Unauthorized');
                assert.match(executeQueryStub.callCount, 1);
                assert.match(executeQueryStub.args[0][1][0].value, 'username');
                assert.match(hashStringStub.callCount, 1);
                assert.match(hashStringStub.args[0][0], 'password');
            }
        });
    
        it('should throw if username not found', async () => {
            const service = new AuthDbService();
    
            executeQueryStub = sinon.stub(db, 'executeQuery');
            executeQueryStub.onCall(0).resolves({
                recordset: [{
                    passhash: 'passhash'
                }]
            });
            executeQueryStub.onCall(1).resolves({
                recordset: []
            });
            hashStringStub = sinon.stub(crypt, 'hashString').returns('passhash');
    
            let e;
            let result;
            try {
                result = await service.validatePasswordHash('username', 'password');
            } catch(err) {
                e = err;
            } finally {
                assert.match(result, undefined);
                assert.match(!!e, true);
                assert.match(e.message, 'Unauthorized');
                assert.match(executeQueryStub.callCount, 2);
                assert.match(executeQueryStub.args[0][1][0].value, 'username');
                assert.match(executeQueryStub.args[1][1][0].value, 'username');
                assert.match(hashStringStub.callCount, 1);
                assert.match(hashStringStub.args[0][0], 'password');
            }
        });
    });

    describe('updateUserPassword', () => {
        it('should update user password', async () => {
            const service = new AuthDbService();

            executeQueryStub = sinon.stub(db, 'executeQuery');
            executeQueryStub.onCall(0).resolves({
                recordset: [{
                    passhash: 'passhash'
                }]
            });
            executeQueryStub.onCall(1).resolves({
                recordset: [{
                    user_id: 'user_id'
                }]
            });
            executeQueryStub.onCall(2).resolves();

            hashStringStub = sinon.stub(crypt, 'hashString');
            hashStringStub.onCall(0).returns('passhash');
            hashStringStub.onCall(1).returns('new-password-hash');

            await service.updateUserPassword('username', 'currentPassword', 'newPassword');

            assert.match(executeQueryStub.callCount, 3);
            assert.match(executeQueryStub.args[0][1][0].value, 'username');
            assert.match(executeQueryStub.args[1][1][0].value, 'username');
            assert.match(executeQueryStub.args[2][1][0].value, 'user_id');
            assert.match(executeQueryStub.args[2][1][1].value, 'passhash');
            assert.match(executeQueryStub.args[2][1][2].value, 'new-password-hash');
            assert.match(hashStringStub.callCount, 2);
            assert.match(hashStringStub.args[0][0], 'currentPassword');
            assert.match(hashStringStub.args[1][0], 'newPassword');
        });

        it('should require all params', async () => {
            const service = new AuthDbService();

            executeQueryStub = sinon.stub(db, 'executeQuery');
            executeQueryStub.onCall(0).resolves({
                recordset: [{
                    passhash: 'passhash'
                }]
            });
            executeQueryStub.onCall(1).resolves({
                recordset: [{
                    user_id: 'user_id'
                }]
            });
            executeQueryStub.onCall(2).resolves();

            hashStringStub = sinon.stub(crypt, 'hashString');
            hashStringStub.onCall(0).returns('passhash');
            hashStringStub.onCall(1).returns('new-password-hash');

            let e;
            try {
                await service.updateUserPassword(null, 'currentPassword', 'newPassword');
            } catch (err) {
                e = err;
            } finally {
                assert.match(!!e, true);
                assert.match(e.message, 'Unauthorized');
                assert.match(executeQueryStub.callCount, 0);
                assert.match(hashStringStub.callCount, 0);
            }

            executeQueryStub.restore();
            hashStringStub.restore();
            e = null;

            try {
                await service.updateUserPassword('username', null, 'newPassword');
            } catch (err) {
                e = err;
            } finally {
                assert.match(!!e, true);
                assert.match(e.message, 'Unauthorized');
                assert.match(executeQueryStub.callCount, 0);
                assert.match(hashStringStub.callCount, 0);
            }

            executeQueryStub.restore();
            hashStringStub.restore();
            e = null;

            try {
                await service.updateUserPassword('username', 'currentPassword', null);
            } catch (err) {
                e = err;
            } finally {
                assert.match(!!e, true);
                assert.match(e.message, 'Unauthorized');
                assert.match(executeQueryStub.callCount, 0);
                assert.match(hashStringStub.callCount, 0);
            }
        });

        it('should throw if cant validate password', async () => {
            const service = new AuthDbService();

            executeQueryStub = sinon.stub(service, 'updateUserPassword').throws(new Error('Unauthorized'));
            hashStringStub = sinon.stub(crypt, 'hashString');

            let e;
            try {
                await service.updateUserPassword('username', 'currentPassword', 'newPassword');
            } catch (err) {
                e = err;
            } finally {
                assert.match(!!e, true);
                assert.match(e.message, 'Unauthorized');
                assert.match(executeQueryStub.callCount, 1);
                assert.match(executeQueryStub.args[0][0], 'username');
                assert.match(executeQueryStub.args[0][1], 'currentPassword');
                assert.match(hashStringStub.callCount, 0);
            }
        });
    });
});
