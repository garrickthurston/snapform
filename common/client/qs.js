import query from 'query-string';

export class Qs {
    parse(queryString) {
        return query.parse(queryString, { ignoreQueryPrefix: true }) || {};
    }
}