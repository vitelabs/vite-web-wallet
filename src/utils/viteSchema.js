// https://wiki.vitelabs.com/display/~tiantao/uri+standard
import qs from 'query-string';

export function parse(s) {
    const res = /^(?<schema>vite:)(?<prefix>\d+-)?(?<targetAddress>vite_[0-9a-zA-Z]{50})?(?<chanin_id>@\d{1})?(?<function_name>\/\w+)?(?<paramsString>\?.*$)?/.exec(s).groups;
    if (res.schema !== 'vite:') {
        throw new Error('no vite schema');
    }
    const r = {};
    r.schema = 'vite';
    if (res.prefix) {
        r.prefix = res.prefix.slice(0, -1);
    }
    if (res.targetAddress) {
        r.targetAddress = res.targetAddress;
    }
    if (res.chain_id) {
        r.chain_id = res.chain_id.slice(1);
    }
    if (res.function_name) {
        r.function_name = res.function_name.slice(1);
    }
    if (res.paramsString) {
        r.params = qs.parse(res.paramsString);
    }
    return r;
}

export function stringify(o) {
    const {schema,prefix,targetAddress,chain_id,function_name,params}=o;
    const _schema=schema?`${schema}:`:'vite:';
    const _prefix=prefix===undefined?'':`${prefix}-`;
    const _targetAddress=targetAddress||'';
    const _chain_id=chain_id?`@${chain_id}`:'';
    const _function_name=function_name?`\\${function_name}`:'';
    const _params=params?`?${qs.stringify(params,{encode:false})}`:'';
    const str=`${_schema}${_prefix}${_targetAddress}${_chain_id}${_function_name}${_params}`;
    return str;
}
