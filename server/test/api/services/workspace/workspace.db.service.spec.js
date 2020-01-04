import sinon from 'sinon';
import WorkspaceDbService from '../../../../api/services/workspace/workspace.db.service';
import * as db from '../../../../utils/dbUtils';
import * as crypt from '../../../../utils/encryptionUtils';

const { assert } = sinon;

describe('User Workspace DB Service', () => {
    let executeQueryStub;
    let projectDbServiceStub;
    let guidStub;

    afterEach(() => {
        executeQueryStub && executeQueryStub.restore();
        projectDbServiceStub && projectDbServiceStub.restore();
        guidStub && guidStub.restore();
    });

    describe('getAllUserWorkspaces', () => {
        it('should throw if null userId supplied', async () => {
            const service = new WorkspaceDbService();

            let e;
            let result;
            try {
                await service.getAllUserWorkspaces();
            } catch (err) {
                e = err;
            } finally {
                assert.match(result, undefined);
                assert.match(!!e, true);
                assert.match(e.message, 'Unauthorized');
            }
        });

        it('should retrieve all user workspaces', async () => {
            const service = new WorkspaceDbService();

            executeQueryStub = sinon.stub(db, 'executeQuery');
            executeQueryStub.onCall(0).resolves({
                recordset: [{
                    activeWorkspaceId: 'workspace_id'
                }]
            });
            executeQueryStub.onCall(1).resolves({
                recordset: [{
                    workspaceId: 'workspace_id',
                    workspaceName: 'workspace_name',
                    config: JSON.stringify({
                        activeProjectId: 'project_id',
                        activeProjectTabs: ['project_id']
                    }),
                    projectId: 'project_id',
                    projectName: 'project_name'
                }]
            });
            projectDbServiceStub = sinon.stub(service.projectDbService, 'getProject');
            projectDbServiceStub.onCall(0).resolves({
                projectId: 'project_id',
                projectName: 'project_name',
                workspaceId: 'workspace_id',
                config: {},
                items: {}
            });

            const results = await service.getAllUserWorkspaces('user_id');

            assert.match(results, {
                config: {
                    activeWorkspaceId: 'workspace_id'
                },
                results: [{
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
                }]
            });
            assert.match(executeQueryStub.callCount, 2);
            assert.match(executeQueryStub.args[0][1][0].value, 'user_id');
            assert.match(executeQueryStub.args[1][1][0].value, 'user_id');
            assert.match(projectDbServiceStub.callCount, 1);
            assert.match(projectDbServiceStub.args[0][0], 'project_id');
        });

        it('should initiate workspace if none exist', async () => {
            const service = new WorkspaceDbService();

            executeQueryStub = sinon.stub(db, 'executeQuery');
            executeQueryStub.onCall(0).resolves({
                recordset: []
            });
            executeQueryStub.onCall(1).resolves({
                recordset: []
            });
            executeQueryStub.onCall(2).resolves();
            executeQueryStub.onCall(3).resolves({
                recordset: [{
                    activeWorkspaceId: 'workspace_id'
                }]
            });
            executeQueryStub.onCall(4).resolves({
                recordset: [{
                    workspaceId: 'workspace_id',
                    workspaceName: 'Untitled Workspace',
                    config: JSON.stringify({
                        activeProjectId: 'project_id',
                        activeProjectTabs: ['project_id']
                    }),
                    projectId: 'project_id',
                    projectName: 'Untitled Project'
                }]
            });
            
            projectDbServiceStub = sinon.stub(service.projectDbService, 'getProject');
            projectDbServiceStub.onCall(0).resolves({
                projectId: 'project_id',
                projectName: 'Untitled Project',
                workspaceId: 'workspace_id',
                config: {},
                items: {}
            });

            guidStub = sinon.stub(crypt, 'guid');
            guidStub.onCall(0).returns('workspace_id');
            guidStub.onCall(1).returns('project_id');

            const results = await service.getAllUserWorkspaces('user_id');

            assert.match(results, {
                config: {
                    activeWorkspaceId: 'workspace_id'
                },
                results: [{
                    workspaceId: 'workspace_id',
                    workspaceName: 'Untitled Workspace',
                    config: {
                        activeProjectId: 'project_id',
                        activeProjectTabs: ['project_id']
                    },
                    projects: [{
                        projectId: 'project_id',
                        projectName: 'Untitled Project',
                        config: {},
                        items: {}
                    }]
                }]
            });
            assert.match(executeQueryStub.callCount, 5);
            assert.match(executeQueryStub.args[0][1][0].value, 'user_id');
            assert.match(executeQueryStub.args[1][1][0].value, 'user_id');
            assert.match(executeQueryStub.args[2][1][0].value, 'user_id');
            assert.match(executeQueryStub.args[2][1][1].value, 'workspace_id');
            assert.match(executeQueryStub.args[2][1][2].value, 'Untitled Workspace');
            assert.match(executeQueryStub.args[2][1][3].value, JSON.stringify({ activeProjectId: 'project_id', activeProjectTabs: ['project_id'] }));
            assert.match(executeQueryStub.args[2][1][4].value, 'project_id');
            assert.match(executeQueryStub.args[2][1][5].value, 'Untitled Project');
            assert.match(executeQueryStub.args[2][1][6].value, '{}');
            assert.match(executeQueryStub.args[2][1][7].value, '{}');
            assert.match(executeQueryStub.args[3][1][0].value, 'user_id');
            assert.match(executeQueryStub.args[4][1][0].value, 'user_id');
            assert.match(projectDbServiceStub.callCount, 1);
            assert.match(projectDbServiceStub.args[0][0], 'project_id');
            assert.match(guidStub.callCount, 2);
        });
    });

    describe('initiateUserWorkspace', () => {
        it('should throw if no user id supplied', async () => {
            const service = new WorkspaceDbService();
    
            let e;
            let result;
            try {
                result = await service.initiateUserWorkspace();
            } catch (err) {
                e = err;
            } finally {
                assert.match(result, undefined);
                assert.match(!!e, true);
                assert.match(e.message, 'Unauthorized');
            }
        });
    
        it('should initiate user workspace', async () => {
            const service = new WorkspaceDbService();
    
            executeQueryStub = sinon.stub(db, 'executeQuery');
            executeQueryStub.onCall(0).resolves();
            executeQueryStub.onCall(1).resolves({
                recordset: [{
                    activeWorkspaceId: 'workspace_id'
                }]
            });
            executeQueryStub.onCall(2).resolves({
                recordset: [{
                    workspaceId: 'workspace_id',
                    workspaceName: 'Untitled Workspace',
                    config: JSON.stringify({
                        activeProjectId: 'project_id',
                        activeProjectTabs: ['project_id']
                    }),
                    projectId: 'project_id',
                    projectName: 'Untitled Project'
                }]
            });
    
            projectDbServiceStub = sinon.stub(service.projectDbService, 'getProject');
            projectDbServiceStub.onCall(0).resolves({
                projectId: 'project_id',
                projectName: 'Untitled Project',
                workspaceId: 'workspace_id',
                config: {},
                items: {}
            });
    
            guidStub = sinon.stub(crypt, 'guid');
            guidStub.onCall(0).returns('workspace_id');
            guidStub.onCall(1).returns('project_id');
    
            const result = await service.initiateUserWorkspace('user_id');
    
            assert.match(result, {
                config: {
                    activeWorkspaceId: 'workspace_id'
                },
                results: [{
                    workspaceId: 'workspace_id',
                    workspaceName: 'Untitled Workspace',
                    config: {
                        activeProjectId: 'project_id',
                        activeProjectTabs: ['project_id']
                    },
                    projects: [{
                        projectId: 'project_id',
                        projectName: 'Untitled Project',
                        config: {},
                        items: {}
                    }]
                }]
            });
            assert.match(executeQueryStub.callCount, 3);
            assert.match(executeQueryStub.args[0][1][0].value, 'user_id');
            assert.match(executeQueryStub.args[0][1][1].value, 'workspace_id');
            assert.match(executeQueryStub.args[0][1][2].value, 'Untitled Workspace');
            assert.match(executeQueryStub.args[0][1][3].value, JSON.stringify({ activeProjectId: 'project_id', activeProjectTabs: ['project_id'] }));
            assert.match(executeQueryStub.args[0][1][4].value, 'project_id');
            assert.match(executeQueryStub.args[0][1][5].value, 'Untitled Project');
            assert.match(executeQueryStub.args[0][1][6].value, '{}');
            assert.match(executeQueryStub.args[0][1][7].value, '{}');
            assert.match(executeQueryStub.args[1][1][0].value, 'user_id');
            assert.match(executeQueryStub.args[2][1][0].value, 'user_id');
            assert.match(projectDbServiceStub.callCount, 1);
            assert.match(projectDbServiceStub.args[0][0], 'project_id');
            assert.match(guidStub.callCount, 2);
        });
    });

    describe('getWorkspace', () => {
        it('should get workspace', async () => {
            const service = new WorkspaceDbService();

            executeQueryStub = sinon.stub(db, 'executeQuery').resolves({
                recordset: [{
                    workspaceId: 'workspace_id',
                    workspaceName: 'workspace_name',
                    config: JSON.stringify({
                        activeProjectId: 'project_id',
                        activeProjectTabs: ['project_id']
                    }),
                    userId: 'user_id'
                }]
            });

            const result = await service.getWorkspace('workspace_id');

            assert.match(result, {
                workspaceId: 'workspace_id',
                workspaceName: 'workspace_name',
                config: {
                    activeProjectId: 'project_id',
                    activeProjectTabs: ['project_id']
                },
                userId: 'user_id'
            });
            assert.match(executeQueryStub.callCount, 1);
            assert.match(executeQueryStub.args[0][1][0].value, 'workspace_id');
        });
    });

    describe('updateWorkspace', () => {
        it('should update workspace and return it', async () => {
            const service = new WorkspaceDbService();

            executeQueryStub = sinon.stub(db, 'executeQuery');
            executeQueryStub.onCall(0).resolves();
            executeQueryStub.onCall(1).resolves({
                recordset: [{
                    workspaceId: 'workspace_id',
                    workspaceName: 'workspace_name',
                    config: JSON.stringify({
                        activeProjectId: 'project_id',
                        activeProjectTabs: ['project_id']
                    }),
                    userId: 'user_id'
                }]
            });

            const result = await service.updateWorkspace({
                workspaceId: 'workspace_id',
                config: {
                    activeProjectId: 'project_id',
                    activeProjectTabs: ['project_id']
                },
                workspaceName: 'workspace_name'
            });

            assert.match(result, {
                workspaceId: 'workspace_id',
                workspaceName: 'workspace_name',
                config: {
                    activeProjectId: 'project_id',
                    activeProjectTabs: ['project_id']
                },
                userId: 'user_id'
            });
            assert.match(executeQueryStub.callCount, 2);
            assert.match(executeQueryStub.args[0][1][0].value, 'workspace_id');
            assert.match(executeQueryStub.args[0][1][1].value, JSON.stringify({
                activeProjectId: 'project_id',
                activeProjectTabs: ['project_id']
            }));
            assert.match(executeQueryStub.args[0][1][2].value, 'workspace_name');
            assert.match(executeQueryStub.args[1][1][0].value, 'workspace_id');
        });
    });
});
