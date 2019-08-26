import Bridge from '@vite/bridge';

export const bridge = new Bridge({ selfDefinedMethods: 'wallet.sendRawTx' });

bridge['app.setWebTitle']({ title: 'ViteX' }).then(() => {
    console.log('setWebTitle ok');
}).catch(err => {
    console.warn(err);
});
