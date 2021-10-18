import { Server } from 'services/dnsHostIP';

const explorer = Server.viteExplorer;

export function getExplorerLink(locale) {
    locale = '';
    return `${ explorer.url }/${ locale }`;
}

export function getAppLink(locale) {
    return 'https://vite.org/airdrop';
}

export function getTxLink(locale, hash) {
    const baseUrl = getExplorerLink(locale);
    const link = {
        viteView: `${ baseUrl }#/tx/${ hash }`,
        viteScan: `${ baseUrl }tx/${ hash }`
    }
    return link[explorer.name];
}

export function getTokenLink(locale, tokenId) {
    const baseUrl = getExplorerLink(locale);
    const link = {
        viteView: `${ baseUrl }#/token/${ tokenId }`,
        viteScan: `${ baseUrl }token/${ tokenId }`
    }
    return link[explorer.name];
}

export function getAccountLink(locale, address) {
    const baseUrl = getExplorerLink(locale);
    const link = {
        viteView: `${ baseUrl }#/account/${ address }`,
        viteScan: `${ baseUrl }address/${ address }`
    }
    return link[explorer.name];
}

export function getSBPLink(locale, name) {
    const baseUrl = getExplorerLink(locale);
    const link = {
        viteView: `${ baseUrl }#/sbp/${ name }`,
        viteScan: `${ baseUrl }sbp/${ name }`
    }
    return link[explorer.name];
}

