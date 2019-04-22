import Identicon from 'identicon.js';
import { utils } from '@vite/vitejs';

const { blake2b, _Buffer } = utils;
const iconConfig = {
    size: 100,
    format: 'svg'
};

export default function getTokenIcon(tokenId) {
    const tokenHash = blake2b(tokenId);
    const hexStr = _Buffer(tokenHash).toString('hex');

    return `data:image/svg+xml;base64,${ new Identicon(hexStr, iconConfig).toString() }`;
}
