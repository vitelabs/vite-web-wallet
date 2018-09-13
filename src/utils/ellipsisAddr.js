export default function(addr) {
    if (!addr) {
        return '';
    }
    return addr.length > 25 ? addr.slice(0, 15) + '......' + addr.slice(-10) : '';
}