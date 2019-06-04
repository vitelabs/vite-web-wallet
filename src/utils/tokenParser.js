import Identicon from 'identicon.js';
import { utils } from '@vite/vitejs';

const { blake2b, _Buffer } = utils;
const iconConfig = {
    size: 100,
    format: 'svg'
};

export function getTokenIcon(tokenId) {
    const tokenHash = blake2b(tokenId);
    const hexStr = _Buffer(tokenHash).toString('hex');

    return `data:image/svg+xml;base64,${ new Identicon(hexStr,
        iconConfig).toString() }`;
}

export function getTokenNameString(symbol, index, length = 3) {
    if (symbol === 'VITE') {
        return symbol;
    }
    const s = String(index);
    if (s.length > length) throw 'wrong index length';

    return (
        `${ symbol }-${
            Array(length - s.length)
                .fill(0)
                .join('')
        }${ s }`
    );
}
