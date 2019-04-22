import { utils, hdAddr } from '@vite/vitejs';
import $ViteJS from 'utils/viteClient';

const { bytesToHex, blake2b, hexToBytes } = utils;
const DefaultDifficulty = '67108864';

export async function getPowNonce(addr, prevHash, difficulty = DefaultDifficulty) {
    difficulty = difficulty || DefaultDifficulty;

    const realAddr = hdAddr.getAddrFromHexAddr(addr);
    const hash = bytesToHex(blake2b(hexToBytes(realAddr + prevHash), null, 32));
    const result = await $ViteJS.request('pow_getPowNonce', difficulty, hash);

    return {
        nonce: result,
        difficulty
    };
}
