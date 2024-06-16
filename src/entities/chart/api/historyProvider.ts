import axios from 'axios';
import { generateSymbol } from './api.utils';
import moment from 'moment';

const api_root = 'https://min-api.cryptocompare.com';
const history: any = {};

const tokenMapper: any = {
    WBTC: 'BTC',
    USDC: 'USDC',
    USDT: 'USDT',
    WETH: 'ETH',
};

export async function getAllSymbols() {
    // const data = await axios
    //     .get(`${api_root}/data/v3/all/exchanges`)
    //     .then((response) => response.data);
    const allSymbols: any = [
        {
            description: 'USDC/USDT',
            exchange: 'Arcane Finance',
            full_name: 'Arcane Finance:USDC/USDT',
            symbol: 'USDC/USDT',
            type: 'crypto',
        },
        {
            description: 'WETH/USDT',
            exchange: 'Arcane Finance',
            full_name: 'Arcane Finance:WETH/USDT',
            symbol: 'WETH/USDT',
            type: 'crypto',
        },
        {
            description: 'WETH/USDC',
            exchange: 'Arcane Finance',
            full_name: 'Arcane Finance:WETH/USDC',
            symbol: 'WETH/USDC',
            type: 'crypto',
        },
        {
            description: 'WBTC/USDC',
            exchange: 'Arcane Finance',
            full_name: 'Arcane Finance:WBTC/USDC',
            symbol: 'WBTC/USDC',
            type: 'crypto',
        },
        {
            description: 'WBTC/USDT',
            exchange: 'Arcane Finance',
            full_name: 'Arcane Finance:WBTC/USDT',
            symbol: 'WBTC/USDT',
            type: 'crypto',
        },
        {
            description: 'WETH/WBTC',
            exchange: 'Arcane Finance',
            full_name: 'Arcane Finance:WETH/WBTC',
            symbol: 'WETH/WBTC',
            type: 'crypto',
        },
    ];

    // for (const exchange of [
    //     { value: 'Coinbase', name: 'Coinbase', desc: 'Coinbase' },
    // ]) {
    //     const pairs = data.Data[exchange.value].pairs;

    //     for (const leftPairPart of Object.keys(pairs)) {
    //         const symbols = pairs[leftPairPart].map((rightPairPart: any) => {
    //             const symbol = generateSymbol(
    //                 exchange.value,
    //                 leftPairPart,
    //                 rightPairPart,
    //             );
    //             return {
    //                 symbol: symbol.short,
    //                 full_name: symbol.full,
    //                 description: symbol.short,
    //                 exchange: exchange.value,
    //                 type: 'crypto',
    //             };
    //         });

    //         allSymbols = [...allSymbols, ...symbols];
    //     }
    // }

    return allSymbols;
}

export const historyProvider = {
    history: history,

    getBars: function (
        symbolInfo: { name: string },
        resolution: any,
        from: any,
        to: any,
        first: any,
        limit?: any,
    ) {
        const split_symbol = symbolInfo.name.split(/[:/]/);
        console.log(resolution, 'resolution');
        const url = resolution.includes('D')
            ? '/data/histoday'
            : resolution >= 60
            ? '/data/histohour'
            : '/data/histominute';
        const qs = {
            e: 'binance',
            fsym: tokenMapper[split_symbol[1] as any],
            tsym: tokenMapper[split_symbol[2] as any],
            fromTs: from ? from : '',
            toTs: to ? to : '',
            limit: limit ? limit : 500,
        };
        // console.log({qs})

        return axios
            .get(`${api_root}${url}`, {
                params: qs,
            })
            .then((response) => {
                // console.log({ data });
                // if (data.Response && data.Response === 'Error') {
                //     console.log('CryptoCompare API error:', data.Message);
                //     return [];
                // }
                const data = response.data;
                if (data.Data.length) {
                    console.log(
                        `Actually returned: ${new Date(
                            data.TimeFrom * 1000,
                        ).toISOString()} - ${new Date(
                            data.TimeTo * 1000,
                        ).toISOString()}`,
                    );
                    const bars = data.Data.filter((el: any) =>
                        moment.unix(el.time).isAfter(moment.unix(1693526400)),
                    ).map(
                        (el: {
                            time: number;
                            low: any;
                            high: any;
                            open: any;
                            close: any;
                            volumefrom: any;
                        }) => {
                            return {
                                time: el.time * 1000, //TradingView requires bar time in ms
                                low: el.low,
                                high: el.high,
                                open: el.open,
                                close: el.close,
                                volume: el.volumefrom,
                            };
                        },
                    );
                    if (first) {
                        const lastBar = bars[bars.length - 1];
                        history[symbolInfo.name] = { lastBar: lastBar };
                    }
                    return bars;
                } else {
                    return [];
                }
            })
            .catch((err) => []);
    },
};
