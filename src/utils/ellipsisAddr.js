export default function (addr, len = 10) {
    if (!addr) {
        return '';
    }
    const beforeLen = 5 + len;
    const afterLen = len;

    return addr.length > (beforeLen + afterLen)
        ? `${ addr.slice(0, beforeLen) }......${ addr.slice(-afterLen) }` : '';
}
