// import { constant } from '@vite/vitejs';
// import sendTx from 'h5Utils/sendTx';
// import i18n from 'h5I18n';

export function bindCode(code: number) {
    console.log(code);
    // return new Promise((res, rej) => {
    //     sendTx({
    //         abi: JSON.stringify(constant.DexFundBindInviteCode_Abi),
    //         description: {
    //             function: {
    //                 name: {
    //                     base: i18n.t('assets.invite.receiveInviteTitle', 'en'),
    //                     zh: i18n.t('assets.invite.receiveInviteTitle', 'zh')
    //                 }
    //             },
    //             inputs: [
    //                 {
    //                     name: {
    //                         base: i18n.t('assets.invite.codeLable'),
    //                         zh: i18n.t('assets.invite.codeLable')
    //                     }
    //                 }
    //             ]
    //         },
    //         methodName: 'dexFundBindInviteCode',
    //         data: { code },
    //         config: { pow: true }
    //     })
    //         .then(block => res(block))
    //         .catch(e => rej(e));
    // });
}
