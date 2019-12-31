import sinon from 'sinon';
import UserWorkspaceController from '../../../../api/controllers/workspace/user.workspace';

const { assert } = sinon;

describe('User Workspace Controller', () => {
    let userWorkspaceDbServiceStub;
    let resSpy;
    let resJsonSpy;

    const res = {
        status: () => res,
        json: () => res
    };

    afterEach(() => {
        userWorkspaceDbServiceStub && userWorkspaceDbServiceStub.restore();

        resSpy && resSpy.restore();
        resJsonSpy && resJsonSpy.restore();
    });

    describe('getAllUserWorkspaces', () => {
        it('should retrieve all user workspaces', async () => {
            const controller = new UserWorkspaceController();

            userWorkspaceDbServiceStub = sinon.stub(controller.userWorkspaceDbService, 'getAllUserWorkspaces').resolves([]);
            resSpy = sinon.spy(res, 'status');
            resJsonSpy = sinon.spy(res, 'json');
            const req = {
                payload: {
                    sub: 'user_id'
                }
            };

            await controller.getAllUserWorkspaces(req, res);

            assert.match(userWorkspaceDbServiceStub.callCount, 1);
            assert.match(userWorkspaceDbServiceStub.args[0][0], 'user_id');
            assert.calledWith(resSpy, 200);
            assert.calledWith(resJsonSpy, []);
        });

        it('should return 500 if query fails', async () => {
            const controller = new UserWorkspaceController();

            userWorkspaceDbServiceStub = sinon.stub(controller.userWorkspaceDbService, 'getAllUserWorkspaces').throws();
            resSpy = sinon.spy(res, 'status');
            const req = {
                payload: {
                    sub: 'user_id'
                }
            };

            await controller.getAllUserWorkspaces(req, res);

            assert.match(userWorkspaceDbServiceStub.callCount, 1);
            assert.match(userWorkspaceDbServiceStub.args[0][0], 'user_id');
            assert.calledWith(resSpy, 500);
        });
    });

    describe('getUserWorkspace', () => {
        it('should retrieve user workspace', async () => {
            const controller = new UserWorkspaceController();

            userWorkspaceDbServiceStub = sinon.stub(controller.userWorkspaceDbService, 'getUserWorkspace').resolves({
                workspaceId: 'workspace_id'
            });
            resSpy = sinon.spy(res, 'status');
            resJsonSpy = sinon.spy(res, 'json');
            const req = {
                payload: {
                    sub: 'user_id'
                },
                params: {
                    workspaceId: 'workspace_id'
                }
            };

            await controller.getUserWorkspace(req, res);

            assert.match(userWorkspaceDbServiceStub.callCount, 1);
            assert.match(userWorkspaceDbServiceStub.args[0][0], 'user_id');
            assert.match(userWorkspaceDbServiceStub.args[0][1], 'workspace_id');
            assert.calledWith(resSpy, 200);
            assert.calledWith(resJsonSpy, { workspaceId: 'workspace_id' });
        });

        it('should return 500 if query fails', async () => {
            const controller = new UserWorkspaceController();

            userWorkspaceDbServiceStub = sinon.stub(controller.userWorkspaceDbService, 'getUserWorkspace').throws();
            resSpy = sinon.spy(res, 'status');
            const req = {
                payload: {
                    sub: 'user_id'
                },
                params: {
                    workspaceId: 'workspace_id'
                }
            };

            await controller.getUserWorkspace(req, res);

            assert.match(userWorkspaceDbServiceStub.callCount, 1);
            assert.match(userWorkspaceDbServiceStub.args[0][0], 'user_id');
            assert.match(userWorkspaceDbServiceStub.args[0][1], 'workspace_id');
            assert.calledWith(resSpy, 500);
        });
    });

    describe('postUserWorkspace', () => {
        it('should post user workspace', async () => {
            const controller = new UserWorkspaceController();

            userWorkspaceDbServiceStub = sinon.stub(controller.userWorkspaceDbService, 'initiateUserWorkspace').resolves({
                workspaceId: 'workspace_id'
            });
            resSpy = sinon.spy(res, 'status');
            resJsonSpy = sinon.spy(res, 'json');
            const req = {
                payload: {
                    sub: 'user_id'
                },
                body: {
                    workspaceId: 'workspace_id'
                }
            };

            await controller.postUserWorkspace(req, res);

            assert.match(userWorkspaceDbServiceStub.callCount, 1);
            assert.match(userWorkspaceDbServiceStub.args[0][0], 'user_id');
            assert.match(userWorkspaceDbServiceStub.args[0][1], { workspaceId: 'workspace_id' });
            assert.calledWith(resSpy, 201);
            assert.calledWith(resJsonSpy, { workspaceId: 'workspace_id' });
        });

        it('should return 500 if query returns null', async () => {
            const controller = new UserWorkspaceController();

            userWorkspaceDbServiceStub = sinon.stub(controller.userWorkspaceDbService, 'initiateUserWorkspace').resolves(null);
            resSpy = sinon.spy(res, 'status');
            const req = {
                payload: {
                    sub: 'user_id'
                },
                body: {
                    workspaceId: 'workspace_id'
                }
            };

            await controller.postUserWorkspace(req, res);

            assert.match(userWorkspaceDbServiceStub.callCount, 1);
            assert.match(userWorkspaceDbServiceStub.args[0][0], 'user_id');
            assert.match(userWorkspaceDbServiceStub.args[0][1], { workspaceId: 'workspace_id' });
            assert.calledWith(resSpy, 500);
        });

        it('should return 500 if query fails', async () => {
            const controller = new UserWorkspaceController();

            userWorkspaceDbServiceStub = sinon.stub(controller.userWorkspaceDbService, 'initiateUserWorkspace').throws();
            resSpy = sinon.spy(res, 'status');
            const req = {
                payload: {
                    sub: 'user_id'
                },
                body: {
                    workspaceId: 'workspace_id'
                }
            };

            await controller.postUserWorkspace(req, res);

            assert.match(userWorkspaceDbServiceStub.callCount, 1);
            assert.match(userWorkspaceDbServiceStub.args[0][0], 'user_id');
            assert.match(userWorkspaceDbServiceStub.args[0][1], { workspaceId: 'workspace_id' });
            assert.calledWith(resSpy, 500);
        });
    });
});
