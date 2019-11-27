import { utils, accountBlock as accountBlockUtils } from '@vite/vitejs';
import { getActiveAcc } from 'wallet';
import { powProcess } from 'pcComponents/pow/index';
import { quotaConfirm } from 'pcComponents/quota/index';
import { vbConfirmDialog } from 'pcComponents/dialog';
import { execWithValid } from 'pcUtils/execWithValid';

const { isObject } = utils;

const defaultConfig = {
    sendTx: true,
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

// [TODO]
const sendTx = execWithValid(function ({
    config = defaultConfig,
    methodName,
    data,
    vbExtends,
    abi,
    description
}) {
    config = formatConfig(config);

    const event = new EventEmitter();
    const activeAccount = getActiveAcc();

    let powInstance = null;
    let vbInstance = null;

    if (activeAccount.isBifrost) {
        const confirmPromise = vbConfirmDialog();
        const { compInstance } = confirmPromise;
        confirmPromise.then(() => {
            // 如果点击了关闭窗口，则不再提示。
            event.catchCb && event.catchCb({ code: 11021, message: '链接断开' });
            event.thenCb = null;
            event.catchCb = null;
        });
        vbInstance = compInstance;
    }

    const accountBlock = accountBlockUtils.createAccountBlock(methodName, data);

    activeAccount
        .sendPowTx({
            methodName,
            params: [data],
            vbExtends,
            abi,
            description,
            beforePow: (accountBlock, checkPowResult, next) => {
                // console.log('[beforePow]');

                const activeAccount = getActiveAcc();
                if (!activeAccount
                    || activeAccount.address !== accountBlock.accountAddress
                ) {
                    return Promise.reject({
                        code: '1000000',
                        message: `${ accountBlock.accountAddress } is expired.`
                    });
                }

                if (config.pow) {
                    powInstance = powProcess({ ...config.powConfig });
                    event.powStartedCb && event.powStartedCb();
                    return next();
                }

                quotaConfirm(config.confirmConfig);
                event.confirmAppearedCb && event.confirmAppearedCb(checkPowResult);
                return Promise.reject({
                    code: '1000001',
                    message: 'Don\'t need pow, already show confirm.'
                });
            },
            beforeSendTx: (accountBlock, checkPowResult, next) => {
                // console.log('[beforeSendTx]');
                if (!checkPowResult || !checkPowResult.difficulty) {
                    return next(!config.sendTx);
                }

                // console.log('[beforeSendTx] powInstance.isShow', powInstance.isShow);

                if (!powInstance || !powInstance.isShow) {
                    return Promise.reject();
                }

                return new Promise((res, rej) => {
                    powInstance.stopCount(() => {
                        if (!powInstance || !powInstance.isShow) {
                            return rej();
                        }

                        next(!config.sendTx)
                            .then(result => {
                                res(result);
                            })
                            .catch(err => {
                                rej(err);
                            });
                    });
                });
            }
        })
        .then(result => {
            // console.log(result);
            if (!powInstance) {
                event.thenCb && event.thenCb(result);
                return;
            }

            powInstance.gotoFinish(() => {
                event.powFinishedCb && event.powFinishedCb(result);

                if (event.powSuccessedCb) {
                    event.powSuccessedCb(result);
                    return;
                }
                event.thenCb && event.thenCb(result);
            });
        })
        .catch(err => {
            console.error('send err', err);
            if (!powInstance) {
                event.catchCb && event.catchCb(err);
                return;
            }

            powInstance.gotoFinish(() => {
                event.powFinishedCb && event.powFinishedCb(err);

                if (event.powFailedCb) {
                    event.powFailedCb(err);
                    return;
                }
                event.catchCb && event.catchCb(err);
            });
        })
        .finally(() => {
            if (activeAccount.isBifrost) {
                vbInstance && vbInstance.close();
            }
        });

    return event;
});
export default sendTx;
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

    // 交易发送成功。当监听 powSuccessed 事件时，运行PoW后成功则不进入 then 事件。
    then(cb) {
        return this._setCb('then', cb);
    }

    // 交易发送失败。当监听 powFailed 事件时，运行PoW后失败则不进入 catch 事件。
    catch(cb) {
        return this._setCb('catch', cb);
    }

    // confirm框出现。当关闭pow，配额不足出现确认框时调用此事件。
    confirmAppeared(cb) {
        return this._setCb('confirmAppeared', cb);
    }

    // 开始运行PoW。当开启pow，开始运行时调用此事件。
    powStarted(cb) {
        return this._setCb('powStarted', cb);
    }

    // 运行PoW后，交易成功。
    powSuccessed(cb) {
        return this._setCb('powSuccessed', cb);
    }

    // 运行PoW后，交易失败。
    powFailed(cb) {
        return this._setCb('powFailed', cb);
    }

    // 运行PoW后，交易完成。（无论成功或者失败，皆调用此事件）
    powFinished(cb) {
        return this._setCb('powFinished', cb);
    }
}

function formatConfig(config) {
    config = config || defaultConfig;
    // console.log(config);

    let sendTx = !!config.sendTx;
    if (
        !(
            config.hasOwnProperty('sendTx')
      && typeof config.sendTx !== 'undefined'
      && config.sendTx !== null
        )
    ) {
        sendTx = true;
    }

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
        return { pow, sendTx, powConfig, confirmConfig: null };
    }

    const confirmConfig = config.confirm ? config.confirm : defaultConfig.confirm;
    if (!isObject(confirmConfig)) {
        throw new Error('[Error] utils/sendTx: config.confirm should be an object.');
    }

    if (!confirmConfig.operate || typeof confirmConfig.operate !== 'string') {
        throw new Error('[Error] utils/sendTx: config.confirm.operate is required and should be a string, while pow is off.');
    }

    return { pow, sendTx, powConfig, confirmConfig };
}
