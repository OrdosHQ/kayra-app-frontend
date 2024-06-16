import { getAllSymbols, historyProvider } from './historyProvider';

const supportedResolutions = [
    '1',
    '3',
    '5',
    '15',
    '30',
    '60',
    '120',
    '240',
    'D',
];

const config = {
    supported_resolutions: supportedResolutions,
    // symbols_types: [{ name: 'crypto', value: 'crypto' }],
};

const Datafeed = {
    onReady: (callback: any) => {
        console.log('[onReady]: Method call');
        if (callback) setTimeout(() => callback(config), 0);
    },
    searchSymbols: async (
        userInput: any,
        exchange: any,
        symbolType: any,
        onResultReadyCallback: any,
    ) => {
        console.log('[searchSymbols]: Method call');

        const symbols = await getAllSymbols();
        const newSymbols = symbols.filter((symbol: any) => {
            const isExchangeValid =
                exchange === '' || symbol.exchange === exchange;
            const isFullSymbolContainsInput =
                symbol.full_name
                    .toLowerCase()
                    .indexOf(userInput.toLowerCase()) !== -1;
            return isExchangeValid && isFullSymbolContainsInput;
        });
        console.log(newSymbols);

        onResultReadyCallback(newSymbols);
    },
    resolveSymbol: (
        symbolName: any,
        onSymbolResolvedCallback: any,
        onResolveErrorCallback: any,
        extension: any,
    ) => {
        console.log('[resolveSymbol]: Method call', symbolName);
        var split_data = symbolName.split(/[:/]/);
        // console.log({split_data})
        var symbol_stub = {
            name: symbolName,
            description: '',
            type: 'crypto',
            session: '24x7',
            timezone: 'Etc/UTC',
            ticker: symbolName,
            exchange: split_data[0],
            minmov: 1,
            pricescale: 100000000,
            has_intraday: true,
            intraday_multipliers: ['1', '60'],
            supported_resolution: supportedResolutions,
            volume_precision: 8,
            data_status: 'streaming',
        };

        if (split_data[2].match(/USD|EUR|JPY|AUD|GBP|KRW|CNY/)) {
            symbol_stub.pricescale = 100;
        }

        setTimeout(function () {
            onSymbolResolvedCallback(symbol_stub);
        }, 0);
    },
    getBars: (
        symbolInfo: any,
        resolution: any,
        periodParams: any,
        onHistoryCallback: any,
        onErrorCallback: any,
    ) => {
        console.log('[getBars]: Method call', symbolInfo, periodParams);
        historyProvider
            .getBars(
                symbolInfo,
                resolution,
                periodParams.from,
                periodParams.to,
                periodParams.firstDataRequest,
            )
            .then((bars) => {
                if (bars.length) {
                    onHistoryCallback(bars, { noData: false });
                } else {
                    onHistoryCallback(bars, { noData: true });
                }
            })
            .catch((err) => {
                console.log({ err });
                onErrorCallback(err);
            });
    },
    subscribeBars: (
        symbolInfo: any,
        resolution: any,
        onRealtimeCallback: any,
        subscriberUID: any,
        onResetCacheNeededCallback: any,
    ) => {
        console.log(
            '[subscribeBars]: Method call with subscriberUID:',
            subscriberUID,
        );
        // stream.subscribeBars(
        //     symbolInfo,
        //     resolution,
        //     onRealtimeCallback,
        //     subscriberUID,
        //     onResetCacheNeededCallback,
        // );
    },
    unsubscribeBars: (subscriberUID: any) => {
        console.log(
            '[unsubscribeBars]: Method call with subscriberUID:',
            subscriberUID,
        );
        // stream.unsubscribeBars(subscriberUID);
    },
};

export { Datafeed };
