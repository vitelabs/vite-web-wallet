import { utils, accountBlock as accountBlockUtils } from '@vite/vitejs';
import { getActiveAcc } from 'wallet';
import { powProcess } from 'pcComponents/pow/index';
import { quotaConfirm } from 'pcComponents/quota/index';
import { vbConfirmDialog } from 'pcComponents/dialog';
import { execWithValid } from 'pcUtils/execWithValid';
import { getVbInstance } from 'wallet/vb';
import { viteClient } from 'services/apiServer';

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
    }
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
    console.log(activeAccount);

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
export default sendTx;


async function webSendTx({ methodName, params, config, privateKey }) {
    const accountBlock = createAccountBlock(methodName, params).setProvider(viteClient).setPrivateKey(privateKey);
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

    const powInstance = powProcess({ ...config.powConfig });
    await accountBlock.PoW(difficulty);

    if (!powInstance || !powInstance.isShow) {
        throw {
            code: '1000002',
            message: 'Already canceled pow.'
        };
    }

    await powInstance.stopCount();

    if (!powInstance || !powInstance.isShow) {
        throw {
            code: '1000002',
            message: 'Already canceled pow.'
        };
    }

    try {
        const result = await accountBlock.sign().send();
        powInstance && powInstance.isShow && powInstance.gotoFinish();
        return result;
    } catch (err) {
        console.error('send err', err);

        if (!powInstance || !powInstance.isShow) {
            return;
        }
        powInstance.gotoFinish();
        throw err;
    }
}

function vbSendTx({ methodName, params, vbExtends, abi, description }) {
    const confirmPromise: any = vbConfirmDialog();
    const { compInstance } = confirmPromise;

    confirmPromise.then(() => {
        // 如果点击了关闭窗口，则不再提示
        compInstance && compInstance.close();
    });

    const accountBlock = createAccountBlock(methodName, params).accountBlock;
    console.log(accountBlock);

    if (!accountBlock.data) {
        delete accountBlock.data;
    }

    const vb = getVbInstance();
    return vb.sendVbTx({
        block: accountBlock,
        extend: vbExtends,
        abi,
        description
    }).finally(() => {
        compInstance && compInstance.close();
    });
}

function formatConfig(config) {
    config = config || defaultConfig;
    // console.log(config);

    const pow = !!config.pow;
    const powConfig = config.powConfig
        ? config.powConfig
        : defaultConfig.powConfig;

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
        return { pow, powConfig, confirmConfig: null };
    }

    const confirmConfig = config.confirm ? config.confirm : defaultConfig.confirm;
    if (!isObject(confirmConfig)) {
        throw new Error('[Error] utils/sendTx: config.confirm should be an object.');
    }

    if (!confirmConfig.operate || typeof confirmConfig.operate !== 'string') {
        throw new Error('[Error] utils/sendTx: config.confirm.operate is required and should be a string, while pow is off.');
    }

    return { pow, powConfig, confirmConfig };
}
