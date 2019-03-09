import { UPDATE_PROJECT, UPDATE_PROJECT_ITEMS, UPDATE_PROJECT_CONTAINER, INIT_PROJECT, UPDATE_PROJECT_CONFIG } from './redux.actions.types';

const projectConfig = {
    ui: {
        gClassList: 'gid',
        add: {}
    }
};
const initialState = {
    workspace: {
        project: {
            config: projectConfig,
            items: {}
        }
    }
};

export const engineReducer = (state = initialState, action) => {
    var workspace = Object.assign({}, state.workspace);

    switch (action.type) {
        case INIT_PROJECT:
            var { workspace_id, project } = action.payload;

            project.add = {};
            if (!project.config) {
                project.config = projectConfig;
            }
            if (!project.config.ui) {
                project.config.ui = projectConfig.ui;
            }
            
            workspace.id = workspace_id;
            workspace.project = project;

            return Object.assign({}, state, {
                workspace
            });
        case UPDATE_PROJECT:
            const parts = action.payload.path.split('.');

            var items = workspace.project.items;
            parts.forEach((part, i) => {
                if ((i + 1) === parts.length) {
                    items[part] = action.payload.value;
                } else {
                    items = item[part];
                }
            });
            
            return Object.assign({}, state, {
                workspace
            });
        case UPDATE_PROJECT_ITEMS:
            workspace.project.items = action.payload;

            return Object.assign({}, state, {
                workspace
            });
        case UPDATE_PROJECT_CONFIG:
            workspace.project.config = action.payload;
            
            return Object.assign({}, state, {
                workspace
            });
        case UPDATE_PROJECT_CONTAINER:
            workspace.project.container = action.payload;
            return Object.assign({}, state, {
                workspace
            });
    }
    
    return state;
};