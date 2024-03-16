import {
    utils,
    accountBlock as accountBlockUtils,
    ViteAPI
} from '@vite/vitejs';
import { getActiveAcc, getCurrHDAcc } from '@pc/wallet';
import { powProcess } from '@pc/components/pow/index';
import { quotaConfirm } from '@pc/components/quota/index';
import { vbConfirmDialog, powLimitDialog } from '@pc/components/dialog';
import { execWithValid } from '@pc/utils/execWithValid';
import { getVbInstance } from '@pc/wallet/vb';
import { getLedgerInstance } from '@pc/wallet/ledgerHW';
import { viteClient } from '@services/apiServer';
import envStore from '@pc/store/envVariable';
import provider from '@vite/vitejs-ws';
import { Buffer } from 'buffer';


import i18n from '@pc/i18n';
const providerTimeout = 60000;
const providerOptions = { retryTimes: -1, retryInterval: 5000 };

const { createAccountBlock } = accountBlockUtils;
const { isObject } = utils;

const defaultConfig = {
    pow: true,
    powConfig: {
        isShowCancel: true,
        cancel: () => {}
    },
    confirm: {
        showMask: true,
        operate: ''
    },
    powLimit: true
};

const sendTx = execWithValid(function ({
    config = defaultConfig,
    methodName,
    data,
    vbExtends,
    abi,
    description
}) {
    const activeAccount = getActiveAcc();

    if (activeAccount.isBifrost) {
        return vbSendTx({
            abi,
            vbExtends,
            description,
            methodName,
            params: {
                ...data,
                address: activeAccount.address
            }
        });
    }

    if (activeAccount.isHardware) {
        return hwSendTx({
            methodName,
            params: {
                ...data,
                address: activeAccount.address
            },
            config: formatConfig(config)
        });
    }

    if (activeAccount.isVitePassport) {
        return vitePassportSendTx({
            methodName,
            params: {
                ...data,
                address: activeAccount.address
            }
        });
    }

    if (window.touchID && window.touchID.isEnableTouchID()) {
        return window.touchID
            .promptTouchID(i18n.t('desktop.unlock'))
            .then(() =>
                webSendTx({
                    methodName,
                    params: {
                        ...data,
                        address: activeAccount.address
                    },
                    config: formatConfig(config),
                    privateKey: activeAccount.privateKey
                }))
            .catch(err => {
                throw err;
            });
    }

    return webSendTx({
        methodName,
        params: {
            ...data,
            address: activeAccount.address
        },
        config: formatConfig(config),
        privateKey: activeAccount.privateKey
    });
});

async function webSendTx({ methodName, params, config, privateKey }) {
    const accountBlock = createAccountBlock(methodName, params)
        .setProvider(viteClient)
        .setPrivateKey(privateKey);
    await accountBlock.autoSetPreviousAccountBlock();

    const difficulty = await accountBlock.getDifficulty();

    if (!difficulty) {
        return accountBlock.sign().send();
    }

    if (!config.pow) {
        quotaConfirm(config.confirmConfig);
        throw {
            code: '1000001',
            message: 'Don\'t need pow, already show confirm.'
        };
    }
    const customPowUrl = envStore.state.currentPowUrl;
    const isOfficalPowUrl
        = !customPowUrl || !!customPowUrl.match(/node\.vite\.net/);
    if (config.powLimit && isOfficalPowUrl) {
        try {
            const p = powLimitDialog();
            const powLimitRes = await p;
            if (powLimitRes.data === 'getQuota') {
                return Promise.reject();
            }
        } catch (err) {
            if (err && err.status === 'CLOSE') {
                return Promise.reject(err);
            }
            return;
        }
    }

    const powInstance = powProcess({ ...config.powConfig });
    try {
        await runPow(difficulty, accountBlock);
        await powInstance.stopCount();
        return accountBlock.sign().send();
    } catch (err) {
        console.error('send err', err);

        if (!powInstance || !powInstance.isShow) {
            return;
        }
        powInstance.stop();
        throw err;
    }
}

function vbSendTx({ methodName, params, vbExtends, abi, description }) {
    const confirmPromise: any = vbConfirmDialog();
    const { compInstance } = confirmPromise;

    return new Promise((res, rej) => {
        confirmPromise.then(() => {
            // 如果点击了关闭窗口，则不再提示
            compInstance && compInstance.close();
            rej({ code: '11021' });
        });

        const accountBlock = createAccountBlock(methodName, params)
            .accountBlock;

        const vb = getVbInstance();
        return vb
            .sendVbTx({
                block: accountBlock,
                extend: vbExtends,
                abi,
                description
            })
            .then(data => {
                res(data);
            })
            .catch(err => {
                rej(err);
            })
            .finally(() => {
                compInstance && compInstance.close();
            });
    });
}

function vitePassportSendTx({ methodName, params}) {
    return window.vitePassport.writeAccountBlock(methodName, params);
}

// 硬件钱包发送交易
async function hwSendTx({ methodName, params, config }) {
    const accountBlock = createAccountBlock(methodName, params).setProvider(viteClient);
    await accountBlock.autoSetPreviousAccountBlock();

    const difficulty = await accountBlock.getDifficulty();
    console.log(difficulty);

    const { publicKey, activeIdx } = getCurrHDAcc();
    accountBlock.setPublicKey(publicKey);

    if (!difficulty) {
        return signHwTx(activeIdx, accountBlock);
    }

    if (!config.pow) {
        quotaConfirm(config.confirmConfig);
        throw {
            code: '1000001',
            message: 'Don\'t need pow, already show confirm.'
        };
    }

    const powInstance = powProcess({ ...config.powConfig });

    try {
        await runPow(difficulty, accountBlock);
        await powInstance.stopCount();
    } catch (err) {
        console.error('pow err', err);

        if (!powInstance || !powInstance.isShow) {
            return;
        }
        powInstance.stop();
        throw err;
    }

    return signHwTx(activeIdx, accountBlock);
}

function signHwTx(activeIdx, accountBlock) {
    return new Promise((resolve, reject) => {
        const confirmPromise: any = vbConfirmDialog();
        const { compInstance } = confirmPromise;
        let isRejected = false;
        confirmPromise.then(() => {
            // 如果点击了关闭窗口，则不再提示
            compInstance && compInstance.close();
            isRejected = true;
            getLedgerInstance().handleError({ name: 'CancelByWeb' });
            reject({ code: '11021' });
        });
        getLedgerInstance()
            .signHwTx(activeIdx, accountBlock)
            .catch(err => {
                !isRejected && getLedgerInstance().handleError(err);
                throw err;
            })
            .finally(() => {
                compInstance && compInstance.close();
            })
            .then(({ signature }) => accountBlock.setSignature(signature))
            .then(() => {
                if (isRejected) {
                    throw new Error();
                }
                return accountBlock.send();
            })
            .then(data => resolve(data))
            .catch(err => reject(err));
    });
}

function formatConfig(config) {
    config = config || defaultConfig;
    // console.log(config);

    const pow = !!config.pow;
    const powConfig = config.powConfig
        ? config.powConfig
        : defaultConfig.powConfig;
    const powLimit
        = typeof config.powLimit === 'boolean'
            ? config.powLimit
            : defaultConfig.powLimit;

    if (!isObject(powConfig)) {
        throw new Error('[Error] utils/sendTx: config.powConfig should be an Object.');
    }

    if (powConfig.cancel && typeof powConfig.cancel !== 'function') {
        throw new Error('[Error] utils/sendTx: config.pow[1].cancel should be a function.');
    }

    if (
        !(
            powConfig.hasOwnProperty('isShowCancel')
            && typeof powConfig.isShowCancel !== 'undefined'
            && powConfig.isShowCancel !== null
        )
    ) {
        powConfig.isShowCancel = true;
    }

    if (pow) {
        return { pow, powConfig, confirmConfig: null, powLimit };
    }

    const confirmConfig = config.confirm
        ? config.confirm
        : defaultConfig.confirm;
    if (!isObject(confirmConfig)) {
        throw new Error('[Error] utils/sendTx: config.confirm should be an object.');
    }

    if (!confirmConfig.operate || typeof confirmConfig.operate !== 'string') {
        throw new Error('[Error] utils/sendTx: config.confirm.operate is required and should be a string, while pow is off.');
    }

    return { pow, powConfig, confirmConfig, powLimit };
}
const createViteApiFactory = url =>
    new Promise((resolve, reject) => {
        const WS_RPC = new provider(url, providerTimeout, providerOptions);
        const viteClient = new ViteAPI(WS_RPC, () => {
            console.log(`pow Connect to ${ url }`);
            resolve(viteClient);
        });
    });
async function runPow(difficulty, accountBlock) {
    const customPowUrl = envStore.state.currentPowUrl;
    const powProvider = customPowUrl
        ? await createViteApiFactory(customPowUrl)
        : accountBlock.provider;
    const getNonceHashBuffer = Buffer.from(accountBlock.originalAddress + accountBlock.previousHash,
        'hex');
    const getNonceHash = utils.blake2bHex(getNonceHashBuffer, null, 32);
    const nonce = await powProvider.request('util_getPoWNonce',
        difficulty,
        getNonceHash);
    accountBlock.difficulty = difficulty;
    accountBlock.nonce = nonce;
    if (customPowUrl) {
        powProvider._provider && powProvider._provider.disconnect();
    }
    return accountBlock;
}
export default sendTx;
