// let loopBlockTimeout = null;

// function startLoopBlock() {
//     let blockInfo = viteWallet.Block.getSyncInfo();
//     viteWallet.EventEmitter.emit('blockInfo', blockInfo);

//     if (blockInfo.status === 2) {
//         return;
//     }

//     loopBlockTimeout = window.setTimeout(() => {
//         stopLoopBlock();
//         startLoopBlock();
//     }, viteWallet.Block.getLoopBlockTime());
// }

// function stopLoopBlock() {
//     window.clearTimeout(loopBlockTimeout);
//     loopBlockTimeout = null;
// }

// startLoopBlock();