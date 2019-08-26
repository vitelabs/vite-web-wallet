import store from 'h5Store';

export default async function ({ methodName, data }) {
    const activeAcc = store.state.account.activeAcc;
    const accountBlock = await activeAcc.getBlock[methodName](data);
    console.log(accountBlock);
    return accountBlock;
}
