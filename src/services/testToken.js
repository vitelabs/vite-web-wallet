import $ViteJS from 'utils/viteClient';

export function getTestToken(addr) {
    return $ViteJS.request('testapi_getTestToken', addr);
}
