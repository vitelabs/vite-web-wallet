import { defaultTokenMap } from 'utils/constant';
import defaultTokenIcon from 'assets/imgs/default_token_icon.png';

const No_Index_Token = [ 'VITE', 'VCP', 'VX' ];

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

    if (No_Index_Token.indexOf(symbol.toUpperCase()) !== -1 || index === undefined) {
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
