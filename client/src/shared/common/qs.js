import query from 'query-string';

export class qs {
    parse(queryString) {
        return query.parse(queryString, { ignoreQueryPrefix: true }) || {};
    }
}