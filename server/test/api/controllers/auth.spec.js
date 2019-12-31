import sinon from 'sinon';
import AuthController from '../../../api/controllers/auth';

const { assert } = sinon;

describe('Auth Controller', () => {
    let authDbServiceStub;
    let resSpy;
    let resJsonSpy;

    const res = {
        status: () => res,
        json: () => res
    };

    afterEach(() => {
        authDbServiceStub && authDbServiceStub.restore();

        resSpy && resSpy.restore();
        resJsonSpy && resJsonSpy.restore();
    });

    describe('authenticateUser', () => {
        it('should validate user and return token', async () => {
            const controller = new AuthController();
    
            authDbServiceStub = sinon.stub(controller.authDbService, 'validatePasswordHash').resolves({
                userId: 'user_id'
            });
            resSpy = sinon.spy(res, 'status');
            const req = {
                body: {
                    username: 'username',
                    password: 'password'
                }
            };
    
            await controller.authenticateUser(req, res);
    
            assert.match(authDbServiceStub.callCount, 1);
            assert.match(authDbServiceStub.args[0][0], 'username');
            assert.match(authDbServiceStub.args[0][1], 'password');
            assert.calledWith(resSpy, 200);
        });

        it('should return unauthorized if cannot validate user', async () => {
            const controller = new AuthController();

            authDbServiceStub = sinon.stub(controller.authDbService, 'validatePasswordHash').rejects(new Error('Unauthorized'));
            resSpy = sinon.spy(res, 'status');
            resJsonSpy = sinon.spy(res, 'json');
            const req = {
                body: {
                    username: 'username',
                    password: 'password'
                }
            };
    
            await controller.authenticateUser(req, res);
    
            assert.match(authDbServiceStub.callCount, 1);
            assert.match(authDbServiceStub.args[0][0], 'username');
            assert.match(authDbServiceStub.args[0][1], 'password');
            assert.calledWith(resSpy, 403);
            assert.calledWith(resJsonSpy, { error: 'Unauthorized' });
        });

        it('should return unauthorized if cannot find user', async () => {
            const controller = new AuthController();

            authDbServiceStub = sinon.stub(controller.authDbService, 'validatePasswordHash').resolves({});
            resSpy = sinon.spy(res, 'status');
            resJsonSpy = sinon.spy(res, 'json');
            const req = {
                body: {
                    username: 'username',
                    password: 'password'
                }
            };
    
            await controller.authenticateUser(req, res);
    
            assert.match(authDbServiceStub.callCount, 1);
            assert.match(authDbServiceStub.args[0][0], 'username');
            assert.match(authDbServiceStub.args[0][1], 'password');
            assert.calledWith(resSpy, 403);
            assert.calledWith(resJsonSpy, { error: 'Unauthorized' });
        });
    });

    describe('updatePassword', () => {
        it('should update password', async () => {
            const controller = new AuthController();

            authDbServiceStub = sinon.stub(controller.authDbService, 'updateUserPassword').resolves();
            resSpy = sinon.spy(res, 'status');
            resJsonSpy = sinon.spy(res, 'json');
            const req = {
                body: {
                    username: 'username',
                    currentPassword: 'currentPassword',
                    newPassword: 'newPassword'
                }  
            };

            await controller.updatePassword(req, res);

            assert.match(authDbServiceStub.callCount, 1);
            assert.match(authDbServiceStub.args[0][0], 'username');
            assert.match(authDbServiceStub.args[0][1], 'currentPassword');
            assert.match(authDbServiceStub.args[0][2], 'newPassword');
            assert.calledWith(resSpy, 200);
            assert.calledWith(resJsonSpy, {});
        });

        it('should return unauthorized if cannot update', async () => {
            const controller = new AuthController();

            authDbServiceStub = sinon.stub(controller.authDbService, 'updateUserPassword').rejects(new Error('Unauthorized'));
            resSpy = sinon.spy(res, 'status');
            resJsonSpy = sinon.spy(res, 'json');
            const req = {
                body: {
                    username: 'username',
                    currentPassword: 'currentPassword',
                    newPassword: 'newPassword'
                }  
            };

            await controller.updatePassword(req, res);

            assert.match(authDbServiceStub.callCount, 1);
            assert.match(authDbServiceStub.args[0][0], 'username');
            assert.match(authDbServiceStub.args[0][1], 'currentPassword');
            assert.match(authDbServiceStub.args[0][2], 'newPassword');
            assert.calledWith(resSpy, 403);
            assert.calledWith(resJsonSpy, { error: 'Unauthorized' });
        });
    });
});
