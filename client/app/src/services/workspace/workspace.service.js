import { Http } from '../../shared/utils/http';

export class WorkspaceService {
    constructor() {
        this.http = new Http();
    }

    getAll() {
        return new Promise(async (resolve, reject) => {
            try {
                let results = await this.http.get(`/api/v1/workspace`);

                resolve(results);
            } catch (e) {
                reject(e);
            }
        });
    }

    get(workspace_id) {
        return new Promise(async (resolve, reject) => {
            try {
                let results = await this.http.get(`/api/v1/workspace/${workspace_id}`);

                resolve(results);
            } catch (e) {
                reject(e);
            }
        });
    }

    post(user_id, workspace) {
        return new Promise(async (resolve, reject) => {
            try {


                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }
}