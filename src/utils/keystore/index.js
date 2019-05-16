// function importKeystore(data) {
//     const keystore = _keystore.isValid(data);
//     if (!keystore) {
//         return false;
//     }

//     this.newActiveAcc({
//         keystore,
//         type: 'keystore'
//     });
//     this.activeWalletAcc.save();

//     return keystore.hexaddress;
// }
// async function _loginKeystoreAcc(addr, pass) {
//     const acc = getAccFromAddr(addr);
//     const keystore = acc.keystore;

//     const before = new Date().getTime();

//     const privKey = await _keystore.decrypt(JSON.stringify(keystore), pass, vitecrypto);

//     const after = new Date().getTime();
//     const n = (keystore.crypto && keystore.crypto.scryptparams && keystore.crypto.scryptparams.n)
//         ? keystore.crypto.scryptparams.n : 0;
//     statistics.event('keystore-decrypt', n, 'time', after - before);

//     if (n !== 262144) {
//         this.newActiveAcc({
//             name: acc.name,
//             pass,
//             keystore,
//             privateKey: privKey,
//             type: 'keystore'
//         });
//         setLastAcc({
//             addr,
//             name: acc.name
//         });

//         return true;
//     }

//     // Reduce the difficuly. 262144 to 4096
//     const keystoreStr = await _keystore.encryptOldKeystore(privKey, pass, vitecrypto);
//     this.newActiveAcc({
//         name: acc.name,
//         pass,
//         keystore: JSON.parse(keystoreStr),
//         privateKey: privKey,
//         type: 'keystore'
//     });
//     this.activeWalletAcc.save();

//     setLastAcc({
//         addr,
//         name: acc.name
//     });

//     return true;
// }
