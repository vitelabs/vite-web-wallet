import qs from 'qs';

export default function () {
    try {
        const search = location.search ? location.search.slice(1) : location.href.split('?')[1] || '';
        const query = qs.parse(search);
        return query || {};
    } catch (err) {
        console.warn(err);
        return {};
    }
}
