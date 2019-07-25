import i18n from 'i18n';

// const explorerLinkMap = {
//     production: 'https://explorer.vite.net/',
//     test: 'http://132.232.134.168:8080/',
//     default: 'https://explorer.vite.net/'
// };

// const appLinkMap = { default: 'https://vite.org/{lang}/airdrop' };

// function getEnvLink(map) {
//     return map[process.env.NODE_ENV] || map.default;
// }

export function getExplorerLink() {
    return `${ process.env.viteNet }${ i18n.locale === 'en' ? '' : i18n.locale }`;
}

export function getAppLink() {
    return `https://vite.org/${ i18n.locale === 'en' ? '' : (`${ i18n.locale }/`) }airdrop`;
}
