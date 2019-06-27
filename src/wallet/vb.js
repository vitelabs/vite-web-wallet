// import Connector from '/Users/yuanzhang/vitecodes/walletconnect-monorepo/packages/browser';

// export const BRIDGE = 'ws://hurrytospring.com:5001';
// export class VB extends Connector {
//     constructor(opts) {
//         super(opts);
//         this.on('connect', (error, payload) => {
//             if (error) {
//                 throw error;
//             }
//             this.address = 'vite_ab24ef68b84e642c0ddca06beec81c9acb1977bbd7da27a87a';
//             // const { accounts, chainId } = payload.params[0];
//         });
//         this.on('session_update', (error, payload) => {
//             if (error) {
//                 throw error;
//             }

//             // Get updated accounts and chainId
//             this.address = payload.params[0].address;
//             this.info('session_update');
//         });

//         this.on('disconnect', (error, payload) => {
//             if (error) {
//                 throw error;
//             }

//             // Delete walletConnector
//         });
//     }

//     async createSession() {
//         await super.createSession();
//         console.log(this.walletConnector.uri);
//         return this.uri;
//     }
// }
