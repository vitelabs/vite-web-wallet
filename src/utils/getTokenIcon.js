import Identicon from 'identicon.js';
import { encoder } from 'utils/tools';
const iconConfig = {
    size: 100,
    format: 'svg'
};

export default function getTokenIcon(tokenId) {
    let tokenHash = encoder.blake2b(tokenId);
    let hexStr = encoder._Buffer(tokenHash).toString('hex');
    return 'data:image/svg+xml;base64,' + new Identicon(hexStr, iconConfig).toString();
}