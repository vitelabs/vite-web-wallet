/*
    Why add this code?
    apiServer and dnsHostIP are utils tool for both mobile and web. But in web,
    we need use pcUtils to read currentNode from localstorage, and then used in dnsHostIP. But if we put this code
    to dnsHostIP, that will cause dnsHostIP dependence on pcUtils.
    So we move these code here, so that dnsHostIP will not dependence on pcUtils.

    In dnsHostIP, we can read currentNode from window.VITE_NODE_API;
*/
import {
    storage as localStorage,
    constant
} from 'pcUtils/store';

const { CurrentNode } = constant;
const defaultNode = process.env.goViteServer;
window.VITE_NODE_API = localStorage.getItem(CurrentNode) || defaultNode;
