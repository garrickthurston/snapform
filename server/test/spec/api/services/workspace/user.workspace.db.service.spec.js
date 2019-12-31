import sinon from 'sinon';
import UserWorkspaceDbService from '../../../../../api/services/workspace/user.workspace.db.service';
import * as db from '../../../../../utils/dbUtils';
import * as crypt from '../../../../../utils/encryptionUtils';

const { assert } = sinon;

describe('User Workspace DB Service', () => {
    let executeQueryStub;
    let guidStub;

    afterEach(() => {
        executeQueryStub && executeQueryStub.restore();
        guidStub && guidStub.restore();
    });

    describe('getAllUserWorkspaces', () => {
        it('should retrieve all user workspaces', async () => {
            const service = new UserWorkspaceDbService();

            executeQueryStub = sinon.stub(db, 'executeQuery').resolves({
                recordset: [{
                    workspace_id: 'workspace_id_1',
                    workspace_name: 'workspace_name_1',
                    project_id: 'project_id_1',
                    project_name: 'project_name_1'
                }, {
                    workspace_id: 'workspace_id_1',
                    workspace_name: 'workspace_name_1',
                    project_id: 'project_id_2',
                    project_name: 'project_name_2'
                }, {
                    workspace_id: 'workspace_id_2',
                    workspace_name: 'workspace_name_2',
                    project_id: 'project_id_3',
                    project_name: 'project_name_3'
                }]
            });

            const results = await service.getAllUserWorkspaces('user_id');

            assert.match(results, [{
                workspaceId: 'workspace_id_1',
                workspaceName: 'workspace_name_1',
                projects: [{
                    projectId: 'project_id_1',
                    projectName: 'project_name_1'
                }, {
                    projectId: 'project_id_2',
                    projectName: 'project_name_2'
                }]
            }, {
                workspaceId: 'workspace_id_2',
                workspaceName: 'workspace_name_2',
                projects: [{
                    projectId: 'project_id_3',
                    projectName: 'project_name_3'
                }]
            }]);
            assert.match(executeQueryStub.callCount, 1);
            assert.match(executeQueryStub.args[0][1][0].value, 'user_id');
        });
    });

    describe('initiateUserWorkspace', () => {
        it('should initiate user workspace and return', async () => {
            const service = new UserWorkspaceDbService();

            executeQueryStub = sinon.stub(db, 'executeQuery');
            executeQueryStub.onCall(0).resolves();
            executeQueryStub.onCall(1).resolves({
                recordset: [{
                    workspace_id: 'workspace_id',
                    workspace_name: 'Untitled Workspace',
                    project_id: 'project_id',
                    project_name: 'Untitled Project'
                }]
            });

            guidStub = sinon.stub(crypt, 'guid');
            guidStub.onCall(0).returns('project_id');
            guidStub.onCall(1).returns('workspace_id');

            const results = await service.initiateUserWorkspace('user_id');

            assert.match(results, {
                workspaceId: 'workspace_id',
                workspaceName: 'Untitled Workspace',
                projects: [{
                    projectId: 'project_id',
                    projectName: 'Untitled Project'
                }]
            });
            assert.match(executeQueryStub.callCount, 2);
            assert.match(executeQueryStub.args[0][1][0].value, 'user_id');
            assert.match(executeQueryStub.args[0][1][1].value, 'workspace_id');
            assert.match(executeQueryStub.args[0][1][2].value, 'Untitled Workspace');
            assert.match(executeQueryStub.args[0][1][3].value, 'project_id');
            assert.match(executeQueryStub.args[0][1][4].value, 'Untitled Project');
            assert.match(executeQueryStub.args[0][1][5].value, '{}');
            assert.match(executeQueryStub.args[0][1][6].value, '{}');
            assert.match(executeQueryStub.args[1][1][0].value, 'user_id');
            assert.match(executeQueryStub.args[1][1][1].value, 'workspace_id');
            assert.match(guidStub.callCount, 2);
        });

        it('should should throw if no user id', async () => {
            const service = new UserWorkspaceDbService();

            executeQueryStub = sinon.stub(db, 'executeQuery');
            guidStub = sinon.stub(crypt, 'guid');

            let e;
            let results;
            try {
                results = await service.initiateUserWorkspace();
            } catch (err) {
                e = err;
            } finally {
                assert.match(results, undefined);
                assert.match(!!e, true);
                assert.match(e.message, 'Unauthorized');
                assert.match(executeQueryStub.callCount, 0);
                assert.match(guidStub.callCount, 0);
            }
        });
    });

    describe('getUserWorkspace', () => {
        it('should get user workspace', async () => {
            const service = new UserWorkspaceDbService();

            executeQueryStub = sinon.stub(db, 'executeQuery').resolves({
                recordset: [{
                    workspace_id: 'workspace_id',
                    workspace_name: 'workspace_name',
                    project_id: 'project_id_1',
                    project_name: 'project_name_1'
                }, {
                    workspace_id: 'workspace_id',
                    workspace_name: 'workspace_name',
                    project_id: 'project_id_2',
                    project_name: 'project_name_2'
                }, {
                    workspace_id: 'workspace_id',
                    workspace_name: 'workspace_name',
                    project_id: 'project_id_3',
                    project_name: 'project_name_3'
                }]
            });

            const results = await service.getUserWorkspace('user_id', 'workspace_id');

            assert.match(results, {
                workspaceId: 'workspace_id',
                workspaceName: 'workspace_name',
                projects: [{
                    projectId: 'project_id_1',
                    projectName: 'project_name_1'
                }, {
                    projectId: 'project_id_2',
                    projectName: 'project_name_2'
                }, {
                    projectId: 'project_id_3',
                    projectName: 'project_name_3'
                }]
            });
            assert.match(executeQueryStub.callCount, 1);
            assert.match(executeQueryStub.args[0][1][0].value, 'user_id');
            assert.match(executeQueryStub.args[0][1][1].value, 'workspace_id');
        });
    });
});
