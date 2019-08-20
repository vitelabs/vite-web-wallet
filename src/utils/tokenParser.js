import Identicon from 'identicon.js';
import { utils } from '@vite/vitejs';
import { defaultTokenMap } from 'utils/constant';

const { blake2b, _Buffer } = utils;
const iconConfig = { format: 'png' };

export function getTokenIcon(tokenId) {
    if (defaultTokenMap[tokenId]) {
        return defaultTokenMap[tokenId].icon;
    }
    const tokenHash = blake2b(tokenId);
    const hexStr = _Buffer(tokenHash).toString('hex');

    return `data:image/png+xml;base64,${ new Identicon(hexStr,
        iconConfig).toString() }`;
}

export function getTokenNameString(symbol, index, length = 3) {
    if (!symbol) {
        return '';
    }
    if (symbol.toUpperCase() === 'VITE' || symbol.toUpperCase() === 'VCP' || symbol.toUpperCase() === 'VX' || index === undefined) {
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
