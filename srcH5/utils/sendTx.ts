import { accountBlock as accountBlockUtils } from '@vite/vitejs';

import { bridge } from 'h5Utils/bridge';
import toast from 'components/toast/index';

const isDev = process.env.NODE_ENV !== 'production';

export default async function ({ methodName, data }) {
    const accountBlock = accountBlockUtils.createAccountBlock(methodName, data).accountBlock;
    console.log(accountBlock);

    return new Promise((res, rej) => {
        bridge['pri.sendTx']({
            block: accountBlock
            // extend,
            // abi,
            // description
        }).then((...args) => {
            res(...args);
        }).catch(err => {
            console.warn(err);
            if (!isDev) {
                return rej(err);
            }

            // If not dev-env: toast error.
            if (err && +err.code <= 7 && (err.msg || err.message)) {
                toast(err.msg || err.message);
            }
            rej(err);
        });
    });
}
