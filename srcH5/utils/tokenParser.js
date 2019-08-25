import { defaultTokenMap } from 'utils/constant';
import defaultTokenIcon from 'assets/imgs/default_token_icon.png';
import { getTokenSymbolString as _getTokenSymbolString } from 'utils/tokenParser';

export function getTokenIcon(tokenId) {
    if (tokenId && defaultTokenMap[tokenId]) {
        return defaultTokenMap[tokenId].icon || defaultTokenIcon;
    }
    return defaultTokenIcon;
}

export const getTokenSymbolString = _getTokenSymbolString;
