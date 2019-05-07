import querystring from 'querystring';

export default function () {
    try {
        const search = location.search ? location.search.slice(1) : '';
        const query = querystring.parse(search);
        return query || {};
    } catch (err) {
        console.warn(err);
        return {};
    }
}
