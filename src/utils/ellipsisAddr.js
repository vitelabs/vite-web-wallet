export default function (addr, len = 10, fontLen = 5) {
    if (!addr) {
        return '';
    }
    const beforeLen = fontLen + len;
    const afterLen = len;

    return addr.length > (beforeLen + afterLen)
        ? `${ addr.slice(0, beforeLen) }...${ addr.slice(-afterLen) }` : '';
}
