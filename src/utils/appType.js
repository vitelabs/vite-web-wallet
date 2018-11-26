export default function () {
    // In APP
    if (window.viteWalletStorage) {
        return 1;
    }
    // In Web
    return 0;
}

