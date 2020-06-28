function refreshBalance(store) {
    store.dispatch('startLoopBalance');
    store.dispatch('subUnreceivedTx');
    store.dispatch('startLoopExchangeBalance');
    store.dispatch('exFetchLatestOrder');
}

function resetSettings(store) {
    store.dispatch('onNetStatus');
    store.dispatch('updateMarketMap');
    store.dispatch('getMarketsClosed');
    store.dispatch('getDefaultTokenList');
    store.dispatch('getAllTokens');
    store.dispatch('updateGateInfos');
    store.dispatch('fetchTokenInfoFromGithub');
    store.dispatch('exFetchLimitAmounts');
    store.dispatch('fetchUiConfig');
}


export const init = (store) => {
    if (!window.ipcRenderer) return;

    window.ipcRenderer.on('resume', () => {
        refreshBalance(store);
        resetSettings(store);
    });

    window.ipcRenderer.on('unlock-screen', () => {
        refreshBalance(store);
    });
}