import { getProvider } from 'services/apiServer';
import store from 'pcStore';

const actionQueue = [];

/*
模拟简单的action/dispatch模型，用于在某些事件触发时，重新获取数据。

例如：在系统断网/锁屏/睡眠之后，可能出现节点服务断开链接的情况，需要在桌面钱包被唤醒时/解锁时/重新focus时重新连接节点，并执行一些操作。
*/
const actions = {
    refreshBalance() {
        store.dispatch('startLoopBalance');
        store.dispatch('subUnreceivedTx');
        store.dispatch('startLoopExchangeBalance');
        store.dispatch('exFetchLatestOrder');
    },
    resetSettings() {
        store.dispatch('onNetStatus');
        store.dispatch('updateMarketMap');
        store.dispatch('getMarketsClosed');
        store.dispatch('getDefaultTokenList');
        store.dispatch('getAllTokens');
        store.dispatch('updateGateInfos');
        store.dispatch('exFetchLimitAmounts');
        store.dispatch('fetchUiConfig');
    },
    getTokenInfo() {
        if (!store.getters.viteTokenInfo || !store.getters.vxTokenInfo) {
            store.dispatch('getDefaultTokenList');
        }
    }
};

function dispatch(action) {
    const viteClientProvider = getProvider();
    // 如果viteClient已链接，则直接执行
    if (viteClientProvider.connectStatus) {
        console.log(`viteClient is connected, directly do action: ${ action }`);
        return actions[action] && actions[action]();
    }
    viteClientProvider.reconnect();
    // 避免重复执行action
    if (actionQueue.indexOf(action) > -1) {
        return;
    }
    actionQueue.push(action);
    viteClientProvider.on('connect', () => {
        console.log(`gViteAPI reconnect to: ${ viteClientProvider.path }`);
        // viteClient 链接之后，执行action队列
        actionQueue.forEach(actionName => {
            console.log(`Do action: ${ actionName }`);
            actions[actionName] && actions[actionName]();
        });
    });
}


export const init = () => {
    if (!window.ipcRenderer) return;

    window.ipcRenderer.on('resume', () => {
        console.log('event: resume');
        dispatch('refreshBalance');
        dispatch('resetSettings');
    });

    window.ipcRenderer.on('unlock-screen', () => {
        console.log('event: unlock-screen event');
        dispatch('refreshBalance');
        dispatch('resetSettings');
    });

    window.ipcRenderer.on('window-focus', () => {
        console.log('event: window-focus');
        dispatch('getTokenInfo');
    });
};
