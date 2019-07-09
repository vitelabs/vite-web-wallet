import i18n from 'i18n';

const explorerLinkMap = {
    production: 'https://explorer.vite.net/',
    test: 'http://132.232.134.168:8080/',
    default: 'https://explorer.vite.net/'
};

const appLinkMap = { default: 'https://vite.org/{lang}/airdrop' };

function getEnvLink(map) {
    return map[process.env.NODE_ENV] || map.default;
}

export function getExplorerLink() {
    const l1 = getEnvLink(explorerLinkMap);
    return `${ l1 }${ i18n.locale }`;
}

export function getAppLink() {
    const l1 = getEnvLink(appLinkMap).replace(/\{lang\}/, i18n.locale);
    return l1;
}
