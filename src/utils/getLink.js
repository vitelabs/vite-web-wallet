export function getExplorerLink(locale) {
    return `${ process.env.viteNet }${ locale === 'en' ? '' : `${ locale }/` }`;
}

export function getAppLink(locale) {
    return `https://vite.org/${ locale === 'en' ? '' : (`${ locale }/`) }airdrop`;
}
