// https://wiki.vitelabs.com/display/~tiantao/uri+standard
import qs from 'qs';

export function stringify(o) {
    const { schema, prefix, targetAddress, chain_id, function_name, params } = o;
    const _schema = schema ? `${ schema }:` : 'vite:';
    const _prefix = prefix === undefined ? '' : `${ prefix }-`;
    const _targetAddress = targetAddress || '';
    const _chain_id = chain_id ? `@${ chain_id }` : '';
    const _function_name = function_name ? `\\${ function_name }` : '';
    const _params = params ? `?${ qs.stringify(params, { encode: false }) }` : '';
    const str = `${ _schema }${ _prefix }${ _targetAddress }${ _chain_id }${ _function_name }${ _params }`;

    return str;
}
