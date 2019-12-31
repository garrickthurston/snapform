import sinon from 'sinon';
import ProjectController from '../../../../../api/controllers/workspace/project';

const { assert } = sinon;

describe('Project Controller', () => {
    let projectDbServiceStub;
    let resSpy;
    let resJsonSpy;

    const res = {
        status: () => res,
        json: () => res
    };

    afterEach(() => {
        projectDbServiceStub && projectDbServiceStub.restore();

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

    describe('getProject', () => {
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
});
