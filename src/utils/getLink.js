import i18n from 'i18n';

const explorerLinkMap = {
    production: 'https://explorer.vite.net/',
    test: 'http://132.232.134.168:8080/'
};
export function getExplorerLink() {
    const l1 = explorerLinkMap[process.env.NODE_ENV] || explorerLinkMap.production;
    return `${ l1 }${ i18n.locale }`;
}
