import Identicon from 'identicon.js';
import { utils } from '@vite/vitejs';
import { defaultTokenMap } from 'utils/constant';
import { getTokenSymbolString as _getTokenSymbolString } from 'utils/tokenParser';

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

export const getTokenSymbolString = _getTokenSymbolString;
