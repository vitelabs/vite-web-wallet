import loopTime from 'config/loopTime';
import viteIcon from 'assets/imgs/vite.svg';
import vcpIcon from 'assets/imgs/VCC.svg';
import vttIcon from 'assets/imgs/vtt.svg';

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

// Test ENV
// VCP tti_e1f1d23a9d3e5e1b6ca6c374
// VTT tti_c23c7534356090754332f726

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

    getBlocks({
        addr, index, pageCount = 50
    }) {
        return $ViteJS.buildinLedger.getTxList({
            addr, index, pageCount
        });
    }
}

export default Ledger;
