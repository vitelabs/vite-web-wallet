export const rpcCode = function (err) {
    const code = err && err.error ? err.error.code || -1
        : err ? err.code : -1;

    // Const message = err && err.message ? err.message :
    // err.error ? err.error.message || '' : '';
    return code;
};

// code 11000 wc error
// 11012 用户拒绝
// 11020 链接断开
// code 12000 web error
// code 12001 未解锁
// code 12002 无激活账户
