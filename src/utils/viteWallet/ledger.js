import request from 'utils/request';
import loopTime from 'config/loopTime';

let loopHeightTimeout;
const ViteId = 'tti_5649544520544f4b454e6e40';

class Ledger {
    constructor() {
        this.defaultTokenIds = {};
        this.tokenInfoMaps = {};

        this.currentHeight = '';        
        this.loopHeight();
    }

    getDefaultTokenList() {
        let toRequest = window.viteWalletRequest || request;

        toRequest({
            method: 'GET',
            path: '/api/version/config?app=web&channel=token&version=default',
            type: 'form'    // Client Wallet
        }).then((data)=>{
            if (!data) {
                return;
            }

            data = JSON.parse(data);
            data.forEach((item) => {
                this.defaultTokenIds[item.tokenId] = item.tokenSymbol;
                this.setTokenInfo({
                    tokenSymbol: item.tokenSymbol
                }, item.tokenId);
                this.fetchTokenInfo(item.tokenId);
            });
        }).catch((err) => {
            console.error(err);
        });
    }

    setTokenInfo(tokenInfo, tokenId) {
        if (!tokenInfo || (!tokenInfo.tokenId && tokenId) ) {
            return false;
        }
        tokenId = tokenId || tokenInfo.tokenId;
        this.tokenInfoMaps[tokenId] = tokenInfo;
        this.tokenInfoMaps[tokenId].tokenId = tokenId;
    }

    getTokenInfo(id = ViteId) {
        if (!this.tokenInfoMaps[id]) {
            return null;
        }
        this.tokenInfoMaps[id].tokenId = id;
        return this.tokenInfoMaps[id];
    }

    fetchTokenInfo(tokenId = ViteId) {
        return $ViteJS.Vite['ledger_getTokenMintage'](tokenId).then(({ result }) => {
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

        $ViteJS.Vite['ledger_getSnapshotChainHeight']().then(({ result })=>{
            if (result) {
                this.currentHeight = result;
                webViteEventEmitter.emit('currentHeight', this.currentHeight);
            }

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
        return $ViteJS.Vite.Ledger.getBlocks({
            addr, index, pageCount
        });
    }
}

export default Ledger;
