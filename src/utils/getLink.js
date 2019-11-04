import { Server } from 'utils/dnsHostIP';

export function getExplorerLink(locale) {
    locale = locale === 'zh' ? 'zh/' : '';
    return `${ Server.viteExplorer.url }/${ locale }`;
}

export function getAppLink(locale) {
    return `https://vite.org/${ locale === 'en' ? '' : (`${ locale }/`) }airdrop`;
}
