export default {
    getAcc() {
        return viteWallet.Wallet.getLast();
    },
    getSimpleAcc() {
        let acc = viteWallet.Wallet.getLast();
        let addr = acc.addr ? acc.addr : acc.addrList[acc.defaultPath].addr;
        return {
            name: acc.name,
            addr,
            entropy: acc.entropy || ''
        };
    }
};