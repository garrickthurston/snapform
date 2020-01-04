import sinon from 'sinon';
import ProjectController from '../../../../api/controllers/workspace/project';

const { assert } = sinon;

describe('Project Controller', () => {
    let projectDbServiceStub;
    let workspaceDbServiceGetStub;
    let workspaceDbServiceUpdateStub;
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

        resSpy && resSpy.restore();
        resJsonSpy && resJsonSpy.restore();
    });

    describe('getProject', () => {
        it('should retrieve project', async () => {
            const controller = new ProjectController();

            projectDbServiceStub = sinon.stub(controller.projectDbService, 'getProject').resolves({
                project: { projectId: 'project_id' }
            });
            resSpy = sinon.spy(res, 'status');
            resJsonSpy = sinon.spy(res, 'json');
            const req = {
                params: {
                    workspaceId: 'workspace_id',
                    projectId: 'project_id'
                }
            };

            await controller.getProject(req, res);

            assert.match(projectDbServiceStub.callCount, 1);
            assert.match(projectDbServiceStub.args[0][0], 'workspace_id');
            assert.match(projectDbServiceStub.args[0][1], 'project_id');
            assert.calledWith(resSpy, 200);
            assert.calledWith(resJsonSpy, { project: { projectId: 'project_id' } });
        });

        it('should return 500 if query fails', async () => {
            const controller = new ProjectController();

            projectDbServiceStub = sinon.stub(controller.projectDbService, 'getProject').throws();
            resSpy = sinon.spy(res, 'status');
            const req = {
                params: {
                    workspaceId: 'workspace_id',
                    projectId: 'project_id'
                }
            };

            await controller.getProject(req, res);

            assert.match(projectDbServiceStub.callCount, 1);
            assert.match(projectDbServiceStub.args[0][0], 'workspace_id');
            assert.match(projectDbServiceStub.args[0][1], 'project_id');
            assert.calledWith(resSpy, 500);
        });
    });

    describe('updateProject', () => {
        it('should update project', async () => {
            const controller = new ProjectController();

            projectDbServiceStub = sinon.stub(controller.projectDbService, 'updateProject').resolves({
                project: { projectId: 'project_id' }
            });
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
            assert.calledWith(resSpy, 200);
            assert.calledWith(resJsonSpy, { project: { projectId: 'project_id' } });
        });

        it('should return 500 if query fails', async () => {
            const controller = new ProjectController();

            projectDbServiceStub = sinon.stub(controller.projectDbService, 'updateProject').throws();
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
            assert.calledWith(resSpy, 500);
        });
    });

    describe('postProject', () => {
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
});
