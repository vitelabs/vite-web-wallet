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
