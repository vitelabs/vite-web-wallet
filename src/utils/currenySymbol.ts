export const symbolMap = {
    cny: '¥',
    usd: '$',
    rub: '₽',
    krw: '₩',
    try: '₺',
    vnd: '₫',
    eur: '€',
    gbp: '£',
    inr: '₹'
};
export const lowerSymbolList = Object.keys(symbolMap).sort();
export const symbolList = lowerSymbolList.map(v => v.toUpperCase());
export const getSymbol = Object.keys(symbolMap).reduce((pre, cur) => {
    return {
        ...pre,
        [cur]: symbolMap[cur],
        [cur.toUpperCase()]: symbolMap[cur]
    };
}, {});
