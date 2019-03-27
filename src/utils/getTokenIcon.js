import Identicon from 'identicon.js';
import { encoder } from 'utils/tools';
const iconConfig = {
    size: 100,
    format: 'svg'
};

export default function getTokenIcon(tokenId) {
    const tokenHash = encoder.blake2b(tokenId);
    const hexStr = encoder._Buffer(tokenHash).toString('hex');

    return `data:image/svg+xml;base64,${ new Identicon(hexStr, iconConfig).toString() }`;
}
