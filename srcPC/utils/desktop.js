import { refreshViteApi } from 'services/apiServer';
import store from 'pcStore';

function refreshBalance(store) {
    store.dispatch('startLoopBalance');
    store.dispatch('subUnreceivedTx');
    store.dispatch('startLoopExchangeBalance');
    store.dispatch('exFetchLatestOrder');
    refreshViteApi();
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


export const init = () => {
    if (!window.ipcRenderer) return;

    window.ipcRenderer.on('resume', () => {
        console.log('event: resume');
        refreshBalance(store);
        resetSettings(store);
    });

    window.ipcRenderer.on('unlock-screen', () => {
        console.log('event: unlock-screen event');
        refreshBalance(store);
        resetSettings(store);
    });

    window.ipcRenderer.on('window-focus', () => {
        console.log('event: window-focus');
        if (!store.getters.viteTokenInfo || !store.getters.vxTokenInfo) {
            store.dispatch('getDefaultTokenList');
        }
        if (!store.getters.tokenMapFromGithub) {
            store.dispatch('fetchTokenInfoFromGithub');
        }
    });
};
