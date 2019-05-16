class _wallet {
    constructor() {

    }

    // create(name, pass, lang = LangList.english) {
    //     const err = checkParams({ name, pass }, [ 'name', 'pass' ]);
    //     if (err) {
    //         console.error(new Error(err));
    //         return;
    //     }

    //     this.newActiveAcc({
    //         addrNum: 1,
    //         name,
    //         pass,
    //         lang,
    //         type: 'wallet',
    //         addrNameList: {}
    //     });
    // }

    // async restoreAccount(mnemonic, name, pass, lang = LangList.english) {
    //     const num = 10;
    //     const addrs = _hdAddr.getAddrsFromMnemonic(mnemonic, 0, num, lang);
    //     if (!addrs) {
    //         return Promise.reject({ code: 500005 });
    //     }

    //     const requests = [];
    //     for (let i = 0; i < num; i++) {
    //         requests.push($ViteJS.getBalance(addrs[i].hexAddr));
    //     }

    //     const data = await Promise.all(requests);
    //     let index = 0;

    //     data.forEach((item, i) => {
    //         if (!item) {
    //             return;
    //         }
    //         const account = item.balance;
    //         const onroad = item.onroad;
    //         if ((account && +account.totalNumber) || (onroad && +onroad.totalNumber)) {
    //             index = i;
    //         }
    //     });

    //     this.newActiveAcc({
    //         addrNum: index + 1,
    //         mnemonic,
    //         lang,
    //         type: 'wallet'
    //     });

    //     return this.activeWalletAcc.encrypt(pass).then(() => {
    //         this.activeWalletAcc.pass = pass;
    //         this.activeWalletAcc.rename(name);
    //     });
    // }

    // decryptKeystore() {

    // }
}

export const wallet = new _wallet();
