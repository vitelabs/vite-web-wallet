import loopTime from 'config/loopTime';
import viteIcon from 'assets/imgs/vite.svg';
import vcpIcon from 'assets/imgs/VCC.svg';
import vttIcon from 'assets/imgs/vtt.svg';
import { utils, constant } from '@vite/vitejs';

const { accountBlock } = utils;
const { type } = constant;

const ViteId = 'tti_5649544520544f4b454e6e40';
const defaultTokenList = {
    'tti_5649544520544f4b454e6e40': {
        'tokenSymbol': 'VITE',
        icon: viteIcon
    }, 
    'tti_251a3e67a41b5ea2373936c8': {
        'tokenSymbol': 'VCP',
        icon: vcpIcon
    }, 
    'tti_c55ec37a916b7f447575ae59': {
        'tokenSymbol': 'VTT',
        icon: vttIcon
    }
};

let loopHeightTimeout;

class Ledger {
    constructor() {
        this.defaultTokenIds = {};
        this.tokenInfoMaps = {};
        this.currentHeight = '';
    }

    getDefaultTokenList() {
        this.defaultTokenIds = defaultTokenList;
        for (let tokenId in defaultTokenList) {
            this.fetchTokenInfo(tokenId);
        }
    }

    setTokenInfo(tokenInfo, tokenId) {
        if (!tokenInfo || (!tokenInfo.tokenId && tokenId) ) {
            return false;
        }
        tokenId = tokenId || tokenInfo.tokenId;
        this.tokenInfoMaps[tokenId] = tokenInfo;
        this.tokenInfoMaps[tokenId].tokenId = tokenId;
        if (defaultTokenList[tokenId]) {
            this.tokenInfoMaps[tokenId].icon = defaultTokenList[tokenId].icon;
        }
    }

    getTokenInfo(id = ViteId) {
        if (!this.tokenInfoMaps[id]) {
            return null;
        }
        this.tokenInfoMaps[id].tokenId = id;
        return this.tokenInfoMaps[id];
    }

    fetchTokenInfo(tokenId = ViteId) {
        return $ViteJS.ledger.getTokenMintage(tokenId).then((result) => {
            this.setTokenInfo(result, tokenId);
            return this.tokenInfoMaps[tokenId];
        });
    }

    loopHeight() {
        let loop = () => {
            loopHeightTimeout = setTimeout(() => {
                clearTimeout(loopHeightTimeout);
                loopHeightTimeout = null;
                this.loopHeight();
            }, loopTime.ledger_getSnapshotChainHeight);
        };

        $ViteJS.ledger.getSnapshotChainHeight().then((result)=>{
            this.currentHeight = result || 0;
            webViteEventEmitter.emit('currentHeight', this.currentHeight);
            loop();
        }).catch(()=>{
            loop();
        });
    }

    getHeight() {
        return this.currentHeight;
    }

    async getBlocks({
        addr, index, pageCount = 50
    }) {
        const requests = [{
            methodName: 'ledger_getBlocksByAccAddr',
            params: [ addr, index, pageCount ]
        }, {
            methodName: 'ledger_getAccountByAccAddr',
            params: [ addr ]
        }];

        const data = await $ViteJS.batch(requests);

        let rawList;
        let totalNum;
        requests.forEach((_r, i) => {
            if (_r.methodName === 'ledger_getAccountByAccAddr') {
                totalNum = data[i].result ? data[i].result.totalNumber : 0;
                return;
            }
            rawList = data[i].result || [];
        });

        let list = [];
        rawList.forEach((item) => {
            let txType = accountBlock.getBuiltinTxType(item.toAddress, item.data, +item.blockType);
            item.txType = type.BuiltinTxType[txType];
            list.push(item);
        });

        return { list, totalNum };
    }
}

export default Ledger;
