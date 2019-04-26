import { constant } from '@vite/vitejs';
import { wallet } from 'utils/wallet';

const { Vite_TokenId } = constant;

export const newMarket = function ({ tokenId = Vite_TokenId, amount, tradeToken, quoteToken }) {
    const activeAccount = wallet.getActiveAccount();

    return activeAccount.getBlock.dexFundNewMarket({
        tokenId,
        amount,
        tradeToken,
        quoteToken
    });
};

export const cancelOrder = function ({ orderId, tradeToken, side, quoteToken }) {
    const activeAccount = wallet.getActiveAccount();
    return activeAccount.getBlock.dexTradeCancelOrder({ orderId, tradeToken, side, quoteToken });
};

export const newOrder = function ({ tradeToken, quoteToken, side, price, quantity }) {
    const activeAccount = wallet.getActiveAccount();
    return activeAccount.getBlock.dexFundNewOrder({ tradeToken, quoteToken, side, price, quantity });
};

export const deposit = function ({ tokenId, amount }) {
    const activeAccount = wallet.getActiveAccount();
    return activeAccount.getBlock.dexFundUserDeposit({ tokenId, amount });
};

export const withdraw = function ({ tokenId, amount }) {
    const activeAccount = wallet.getActiveAccount();
    return activeAccount.getBlock.dexFundUserWithdraw({ tokenId, amount });
};

export const mintage = function ({ decimals, isReIssuable, maxSupply, ownerBurnOnly, totalSupply, tokenName, tokenSymbol }) {
    const activeAccount = wallet.getActiveAccount();

    return activeAccount.getBlock.mintage({
        decimals,
        isReIssuable,
        maxSupply,
        ownerBurnOnly,
        totalSupply,
        tokenName,
        tokenSymbol
    });
};
