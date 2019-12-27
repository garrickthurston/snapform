import axios from 'axios';
import { getCookie, createCookie, deleteCookie } from './domUtils';
import { decodeToken } from './tokenUtils';

const _baseApiPath = '/api/';
const _apiVersion = 'v1';
const _tokenCookieName = '__authx__';

function Api(baseApiPath = null, apiVersion = null) {
    this.baseApiPath = baseApiPath || _baseApiPath;
    this.apiVersion = apiVersion || _apiVersion;
    this.token = null;
    this.user = null;

    const _formatUrl = (url) => {
        let requestUrl = url;

        if (requestUrl.indexOf('/') === 0) {
            requestUrl = requestUrl.substr(1);
        }

        const pieces = requestUrl.split('/', 1);
        const version = pieces[0].substr(1);
        if (isNaN(version) && this.apiVersion) {
            requestUrl = `${this.apiVersion}/${requestUrl}`;
        }

        return this.baseApiPath + requestUrl;
    };

    const _request = async ({
        method,
        url,
        data,
        options
    }) => {
        const actualUrl = _formatUrl(url);

        try {
            const config = {
                method,
                url: actualUrl,
                headers: {
                    'content-type': 'application/json; charset=utf-8'
                },
                ...options
            };
            config[(method === 'get' ? 'params' : 'data')] = data;

            const token = await this.getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            const response = await axios(config);
            return response.data;
        } catch ({ response = { data: {} } }) {
            const status = response && response.status;
            let responseData = {};
            if (typeof response.data === 'string' || response.data instanceof String) {
                responseData.message = response.data;
            } else {
                responseData = response.data.error || {};
            }

            const msg = status === 403 ? 'Unauthorized' : 'Unknown error';
            throw new Error(responseData.message || msg, {
                message: responseData.message || msg,
                statusCode: responseData.statusCode || status,
                code: responseData.code,
                innermessage: responseData.innerMessage,
                details: responseData.details,
                response: response
            });
        }
    };

    this.getToken = () => {
        if (!this.token) {
            this.token = getCookie(_tokenCookieName);
        }

        return this.token;
    };
    this.setToken = (token) => {
        this.token = token;
        createCookie(_tokenCookieName, token);
    };
    this.clearToken = () => deleteCookie(_tokenCookieName);
    /* eslint-disable react/no-this-in-sfc */
    this.decodeToken = () => {
        const token = this.getToken();
        if (token) {
            return decodeToken(token);
        }

        return null;
    };
    /* eslint-disable react/no-this-in-sfc */

    this.get = (url, data) => _request({
        method: 'get',
        url,
        data
    });
    this.post = (url, data) => _request({
        method: 'post',
        url,
        data
    });
    this.patch = (url, data) => _request({
        method: 'patch',
        url,
        data
    });
    this.put = (url, data) => _request({
        method: 'put',
        url,
        data
    });
    this.del = (url, data) => _request({
        method: 'delete',
        url,
        data
    });
}

export default new Api();
