import request from 'request';

export class http {

    constructor() {

    }

    get(url, auth = true, options = null, fullyQualified = false, overrideStatusCodeFailure = false) {
        return new Promise((resolve, reject) => {
            try {
                if (!options) {
                    options = {
                        method: 'GET',
                        url: fullyQualified ? url : `${window.location.protocol}//${window.location.host}${url}`,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
                }

                if (auth) {
                    // TODO - set token as a static prop on... something
                    var token = '';
                    options.headers['Authorization'] = `Bearer ${token}`;
                }
                request(options, (error, response, body) => {
                    if (error) {
                        return reject(error);
                    }

                    if (!overrideStatusCodeFailure && !(response.statusCode >= 200 && response.statusCode <= 299)) {
                        reject(`Status Code: ${response.statusCode}`);
                    }

                    resolve(JSON.parse(response.body));
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    post(url, body, auth = true, fullyQualified = false, options = null, overrideStatusCodeFailure = false) {
        return new Promise((resolve, reject) => {
            try {
                if (!options) {
                    options = {
                        method: 'POST',
                        url: fullyQualified ? url : `${window.location.protocol}//${window.location.host}${url}`,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(body)
                    };
                }

                if (auth) {
                    // TODO - set token as a static prop on... something
                    var token = '';
                    options.headers['Authorization'] = `Bearer ${token}`;
                }
                request(options, (error, response, body) => {
                    if (error) {
                        return reject(error);
                    }

                    if (!overrideStatusCodeFailure && !(response.statusCode >= 200 && response.statusCode <= 299)) {
                        reject(`Status Code: ${response.statusCode}`);
                    }

                    resolve(JSON.parse(response.body));
                });
            } catch (e) {
                reject(e);
            }
        });
    }
}