export const rpcCode = function (err) {
    const code = err && err.error ? err.error.code || -1
        : err ? err.code : -1;

    // Const message = err && err.message ? err.message :
    // err.error ? err.error.message || '' : '';
    return code;
};
