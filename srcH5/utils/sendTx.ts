import store from 'h5Store';
import { bridge } from 'h5Utils/bridge';

export default async function ({ methodName, data }) {
    const activeAcc = store.state.account.activeAcc;

    // [TODO] hack prevHash and height
    const accountBlock = await activeAcc.getBlock[methodName](data, 'sync');
    console.log(accountBlock);

    return bridge['pri.sendTx']({
        block: accountBlock
        // extend,
        // abi,
        // description
    });
}
