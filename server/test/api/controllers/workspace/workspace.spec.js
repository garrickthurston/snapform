import sinon from 'sinon';
import WorkspaceController from '../../../../api/controllers/workspace/workspace';
import * as crypt from '../../../../utils/encryptionUtils';

const { assert } = sinon;

describe('User Workspace Controller', () => {
    let workspaceDbServiceGetStub;
    let workspaceDbServiceUpdateStub;
    let isGuidStub;
    let resSpy;
    let resJsonSpy;

    const res = {
        status: () => res,
        json: () => res
    };

    afterEach(() => {
        workspaceDbServiceGetStub && workspaceDbServiceGetStub.restore();
        workspaceDbServiceUpdateStub && workspaceDbServiceUpdateStub.restore();
        isGuidStub && isGuidStub.restore();

        resSpy && resSpy.restore();
        resJsonSpy && resJsonSpy.restore();
    });

    describe('updateWorkspaceConfig', () => {
        it('should return 400 if workspace id not supplied or not valid guid', async () => {
            const controller = new WorkspaceController();

            workspaceDbServiceGetStub = sinon.stub(controller.workspaceDbService, 'getWorkspace');
            workspaceDbServiceUpdateStub = sinon.stub(controller.workspaceDbService, 'updateWorkspace');
            resSpy = sinon.spy(res, 'status');
            resJsonSpy = sinon.spy(res, 'json');
            let req = {
                params: { },
                body: {
                    activeProjectId: 'other_project_id',
                    activeProjectTabs: ['active_project_id, other_project_id']
                }
            };

            await controller.updateWorkspaceConfig(req, res);

            assert.match(workspaceDbServiceGetStub.callCount, 0);
            assert.match(workspaceDbServiceUpdateStub.callCount, 0);
            assert.calledWith(resSpy, 400);
            assert.calledWith(resJsonSpy, { error: 'Bad Request' });
            
            workspaceDbServiceGetStub.restore();
            workspaceDbServiceUpdateStub.restore();
            resSpy.restore();
            resJsonSpy.restore();
            req = {
                params: { workspaceId: 'workspace_id' },
                body: {
                    activeProjectId: 'other_project_id',
                    activeProjectTabs: ['active_project_id, other_project_id']
                }
            };

            await controller.updateWorkspaceConfig(req, res);

            assert.match(workspaceDbServiceGetStub.callCount, 0);
            assert.match(workspaceDbServiceUpdateStub.callCount, 0);
            assert.calledWith(resSpy, 400);
            assert.calledWith(resJsonSpy, { error: 'Bad Request' });
        });

        it('should update workspace config', async () => {
            const controller = new WorkspaceController();

            workspaceDbServiceGetStub = sinon.stub(controller.workspaceDbService, 'getWorkspace').resolves({
                workspaceId: 'workspace_id',
                userId: 'user_id',
                workspaceName: 'workspace_name',
                config: {
                    activeProjectId: 'active_project_id',
                    activeProjectTabs: ['active_project_id, other_project_id']
                }
            });
            workspaceDbServiceUpdateStub = sinon.stub(controller.workspaceDbService, 'updateWorkspace').resolves({
                workspaceId: 'workspace_id',
                userId: 'user_id',
                workspaceName: 'workspace_name',
                config: {
                    activeProjectId: 'other_project_id',
                    activeProjectTabs: ['active_project_id, other_project_id']
                }
            });
            isGuidStub = sinon.stub(crypt, 'isGuid').returns(true);
            resSpy = sinon.spy(res, 'status');
            resJsonSpy = sinon.spy(res, 'json');
            const req = {
                params: {
                    workspaceId: 'workspace_id'
                },
                body: {
                    activeProjectId: 'other_project_id',
                    activeProjectTabs: ['active_project_id, other_project_id']
                }
            };

            await controller.updateWorkspaceConfig(req, res);

            assert.match(workspaceDbServiceGetStub.callCount, 1);
            assert.match(workspaceDbServiceGetStub.args[0][0], 'workspace_id');
            assert.match(workspaceDbServiceUpdateStub.callCount, 1);
            assert.match(workspaceDbServiceUpdateStub.args[0][0], {
                workspaceId: 'workspace_id',
                userId: 'user_id',
                workspaceName: 'workspace_name',
                config: {
                    activeProjectId: 'other_project_id',
                    activeProjectTabs: ['active_project_id, other_project_id']
                }
            });
            assert.match(isGuidStub.callCount, 1);
            assert.calledWith(resSpy, 200);
            assert.calledWith(resJsonSpy, {
                workspaceId: 'workspace_id',
                userId: 'user_id',
                workspaceName: 'workspace_name',
                config: {
                    activeProjectId: 'other_project_id',
                    activeProjectTabs: ['active_project_id, other_project_id']
                }
            });
        });

        it('should return 500 if update fails', async () => {
            const controller = new WorkspaceController();

            workspaceDbServiceGetStub = sinon.stub(controller.workspaceDbService, 'getWorkspace').resolves({
                workspaceId: 'workspace_id',
                userId: 'user_id',
                workspaceName: 'workspace_name',
                config: {
                    activeProjectId: 'active_project_id',
                    activeProjectTabs: ['active_project_id, other_project_id']
                }
            });
            workspaceDbServiceUpdateStub = sinon.stub(controller.workspaceDbService, 'updateWorkspace').throws();
            isGuidStub = sinon.stub(crypt, 'isGuid').returns(true);
            resSpy = sinon.spy(res, 'status');
            const req = {
                params: {
                    workspaceId: 'workspace_id'
                },
                body: {
                    activeProjectId: 'other_project_id',
                    activeProjectTabs: ['active_project_id, other_project_id']
                }
            };

            await controller.updateWorkspaceConfig(req, res);

            assert.match(workspaceDbServiceGetStub.callCount, 1);
            assert.match(workspaceDbServiceGetStub.args[0][0], 'workspace_id');
            assert.match(workspaceDbServiceUpdateStub.callCount, 1);
            assert.match(workspaceDbServiceUpdateStub.args[0][0], {
                workspaceId: 'workspace_id',
                userId: 'user_id',
                workspaceName: 'workspace_name',
                config: {
                    activeProjectId: 'other_project_id',
                    activeProjectTabs: ['active_project_id, other_project_id']
                }
            });
            assert.match(isGuidStub.callCount, 1);
            assert.calledWith(resSpy, 500);
        });
    });

    describe('getAllUserWorkspaces', () => {
        it('should retrieve all user workspaces', async () => {
            const controller = new WorkspaceController();

            workspaceDbServiceGetStub = sinon.stub(controller.workspaceDbService, 'getAllUserWorkspaces').resolves({
                config: {
                    activeWorkspaceId: 'workspace_id'
                },
                results: [{
                    workspaceId: 'workspace_id',
                    workspaceName: 'workspace_name',
                    config: {
                        activeProjectId: null,
                        activeProjectTabs: []
                    },
                    projects: [{
                        projectId: 'project_id',
                        projectName: 'project_name',
                        config: {},
                        items: {}
                    }]
                }]
            });
            resSpy = sinon.spy(res, 'status');
            resJsonSpy = sinon.spy(res, 'json');
            const req = {
                payload: {
                    sub: 'user_id'
                }
            };

            await controller.getAllUserWorkspaces(req, res);

            assert.match(workspaceDbServiceGetStub.callCount, 1);
            assert.match(workspaceDbServiceGetStub.args[0][0], 'user_id');
            assert.calledWith(resSpy, 200);
            assert.calledWith(resJsonSpy, {
                config: {
                    activeWorkspaceId: 'workspace_id'
                },
                results: [{
                    workspaceId: 'workspace_id',
                    workspaceName: 'workspace_name',
                    config: {
                        activeProjectId: null,
                        activeProjectTabs: []
                    },
                    projects: [{
                        projectId: 'project_id',
                        projectName: 'project_name',
                        config: {},
                        items: {}
                    }]
                }]
            });
        });

        it('should return 500 if query fails', async () => {
            const controller = new WorkspaceController();

            workspaceDbServiceGetStub = sinon.stub(controller.workspaceDbService, 'getAllUserWorkspaces').throws();
            resSpy = sinon.spy(res, 'status');
            const req = {
                payload: {
                    sub: 'user_id'
                }
            };

            await controller.getAllUserWorkspaces(req, res);

            assert.match(workspaceDbServiceGetStub.callCount, 1);
            assert.match(workspaceDbServiceGetStub.args[0][0], 'user_id');
            assert.calledWith(resSpy, 500);
        });
    });

    describe('postUserWorkspace', () => {
        it('should post user workspace', async () => {
            const controller = new WorkspaceController();

            workspaceDbServiceUpdateStub = sinon.stub(controller.workspaceDbService, 'initiateUserWorkspace').resolves({
                workspaceId: 'workspace_id',
                workspaceName: 'workspace_name',
                config: {
                    activeProjectId: 'project_id',
                    activeProjectTabs: ['project_id']
                },
                projects: [{
                    projectId: 'project_id',
                    projectName: 'project_name',
                    config: {},
                    items: {}
                }]
            });
            resSpy = sinon.spy(res, 'status');
            resJsonSpy = sinon.spy(res, 'json');
            const req = {
                payload: {
                    sub: 'user_id'
                },
                body: { }
            };

            await controller.postUserWorkspace(req, res);

            assert.match(workspaceDbServiceUpdateStub.callCount, 1);
            assert.match(workspaceDbServiceUpdateStub.args[0][0], 'user_id');
            assert.match(workspaceDbServiceUpdateStub.args[0][1], { });
            assert.calledWith(resSpy, 201);
            assert.calledWith(resJsonSpy, {
                workspaceId: 'workspace_id',
                workspaceName: 'workspace_name',
                config: {
                    activeProjectId: 'project_id',
                    activeProjectTabs: ['project_id']
                },
                projects: [{
                    projectId: 'project_id',
                    projectName: 'project_name',
                    config: {},
                    items: {}
                }]
            });
        });

        it('should return 500 if post returns null', async () => {
            const controller = new WorkspaceController();

            workspaceDbServiceUpdateStub = sinon.stub(controller.workspaceDbService, 'initiateUserWorkspace').resolves(null);
            resSpy = sinon.spy(res, 'status');
            const req = {
                payload: {
                    sub: 'user_id'
                },
                body: { }
            };

            try {
                await controller.postUserWorkspace(req, res);
            } finally {
                assert.match(workspaceDbServiceUpdateStub.callCount, 1);
                assert.match(workspaceDbServiceUpdateStub.args[0][0], 'user_id');
                assert.match(workspaceDbServiceUpdateStub.args[0][1], { });
                assert.calledWith(resSpy, 500);
            }
        });

        it('should return 500 if post fails', async () => {
            const controller = new WorkspaceController();

            workspaceDbServiceUpdateStub = sinon.stub(controller.workspaceDbService, 'initiateUserWorkspace').throws();
            resSpy = sinon.spy(res, 'status');
            const req = {
                payload: {
                    sub: 'user_id'
                },
                body: { }
            };

            await controller.postUserWorkspace(req, res);
            
            assert.match(workspaceDbServiceUpdateStub.callCount, 1);
            assert.match(workspaceDbServiceUpdateStub.args[0][0], 'user_id');
            assert.match(workspaceDbServiceUpdateStub.args[0][1], { });
            assert.calledWith(resSpy, 500);
            
        });
    });

    describe('updateUserWorkspaceConfig', () => {
        it('should return 400 if active workspace id not supplied or is not valid guid', async () => {
            const controller = new WorkspaceController();

            workspaceDbServiceUpdateStub = sinon.stub(controller.workspaceDbService, 'updateUserWorkspaceConfig');
            resSpy = sinon.spy(res, 'status');
            resJsonSpy = sinon.spy(res, 'json');
            let req = {
                payload: {
                    sub: 'user_id'
                },
                body: { }
            };

            await controller.updateUserWorkspaceConfig(req, res);

            assert.match(workspaceDbServiceUpdateStub.callCount, 0);
            assert.calledWith(resSpy, 400);
            assert.calledWith(resJsonSpy, { error: 'Bad Request' });

            workspaceDbServiceUpdateStub.restore();
            resSpy.restore();
            resJsonSpy.restore();req = {
                payload: {
                    sub: 'user_id'
                },
                body: {
                    activeWorkspaceId: 'workspace_id'
                }
            };

            await controller.updateUserWorkspaceConfig(req, res);

            assert.match(workspaceDbServiceUpdateStub.callCount, 0);
            assert.calledWith(resSpy, 400);
            assert.calledWith(resJsonSpy, { error: 'Bad Request' });
        });

        it('should update user workspace config', async () => {
            const controller = new WorkspaceController();

            workspaceDbServiceUpdateStub = sinon.stub(controller.workspaceDbService, 'updateUserWorkspaceConfig').resolves({
                activeWorkspaceId: 'workspace_id'
            });
            isGuidStub = sinon.stub(crypt, 'isGuid').returns(true);
            resSpy = sinon.spy(res, 'status');
            resJsonSpy = sinon.spy(res, 'json');
            const req = {
                payload: {
                    sub: 'user_id'
                },
                body: {
                    activeWorkspaceId: 'workspace_id'
                }
            };

            await controller.updateUserWorkspaceConfig(req, res);

            assert.match(workspaceDbServiceUpdateStub.callCount, 1);
            assert.match(workspaceDbServiceUpdateStub.args[0][0], 'user_id');
            assert.match(workspaceDbServiceUpdateStub.args[0][1], 'workspace_id');
            assert.match(isGuidStub.callCount, 1);
            assert.calledWith(resSpy, 200);
            assert.calledWith(resJsonSpy, {
                activeWorkspaceId: 'workspace_id'
            });
        });

        it('should return 500 if update fails', async () => {
            const controller = new WorkspaceController();

            workspaceDbServiceUpdateStub = sinon.stub(controller.workspaceDbService, 'updateUserWorkspaceConfig').throws();
            isGuidStub = sinon.stub(crypt, 'isGuid').returns(true);
            resSpy = sinon.spy(res, 'status');
            const req = {
                payload: {
                    sub: 'user_id'
                },
                body: {
                    activeWorkspaceId: 'workspace_id'
                }
            };

            await controller.updateUserWorkspaceConfig(req, res);

            assert.match(workspaceDbServiceUpdateStub.callCount, 1);
            assert.match(workspaceDbServiceUpdateStub.args[0][0], 'user_id');
            assert.match(workspaceDbServiceUpdateStub.args[0][1], 'workspace_id');
            assert.match(isGuidStub.callCount, 1);
            assert.calledWith(resSpy, 500);
        });
    });
});
