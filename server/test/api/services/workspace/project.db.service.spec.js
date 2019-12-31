import sinon from 'sinon';
import ProjectDbService from '../../../../api/services/workspace/project.db.service';
import * as db from '../../../../utils/dbUtils';

const { assert } = sinon;

describe('Project DB Service', () => {
    let executeQueryStub;

    afterEach(() => {
        executeQueryStub && executeQueryStub.restore();
    });

    describe('getProject', () => {
        it('should retrieve project', async () => {
            const service = new ProjectDbService();

            executeQueryStub = sinon.stub(db, 'executeQuery').resolves({
                recordset: [{
                    project_id: 'project_id',
                    project_name: 'project_name',
                    workspace_id: 'workspace_id',
                    config: '{}',
                    items: '{}'
                }]
            });

            const result = await service.getProject('workspace_id', 'project_id');

            assert.match(result, {
                projectId: 'project_id',
                projectName: 'project_name',
                workspaceId: 'workspace_id',
                config: {},
                items: {}
            });
            assert.match(executeQueryStub.callCount, 1);
            assert.match(executeQueryStub.args[0][1][0].value, 'workspace_id');
            assert.match(executeQueryStub.args[0][1][1].value, 'project_id');
        });

        it('should return null if no project', async () => {
            const service = new ProjectDbService();

            executeQueryStub = sinon.stub(db, 'executeQuery').resolves({
                recordset: []
            });

            const result = await service.getProject('workspace_id', 'project_id');

            assert.match(result, null);
            assert.match(executeQueryStub.callCount, 1);
            assert.match(executeQueryStub.args[0][1][0].value, 'workspace_id');
            assert.match(executeQueryStub.args[0][1][1].value, 'project_id');
        });
    });

    it('updateProject', () => {
        it('should update project and return', async () => {
            const service = new ProjectDbService();
            const project = {
                projectId: 'project_id',
                projectName: 'updated_project_name',
                workspaceId: 'workspace_id',
                config: { prop2: 'prop_1' },
                items: { prop2: 'prop_2'}
            };
            
            executeQueryStub = sinon.stub(db, 'executeQuery');
            executeQueryStub.onCall(0).resolves();
            executeQueryStub.onCall(1).resolves({
                recordset: [{
                    ...project,
                    config: JSON.stringify(project.config),
                    items: JSON.stringify(project.items)
                }]
            });

            const result = await service.updateProject('workspace_id', 'project_id', project);

            assert.match(result, project);
            assert.match(executeQueryStub.callCount, 2);
            assert.match(executeQueryStub.args[0][1][0].value, 'workspace_id');
            assert.match(executeQueryStub.args[0][1][1].value, 'project_id');
            assert.match(executeQueryStub.args[0][1][2].value, 'updated_project_name');
            assert.match(executeQueryStub.args[0][1][3].value, JSON.stringify(project.config));
            assert.match(executeQueryStub.args[0][1][4].value, JSON.stringify(project.items));
            assert.match(executeQueryStub.args[1][1][0].value, 'workspace_id');
            assert.match(executeQueryStub.args[1][1][1].value, 'project_id');
        });
    });
});
