import { getUiConfig } from 'services/config.ts';

const state = {
    inviteAddrList: [],
    allShowInvite: false,
    versionList: null
};

const mutations = {
    setInviteAddrList(state, payload = []) {
        state.inviteAddrList = payload;
    },
    setAllShowInvite(state, payload = false) {
        state.allShowInvite = payload;
    },
    setVersionList(state, payload = null) {
        // {
        //     "8": {
        //         "title": {
        //             "zh": "交易所ViteX正式上线！",
        //             "en": "ViteX launches now!"
        //         },
        //         "zh": "支持ViteConnect登录，更有VIP、邀请码折扣，享受更安全更优惠的交易体验。挖矿功能即将开放，敬请期待",
        //         "en": "ViteX supports login via ViteConnect and VIP & referring discount, which allows you to enjoy more secure and cheaper trading experience. Mining function is around the corner, stay tuned!",
        //         "time": "1563874272860"
        //     },
        //     "6": {
        //         "version": "1.6.0",
        //         "zh": "1. 新增超级节点提取奖励功能<br/>2. 新版本将测试网络切换至Pre-Mainnet，快来体验吧",
        //         "en": "1. Added claiming rewards function for SBP runners.<br/>2. The upcoming version will switch from Testnet to Pre-Mainnet, looking forward your experience.",
        //         "time": "1552897193504"
        //     },
        // }
        state.versionList = payload;
    }
};

const actions = {
    fetchUiConfig({ commit }) {
        getUiConfig().then(data => {
            commit('setInviteAddrList', data['inviteAddrList']);
            commit('setAllShowInvite', data['allShowInvite']);
            commit('setVersionList', data['versionList']);
        });
    }
};

export default { state, mutations, actions };
