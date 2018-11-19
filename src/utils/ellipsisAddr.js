export default function(addr, len = 10) {
    if (!addr) {
        return '';
    }
    let beforeLen = 5 + len;
    let afterLen = len;
    return addr.length > (beforeLen + afterLen) ? 
        addr.slice(0, beforeLen) + '......' + addr.slice(-afterLen) : '';
}