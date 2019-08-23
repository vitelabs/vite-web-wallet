import { defaultTokenMap } from 'utils/constant';
import defaultTokenIcon from 'assets/imgs/default_token_icon.png';

export function getTokenIcon(tokenId) {
    if (tokenId && defaultTokenMap[tokenId]) {
        return defaultTokenMap[tokenId].icon || defaultTokenIcon;
    }
    return defaultTokenIcon;
}

export function getTokenSymbolString(symbol, index, length = 3) {
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
