import sinon from 'sinon';
import ProjectController from '../../../../api/controllers/workspace/project';
import * as crypt from '../../../../utils/encryptionUtils';

const { assert } = sinon;

describe('Project Controller', () => {
    let projectDbServiceStub;
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
        projectDbServiceStub && projectDbServiceStub.restore();
        workspaceDbServiceGetStub && workspaceDbServiceGetStub.restore();
        workspaceDbServiceUpdateStub && workspaceDbServiceUpdateStub.restore();
        isGuidStub && isGuidStub.restore();

        resSpy && resSpy.restore();
        resJsonSpy && resJsonSpy.restore();
    });

    describe('getProject', () => {
        it('should return 400 if project id not supplied or is not valid guid', async () => {
            const controller = new ProjectController();

            projectDbServiceStub = sinon.stub(controller.projectDbService, 'getProject');
            resSpy = sinon.spy(res, 'status');
            resJsonSpy = sinon.spy(res, 'json');
            let req = {
                params: { }
            };

            await controller.getProject(req, res);

            assert.match(projectDbServiceStub.callCount, 0);
            assert.calledWith(resSpy, 400);
            assert.calledWith(resJsonSpy, { error: 'Bad Request' });
            
            projectDbServiceStub.restore();
            resSpy.restore();
            resJsonSpy.restore();
        
            req = {
                params: { projectId: 'project_id' }
            };

            await controller.getProject(req, res);

            assert.match(projectDbServiceStub.callCount, 0);
            assert.calledWith(resSpy, 400);
            assert.calledWith(resJsonSpy, { error: 'Bad Request' });
        });

        it('should retrieve project', async () => {
            const controller = new ProjectController();

            projectDbServiceStub = sinon.stub(controller.projectDbService, 'getProject').resolves({
                project: { projectId: 'project_id' }
            });
            isGuidStub = sinon.stub(crypt, 'isGuid').returns(true);
            resSpy = sinon.spy(res, 'status');
            resJsonSpy = sinon.spy(res, 'json');
            const req = {
                params: {
                    projectId: 'project_id'
                }
            };

            await controller.getProject(req, res);

            assert.match(projectDbServiceStub.callCount, 1);
            assert.match(projectDbServiceStub.args[0][0], 'project_id');
            assert.match(isGuidStub.callCount, 1);
            assert.calledWith(resSpy, 200);
            assert.calledWith(resJsonSpy, { project: { projectId: 'project_id' } });
        });

        it('should return 500 if query fails', async () => {
            const controller = new ProjectController();

            projectDbServiceStub = sinon.stub(controller.projectDbService, 'getProject').throws();
            isGuidStub = sinon.stub(crypt, 'isGuid').returns(true);
            resSpy = sinon.spy(res, 'status');
            const req = {
                params: {
                    projectId: 'project_id'
                }
            };

            await controller.getProject(req, res);

            assert.match(projectDbServiceStub.callCount, 1);
            assert.match(projectDbServiceStub.args[0][0], 'project_id');
            assert.match(isGuidStub.callCount, 1);
            assert.calledWith(resSpy, 500);
        });
    });

    describe('updateProject', () => {
        it('should return 400 if workspace or project id not supplied or are not valid guids', async () => {
            const controller = new ProjectController();

            projectDbServiceStub = sinon.stub(controller.projectDbService, 'updateProject');
            resSpy = sinon.spy(res, 'status');
            resJsonSpy = sinon.spy(res, 'json');
            let req = {
                params: { },
                body: { }
            };

            await controller.updateProject(req, res);

            assert.match(projectDbServiceStub.callCount, 0);
            assert.calledWith(resSpy, 400);
            assert.calledWith(resJsonSpy, { error: 'Bad Request' });
            
            projectDbServiceStub.restore();
            resSpy.restore();
            resJsonSpy.restore();
            req = {
                params: { workspaceId: 'workspace_id' },
                body: { }
            };

            await controller.updateProject(req, res);

            assert.match(projectDbServiceStub.callCount, 0);
            assert.calledWith(resSpy, 400);
            assert.calledWith(resJsonSpy, { error: 'Bad Request' });
            
            projectDbServiceStub.restore();
            resSpy.restore();
            resJsonSpy.restore();
            req = {
                params: { projectId: 'project_id' },
                body: { }
            };

            await controller.updateProject(req, res);

            assert.match(projectDbServiceStub.callCount, 0);
            assert.calledWith(resSpy, 400);
            assert.calledWith(resJsonSpy, { error: 'Bad Request' });
            
            projectDbServiceStub.restore();
            resSpy.restore();
            resJsonSpy.restore();
            req = {
                params: { workspaceId: 'workspace_id', projectId: 'project_id' },
                body: { }
            };

            await controller.updateProject(req, res);

            assert.match(projectDbServiceStub.callCount, 0);
            assert.calledWith(resSpy, 400);
            assert.calledWith(resJsonSpy, { error: 'Bad Request' });
        });

        it('should update project', async () => {
            const controller = new ProjectController();

            projectDbServiceStub = sinon.stub(controller.projectDbService, 'updateProject').resolves({
                project: { projectId: 'project_id' }
            });
            isGuidStub = sinon.stub(crypt, 'isGuid').returns(true);
            resSpy = sinon.spy(res, 'status');
            resJsonSpy = sinon.spy(res, 'json');
            const req = {
                params: {
                    workspaceId: 'workspace_id',
                    projectId: 'project_id'
                },
                body: {
                    projectId: 'project_id',
                    projectName: 'project_name'
                }
            };

            await controller.updateProject(req, res);

            assert.match(projectDbServiceStub.callCount, 1);
            assert.match(projectDbServiceStub.args[0][0], 'workspace_id');
            assert.match(projectDbServiceStub.args[0][1], 'project_id');
            assert.match(projectDbServiceStub.args[0][2], {
                projectId: 'project_id',
                projectName: 'project_name'
            });
            assert.match(isGuidStub.callCount, 2);
            assert.calledWith(resSpy, 200);
            assert.calledWith(resJsonSpy, { project: { projectId: 'project_id' } });
        });

        it('should return 500 if query fails', async () => {
            const controller = new ProjectController();

            projectDbServiceStub = sinon.stub(controller.projectDbService, 'updateProject').throws();
            isGuidStub = sinon.stub(crypt, 'isGuid').returns(true);
            resSpy = sinon.spy(res, 'status');
            const req = {
                params: {
                    workspaceId: 'workspace_id',
                    projectId: 'project_id'
                },
                body: {
                    projectId: 'project_id',
                    projectName: 'project_name'
                }
            };

            await controller.updateProject(req, res);

            assert.match(projectDbServiceStub.callCount, 1);
            assert.match(projectDbServiceStub.args[0][0], 'workspace_id');
            assert.match(projectDbServiceStub.args[0][1], 'project_id');
            assert.match(projectDbServiceStub.args[0][2], {
                projectId: 'project_id',
                projectName: 'project_name'
            });
            assert.match(isGuidStub.callCount, 2);
            assert.calledWith(resSpy, 500);
        });
    });

    describe('postProject', () => {
        it('should return 400 if workspace id not supplied or is not valid guid', async () => {
            const controller = new ProjectController();

            projectDbServiceStub = sinon.stub(controller.projectDbService, 'initiateProject');
            workspaceDbServiceGetStub = sinon.stub(controller.workspaceDbService, 'getWorkspace')
            workspaceDbServiceUpdateStub = sinon.stub(controller.workspaceDbService, 'updateWorkspace');
            resSpy = sinon.spy(res, 'status');
            resJsonSpy = sinon.spy(res, 'json');
            let req = {
                params: { }
            };

            await controller.postProject(req, res);

            assert.match(projectDbServiceStub.callCount, 0);
            assert.match(workspaceDbServiceGetStub.callCount, 0);
            assert.match(workspaceDbServiceUpdateStub.callCount, 0);
            assert.calledWith(resSpy, 400);
            assert.calledWith(resJsonSpy, { error: 'Bad Request' });

            projectDbServiceStub.restore();
            workspaceDbServiceGetStub.restore();
            workspaceDbServiceUpdateStub.restore();
            resSpy.restore();
            resJsonSpy.restore();
            req = {
                params: { workspaceId: 'workspace_id' }
            };

            await controller.postProject(req, res);

            assert.match(projectDbServiceStub.callCount, 0);
            assert.match(workspaceDbServiceGetStub.callCount, 0);
            assert.match(workspaceDbServiceUpdateStub.callCount, 0);
            assert.calledWith(resSpy, 400);
            assert.calledWith(resJsonSpy, { error: 'Bad Request' });
        });

        it('should post project without defaults', async () => {
            const controller = new ProjectController();

            projectDbServiceStub = sinon.stub(controller.projectDbService, 'initiateProject').resolves({
                projectId: 'project_id',
                projectName: 'project_name',
                config: {},
                items: {}
            });
            workspaceDbServiceGetStub = sinon.stub(controller.workspaceDbService, 'getWorkspace').resolves({
                workspaceId: 'workspace_id',
                userId: 'user_id',
                workspaceName: 'workspace_name',
                config: {
                    activeProjectId: 'active_project_id',
                    activeProjectTabs: ['active_project_id']
                }
            });
            workspaceDbServiceUpdateStub = sinon.stub(controller.workspaceDbService, 'updateWorkspace').resolves();
            isGuidStub = sinon.stub(crypt, 'isGuid').returns(true);
            resSpy = sinon.spy(res, 'status');
            resJsonSpy = sinon.spy(res, 'json');
            const req = {
                params: {
                    workspaceId: 'workspace_id'
                }
            };

            await controller.postProject(req, res);

            assert.match(projectDbServiceStub.callCount, 1);
            assert.match(projectDbServiceStub.args[0][0], 'workspace_id');
            assert.match(projectDbServiceStub.args[0][1], null);
            assert.match(workspaceDbServiceGetStub.callCount, 1);
            assert.match(workspaceDbServiceGetStub.args[0][0], 'workspace_id');
            assert.match(workspaceDbServiceUpdateStub.callCount, 1);
            assert.match(workspaceDbServiceUpdateStub.args[0][0], {
                workspaceId: 'workspace_id',
                userId: 'user_id',
                workspaceName: 'workspace_name',
                config: {
                    activeProjectId: 'project_id',
                    activeProjectTabs: ['active_project_id', 'project_id']
                }
            });
            assert.match(isGuidStub.callCount, 1);
            assert.calledWith(resSpy, 201);
            assert.calledWith(resJsonSpy, {
                projectId: 'project_id',
                projectName: 'project_name',
                config: {},
                items: {}
            });
        });

        it('should post project with defaults', async () => {
            const controller = new ProjectController();

            projectDbServiceStub = sinon.stub(controller.projectDbService, 'initiateProject').resolves({
                projectId: 'project_id',
                projectName: 'some-other-name',
                config: {},
                items: {}
            });
            workspaceDbServiceGetStub = sinon.stub(controller.workspaceDbService, 'getWorkspace').resolves({
                workspaceId: 'workspace_id',
                userId: 'user_id',
                workspaceName: 'workspace_name',
                config: {
                    activeProjectId: 'active_project_id',
                    activeProjectTabs: ['active_project_id']
                }
            });
            workspaceDbServiceUpdateStub = sinon.stub(controller.workspaceDbService, 'updateWorkspace').resolves();
            isGuidStub = sinon.stub(crypt, 'isGuid').returns(true);
            resSpy = sinon.spy(res, 'status');
            resJsonSpy = sinon.spy(res, 'json');
            const req = {
                params: {
                    workspaceId: 'workspace_id'
                },
                body: {
                    projectName: 'some-other-name'
                }
            };

            await controller.postProject(req, res);

            assert.match(projectDbServiceStub.callCount, 1);
            assert.match(projectDbServiceStub.args[0][0], 'workspace_id');
            assert.match(projectDbServiceStub.args[0][1], 'some-other-name');
            assert.match(workspaceDbServiceGetStub.callCount, 1);
            assert.match(workspaceDbServiceGetStub.args[0][0], 'workspace_id');
            assert.match(workspaceDbServiceUpdateStub.callCount, 1);
            assert.match(workspaceDbServiceUpdateStub.args[0][0], {
                workspaceId: 'workspace_id',
                userId: 'user_id',
                workspaceName: 'workspace_name',
                config: {
                    activeProjectId: 'project_id',
                    activeProjectTabs: ['active_project_id', 'project_id']
                }
            });
            assert.match(isGuidStub.callCount, 1);
            assert.calledWith(resSpy, 201);
            assert.calledWith(resJsonSpy, {
                projectId: 'project_id',
                projectName: 'some-other-name',
                config: {},
                items: {}
            });
        });

        it('should return 500 if query fails', async () => {
            const controller = new ProjectController();

            projectDbServiceStub = sinon.stub(controller.projectDbService, 'initiateProject').throws();
            isGuidStub = sinon.stub(crypt, 'isGuid').returns(true);
            resSpy = sinon.spy(res, 'status');
            const req = {
                params: {
                    workspaceId: 'workspace_id'
                }
            };

            await controller.postProject(req, res);

            assert.match(projectDbServiceStub.callCount, 1);
            assert.match(projectDbServiceStub.args[0][0], 'workspace_id');
            assert.match(projectDbServiceStub.args[0][1], null);
            assert.calledWith(resSpy, 500);
        });
    });

    describe('deleteProject', () => {
        it('should return 400 if workspace or project id not supplied or are not valid guids', async () => {
            const controller = new ProjectController();

            projectDbServiceStub = sinon.stub(controller.projectDbService, 'deleteProject');
            workspaceDbServiceGetStub = sinon.stub(controller.workspaceDbService, 'getWorkspace');
            workspaceDbServiceUpdateStub = sinon.stub(controller.workspaceDbService, 'updateWorkspace');
            resSpy = sinon.spy(res, 'status');
            resJsonSpy = sinon.spy(res, 'json');
            let req = {
                payload: {
                    sub: 'user_id'
                },
                params: { }
            };

            await controller.deleteProject(req, res);

            assert.match(projectDbServiceStub.callCount, 0);
            assert.match(workspaceDbServiceGetStub.callCount, 0);
            assert.match(workspaceDbServiceUpdateStub.callCount, 0);
            assert.calledWith(resSpy, 400);
            assert.calledWith(resJsonSpy, { error: 'Bad Request' });

            projectDbServiceStub.restore();
            workspaceDbServiceGetStub.restore();
            workspaceDbServiceUpdateStub.restore();
            resSpy.restore();
            resJsonSpy.restore();
            req = {
                payload: {
                    sub: 'user_id'
                },
                params: { workspaceId: 'workspace_id' }
            };

            await controller.deleteProject(req, res);

            assert.match(projectDbServiceStub.callCount, 0);
            assert.match(workspaceDbServiceGetStub.callCount, 0);
            assert.match(workspaceDbServiceUpdateStub.callCount, 0);
            assert.calledWith(resSpy, 400);
            assert.calledWith(resJsonSpy, { error: 'Bad Request' });

            projectDbServiceStub.restore();
            workspaceDbServiceGetStub.restore();
            workspaceDbServiceUpdateStub.restore();
            resSpy.restore();
            resJsonSpy.restore();
            req = {
                payload: {
                    sub: 'user_id'
                },
                params: { projectId: 'project_id' }
            };

            await controller.deleteProject(req, res);

            assert.match(projectDbServiceStub.callCount, 0);
            assert.match(workspaceDbServiceGetStub.callCount, 0);
            assert.match(workspaceDbServiceUpdateStub.callCount, 0);
            assert.calledWith(resSpy, 400);
            assert.calledWith(resJsonSpy, { error: 'Bad Request' });

            projectDbServiceStub.restore();
            workspaceDbServiceGetStub.restore();
            workspaceDbServiceUpdateStub.restore();
            resSpy.restore();
            resJsonSpy.restore();
            req = {
                payload: {
                    sub: 'user_id'
                },
                params: { workspaceId: 'workspace_id', projectId: 'project_id' }
            };

            await controller.deleteProject(req, res);

            assert.match(projectDbServiceStub.callCount, 0);
            assert.match(workspaceDbServiceGetStub.callCount, 0);
            assert.match(workspaceDbServiceUpdateStub.callCount, 0);
            assert.calledWith(resSpy, 400);
            assert.calledWith(resJsonSpy, { error: 'Bad Request' });
        });

        it('should delete project and return updated workspace', async () => {
            const controller = new ProjectController();

            projectDbServiceStub = sinon.stub(controller.projectDbService, 'deleteProject').resolves();
            workspaceDbServiceGetStub = sinon.stub(controller.workspaceDbService, 'getWorkspace');
            workspaceDbServiceGetStub.onCall(0).resolves({
                workspaceId: 'workspace_id',
                workspaceName: 'workspace_name',
                config: {
                    activeProjectId: 'project_id',
                    activeProjectTabs: ['project_id']
                }
            });
            workspaceDbServiceGetStub.onCall(1).resolves({
                workspaceId: 'workspace_id',
                workspaceName: 'workspace_name',
                config: {
                    activeProjectId: null,
                    activeProjectTabs: []
                }
            });
            workspaceDbServiceUpdateStub = sinon.stub(controller.workspaceDbService, 'updateWorkspace').resolves();
            isGuidStub = sinon.stub(crypt, 'isGuid').returns(true);
            resSpy = sinon.spy(res, 'status');
            resJsonSpy = sinon.spy(res, 'json');
            const req = {
                payload: {
                    sub: 'user_id'
                },
                params: {
                    workspaceId: 'workspace_id',
                    projectId: 'project_id'
                }
            };

            await controller.deleteProject(req, res);

            assert.match(projectDbServiceStub.callCount, 1);
            assert.match(projectDbServiceStub.args[0][0], 'user_id');
            assert.match(projectDbServiceStub.args[0][1], 'workspace_id');
            assert.match(projectDbServiceStub.args[0][2], 'project_id');
            assert.match(workspaceDbServiceGetStub.callCount, 2);
            assert.match(workspaceDbServiceGetStub.args[0][0], 'workspace_id');
            assert.match(workspaceDbServiceGetStub.args[1][0], 'workspace_id');
            assert.match(workspaceDbServiceUpdateStub.callCount, 1);
            assert.match(workspaceDbServiceUpdateStub.args[0][0], {
                workspaceId: 'workspace_id',
                workspaceName: 'workspace_name',
                config: {
                    activeProjectId: null,
                    activeProjectTabs: []
                }
            });
            assert.match(isGuidStub.callCount, 2);
            assert.calledWith(resSpy, 200);
            assert.calledWith(resJsonSpy, {
                workspaceId: 'workspace_id',
                workspaceName: 'workspace_name',
                config: {
                    activeProjectId: null,
                    activeProjectTabs: []
                }
            });
        });

        it('should return 500 if query fails', async () => {
            const controller = new ProjectController();

            projectDbServiceStub = sinon.stub(controller.projectDbService, 'deleteProject').throws();
            workspaceDbServiceGetStub = sinon.stub(controller.workspaceDbService, 'getWorkspace');
            workspaceDbServiceUpdateStub = sinon.stub(controller.workspaceDbService, 'updateWorkspace');
            isGuidStub = sinon.stub(crypt, 'isGuid').returns(true);
            resSpy = sinon.spy(res, 'status');
            const req = {
                payload: {
                    sub: 'user_id'
                },
                params: {
                    workspaceId: 'workspace_id',
                    projectId: 'project_id'
                }
            };

            await controller.deleteProject(req, res);

            assert.match(projectDbServiceStub.callCount, 1);
            assert.match(projectDbServiceStub.args[0][0], 'user_id');
            assert.match(projectDbServiceStub.args[0][1], 'workspace_id');
            assert.match(projectDbServiceStub.args[0][2], 'project_id');
            assert.match(workspaceDbServiceGetStub.callCount, 0);
            assert.match(workspaceDbServiceUpdateStub.callCount, 0);
            assert.match(isGuidStub.callCount, 2);
            assert.calledWith(resSpy, 500);
        });
    });
});
