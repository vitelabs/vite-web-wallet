import { Server } from 'services/dnsHostIP';

export function getExplorerLink(locale) {
    locale = '';
    return `${ Server.viteExplorer.url }/${ locale }`;
}

export function getAppLink(locale) {
    return 'https://vite.org/airdrop';
}
