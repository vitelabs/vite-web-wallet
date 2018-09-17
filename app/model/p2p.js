
const loopTime = require('../../config/loopTime');

let loopNetworkTimeout;

class P2P {
    constructor($ViteJS) {
        this.$ViteJS = $ViteJS;
        this.network = -1;

        this.loopP2Pnetwork();
    }

    loopP2Pnetwork() {
        let loop = () => {
            loopNetworkTimeout = setTimeout(() => {
                clearTimeout(loopNetworkTimeout);
                loopNetworkTimeout = null;
                this.loopP2Pnetwork();
            }, loopTime.p2p_networkAvailable);
        };

        this.$ViteJS.Vite.P2P.networkAvailable().then(({ result })=>{
            this.network = result;
            loop();
        }).catch(()=>{
            loop();
        });
    }
}

module.exports = P2P;
