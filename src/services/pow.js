import {encoder, address} from 'utils/tools';
import $ViteJS from 'utils/viteClient';

// [TODO] http ??
const DefaultDifficulty = '67108864';

export async function getPowNonce(addr, prevHash, difficulty = DefaultDifficulty) {
    const realAddr = address.getAddrFromHexAddr(addr);
    const hash = encoder.bytesToHex(encoder.blake2b(encoder.hexToBytes(realAddr + prevHash), null, 32));

    const result = await $ViteJS.request('pow_getPowNonce', difficulty, hash);

    return {
        nonce: result,
        difficulty
    };
}
