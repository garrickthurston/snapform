import { Http } from '../http';

export class ProjectService {
    constructor() {
        this.http = new Http();
    }

    get(workspace_id, project_id) {
        return new Promise(async (resolve, reject) => {
            try {
                let results = await this.http.get(`/api/v1/workspace/${workspace_id}/project/${project_id}`);
                
                resolve(results);
            } catch (e) {
                reject(e);
            }
        });
    }

    put(workspace_id, project_id, project) {
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