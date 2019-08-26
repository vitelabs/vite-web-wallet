import Bridge from '@vite/bridge';
import inviteRR from 'h5Assets/imgs/inviteRR.png';

export const bridge = new Bridge({ selfDefinedMethods: 'wallet.sendRawTx' });

bridge['app.setWebTitle']({ title: 'ViteX' }).then(() => {
    console.log('setWebTitle ok');
}).catch(err => {
    console.warn(err);
});

bridge['app.setRRButton']({ img: inviteRR }).then(() => {
    console.log('setRRButton ok');
}).catch(err => {
    console.warn(err);
});
