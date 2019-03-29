import { utils } from '@vite/vitejs';
import { wallet } from 'utils/wallet';
import { powProcess } from 'components/pow/index';
import { quotaConfirm } from 'components/quota/index';

console.log(utils.tools);
const { isObject } = utils.encoder;

/**
 * config: {
 *   pow: Boolean,
 *   powConfig? : { // 当 PoW 开启时生效
 *      isShowCancel: Boolean<true | false>,
 *      cancel: Function,
 *      difficulty: String
 *   },
 *   confirm? : { // 当 PoW 关闭时生效
 *      showMask ?: Boolean<true | false>,
 *      operate: String
 *   }
 * }
 */

const defaultConfig = {
    pow: true,
    powConfig: {
        isShowCancel: false,
        cancel: () => {},
        difficulty: ''
    },
    confirm: {
        showMask: true,
        operate: ''
    }
};

export default function sendTx(method, data, config = defaultConfig) {
    config = formatConfig(config);
    const event = new EventEmitter();

    method(data).then(result => {
        event.thenCb && event.thenCb(result);
    }).catch(err => {
        if (!err || !err.error || !err.error.code || err.error.code !== -35002) {
            event.catchCb && event.catchCb(err);
            return;
        }

        if (config.pow) {
            runPoW(err.accountBlock, config.powConfig, event);
            return;
        }

        quotaConfirm(config.confirmConfig);
        event.confirmAppearedCb && event.confirmAppearedCb(err);
    });

    return event;
}


async function runPoW(accountBlock, powConfig, event) {
    const activeAccount = wallet.getActiveAccount();

    if (!activeAccount
        || activeAccount.getDefaultAddr() !== accountBlock.accountAddress) {
        event.catchCb && event.catchCb({
            code: '1000000',
            message: `${ accountBlock.accountAddress } is expired.`
        });
        return;
    }

    event.powStartedCb && event.powStartedCb();

    powProcess({
        accountBlock,
        ...powConfig
    }).then(result => {
        if (event.powSuccessedCb) {
            event.powSuccessedCb(result);
        } else {
            event.thenCb && event.thenCb(result);
        }
        event.powFinishedCb && event.powFinishedCb(result);
    }).catch((...args) => {
        if (event.powFailedCb) {
            event.powFailedCb(...args);
        } else {
            event.catchCb && event.catchCb(...args);
        }
        event.powFinishedCb && event.powFinishedCb(...args);
    });
}


class EventEmitter {
    constructor() {
        this.thenCb = null;
        this.catchCb = null;
        this.powStartedCb = null;
        this.powSuccessedCb = null;
        this.powFailedCb = null;
        this.confirmAppearedCb = null;
        this.powFinishedCb = null;
    }

    _setCb(type, cb) {
        if (!this[type]) {
            throw new Error(`[Error] don\'t have this event ${ type }.`);
        }

        if (!cb || typeof cb !== 'function') {
            throw new Error(`[Error] the ${ type } is not a function.`);
        }

        this[`${ type }Cb`] = cb;
        return this;
    }

    then(cb) {
        return this._setCb('then', cb);
    }

    catch(cb) {
        return this._setCb('catch', cb);
    }

    confirmAppeared(cb) {
        return this._setCb('confirmAppeared', cb);
    }

    powStarted(cb) {
        return this._setCb('powStarted', cb);
    }

    powSuccessed(cb) {
        return this._setCb('powSuccessed', cb);
    }

    powFailed(cb) {
        return this._setCb('powFailed', cb);
    }

    powFinished(cb) {
        return this._setCb('powFinished', cb);
    }
}

function formatConfig(config) {
    config = config || defaultConfig;

    const pow = !!config.pow;
    const powConfig = config.powConfig ? config.powConfig : defaultConfig.powConfig;

    if (!isObject(powConfig)) {
        throw new Error('[Error] utils/sendTx: config.powConfig should be an Object.');
    }

    if (powConfig.cancel && typeof powConfig.cancel !== 'function') {
        throw new Error('[Error] utils/sendTx: config.pow[1].cancel should be a function.');
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
