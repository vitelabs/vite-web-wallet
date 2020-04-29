import { utils } from '@vite/vitejs';

import { getActiveAcc } from 'wallet';
import { getVbInstance } from 'wallet/vb';


import { execWithValid } from 'pcUtils/execWithValid';
import { vbConfirmDialog } from 'pcComponents/dialog';

const { ed25519, _Buffer, blake2bHex } = utils;

const TEXT_SIGN_PREFIX = 'Vite Signed Message:\n';

const signText = execWithValid(function ({ text }) {
    const activeAccount = getActiveAcc();

    // 是否通过 vite connect 登陆
    if (activeAccount.isBifrost) {
        return vcSign({ text });
    }

    // 暂时不支持硬件钱包
    if (activeAccount.isHardware) {
        return Promise.reject({ code: '11021' });
    }

    return webSign({
        text,
        privateKey: activeAccount.privateKey
    });
});

// 通过 vite connect 签名
function vcSign({ text }) {
    const confirmPromise: any = vbConfirmDialog();
    const { compInstance } = confirmPromise;
    return new Promise((res, rej) => {
        confirmPromise.then(() => {
            // 如果点击了关闭窗口，则不再提示
            compInstance && compInstance.close();
            rej({ code: '11021' });
        });

        const vb = getVbInstance();
        vb.signVbText({ message: _Buffer.from(text).toString('base64') }).then(data => {
            res(data);
        }).catch(err => {
            rej(err);
        })
            .finally(() => {
                compInstance && compInstance.close();
            });
    });
}

// 通过浏览器本地私钥签名
async function webSign({ text, privateKey }) {
    const publicKeyHex = ed25519.getPublicKey(_Buffer.from(privateKey, 'hex')).toString('hex');

    const message = _Buffer.concat([
        _Buffer.from(TEXT_SIGN_PREFIX),
        _Buffer.from(text)
    ]).toString();

    const signature = ed25519.sign(blake2bHex(message, null, 32), privateKey);
    return {
        publicKey: _Buffer.from(publicKeyHex, 'hex').toString('base64'),
        signature: _Buffer.from(signature, 'hex').toString('base64')
    };
}

export default signText;
