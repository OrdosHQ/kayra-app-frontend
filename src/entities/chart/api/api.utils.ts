export function generateSymbol(exchange: any, fromSymbol: any, toSymbol: any) {
    const short = `${fromSymbol}/${toSymbol}`;
    return {
        short,
        full: `${exchange}:${short}`,
    };
}

// Returns all parts of the symbol
export function parseFullSymbol(fullSymbol: string) {
    const match = fullSymbol.match(/^(\w+):(\w+)\/(\w+)$/);
    if (!match) {
        return null;
    }
    return { exchange: match[1], fromSymbol: match[2], toSymbol: match[3] };
}
