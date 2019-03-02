import { Http } from '../http';

export class SaveService {
    constructor() {
        this.http = new Http();
    }

    saveProject(workspace_id, project_id, project) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.http.put(`/api/v1/workspace/${workspace_id}/project/${project_id}`, {
                    items: project.items,
                    config: project.config
                });

                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }
};