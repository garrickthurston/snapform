import query from 'query-string';
import { useLocation } from 'react-router-dom';

// eslint-disable-next-line import/prefer-default-export
export const useQueryParams = () => {
    const { search } = useLocation();

    if (!search) {
        return null;
    }

    return query.parse(search, { ignoreQueryPrefix: true }) || {};
};
