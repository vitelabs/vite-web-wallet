import { wallet } from 'utils/wallet';
import { getPowNonce } from 'services/pow';

const defaultConfig = {
    pow: {
        isShow: true,
        isAuto: false,
        isShowCancel: false
    },
    confirm: {}
};

export default async function sendTx(methodName, data, config = defaultConfig) {
    const isLogin = wallet.isLogin;
    const activeAccount = wallet.getActiveAccount;

    if (!isLogin || !activeAccount) {
        throw {
            code: '-1000000000',
            message: 'Unknow error.'
        };
    }

    if (!activeAccount[methodName]) {
        throw {
            code: '-1000000001',
            message: `Unknow method ${ methodName }.`
        };
    }

    config = formatConfig(config);
    // if (!config) {
    //     throw {
    //         code: '-1000000002',
    //         message: 'Invailid config. Please check again.'
    //     };
    // }

    try {
        const result = await activeAccount[methodName](data);
        return result;
    } catch (err) {
        if (!err || !err.error || !err.error.code || err.error.code !== -35002) {
            throw err;
        }

        return goonConfirm(activeAccount, err, config);
    }
}


function formatConfig(config) {
    const pow = config.pow || defaultConfig.pow;
    const quota = !!pow.isAuto;
    const confirm = quota ? config.confirm || defaultConfig.confirm : null;

    return {
        pow: {
            isShow: !!pow.isShow,
            isAuto: !!pow.isAuto,
            isShowCancel: !!pow.isShowCancel
        },
        quota,
        confirm
    };
}

async function goonConfirm(err, config) {
    let accountBlock = err.accountBlock;
    const activeAccount = wallet.getActiveAccount;

    if (!activeAccount
        || activeAccount.getDefaultAddr() !== accountBlock.accountAddress) {
        return;
    }

    console.log(config);
    // let isShowConfirm = config.quota

    accountBlock = await getPowAccountBlock(accountBlock);

    // activeAccount.sendRawTx(accountBlock).then(() => {
    //     this.$toast('Mintage success');
    // }).catch(err => {
    //     this.$toast(`Mintage fail. ${ err.error.message || err.error.msg }`);
    //     console.warn(err);
    // });
    // console.log(err, config);
}

async function getPowAccountBlock(accountBlock) {
    const data = await getPowNonce(accountBlock.accountAddress, accountBlock.prevHash);
    accountBlock.difficulty = data.difficulty;
    accountBlock.nonce = data.nonce;
    return accountBlock;
}
