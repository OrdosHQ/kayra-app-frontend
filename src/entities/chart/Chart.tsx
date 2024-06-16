'use client';
import { FC, useEffect, useRef, useState } from 'react';
import {
    widget as Widget,
    ChartingLibraryWidgetOptions,
    LanguageCode,
    ResolutionString,
    IChartingLibraryWidget,
} from 'trading-view';
import { Datafeed } from './api';

import './Chart.scss';

export interface ChartContainerProps {
    symbol: ChartingLibraryWidgetOptions['symbol'];
    interval: ChartingLibraryWidgetOptions['interval'];

    // BEWARE: no trailing slash is expected in feed URL
    datafeedUrl: string;
    libraryPath: ChartingLibraryWidgetOptions['library_path'];
    chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url'];
    chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version'];
    clientId: ChartingLibraryWidgetOptions['client_id'];
    userId: ChartingLibraryWidgetOptions['user_id'];
    fullscreen: ChartingLibraryWidgetOptions['fullscreen'];
    autosize: ChartingLibraryWidgetOptions['autosize'];
    studiesOverrides: ChartingLibraryWidgetOptions['studies_overrides'];
    container: ChartingLibraryWidgetOptions['container'];
}

const getLanguageFromURL = (): LanguageCode | null => {
    const regex = new RegExp('[\\?&]lang=([^&#]*)');
    const results = regex.exec(window.location.search);
    return results === null
        ? null
        : (decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode);
};

export const Chart: FC = () => {
    const chartContainerRef =
        useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;

    const [widget, setWidget] = useState<null | IChartingLibraryWidget>(null);

    useEffect(() => {
        const defaultProps: Omit<ChartContainerProps, 'container'> = {
            symbol: 'Arcane Finance:WETH/USDC',
            interval: 'H' as ResolutionString,
            datafeedUrl: 'https://demo_feed.tradingview.com',
            libraryPath: '/charting_library/',
            chartsStorageUrl: 'https://saveload.tradingview.com',
            chartsStorageApiVersion: '1.1',
            clientId: 'tradingview.com',
            userId: 'public_user_id',
            fullscreen: false,
            autosize: true,
            studiesOverrides: {},
        };

        const widgetOptions: ChartingLibraryWidgetOptions = {
            symbol: defaultProps.symbol as string,
            // BEWARE: no trailing slash is expected in feed URL
            // tslint:disable-next-line:no-any
            datafeed: Datafeed as any,
            interval:
                defaultProps.interval as ChartingLibraryWidgetOptions['interval'],
            container: chartContainerRef.current,
            library_path: defaultProps.libraryPath as string,

            locale: getLanguageFromURL() || 'en',
            disabled_features: ['use_localstorage_for_settings'],
            enabled_features: ['study_templates'],
            charts_storage_url: defaultProps.chartsStorageUrl,
            charts_storage_api_version: defaultProps.chartsStorageApiVersion,
            client_id: defaultProps.clientId,
            user_id: defaultProps.userId,
            fullscreen: defaultProps.fullscreen,
            autosize: defaultProps.autosize,
            studies_overrides: defaultProps.studiesOverrides,
            theme: 'dark',
            time_frames: [
                // {
                //     text: '1M',
                //     resolution: '4W' as any,
                //     description: '1 MONTH',
                // },
            ],
            overrides: {
                'paneProperties.background': 'rgb(17, 17, 17)',
                'paneProperties.backgroundType': 'solid',
                // 'paneProperties.separatorColor': '#000',
                'candleStyle.upColor': 'rgb(148, 148, 255)',
                'candleStyle.borderUpColor': 'rgb(148, 148, 255)',
                'candleStyle.wickUpColor': 'rgb(148, 148, 255)',
                'candleStyle.downColor': 'rgba(242, 54, 69, .75)',
                'candleStyle.borderDownColor': 'rgba(242, 54, 69, .75)',
                'candleStyle.wickDownColor': 'rgba(242, 54, 69, .75)',
            },
        };

        const tvWidget = new Widget(widgetOptions);

        tvWidget.applyOverrides({
            // 'mainSeriesProperties': '#fff',
        });

        tvWidget.onChartReady(() => {
            setWidget(tvWidget);

            tvWidget.headerReady().then(() => {
                const button = tvWidget.createButton();
                button.setAttribute(
                    'title',
                    'Click to show a notification popup',
                );
                button.classList.add('apply-common-tooltip');
                button.addEventListener('click', () =>
                    tvWidget.showNoticeDialog({
                        title: 'Notification',
                        body: 'TradingView Charting Library API works correctly',
                        callback: () => {
                            console.log('Noticed!');
                        },
                    }),
                );
                button.innerHTML = 'Check API';
            });
        });

        // tvWidget.setCSSCustomProperty('--tv-color-pane-background', '#fff');

        return () => {
            tvWidget.remove();
        };
    }, []);

    useEffect(() => {
        if (widget) {
            widget.setCSSCustomProperty(
                '--tv-color-platform-background',
                'rgb(13, 13, 13)',
            );

            widget.setCSSCustomProperty(
                '--tv-color-pane-background',
                'rgb(17, 17, 17)',
            );

            widget.setCSSCustomProperty(
                '--tv-color-toolbar-button-text-active-hover',
                'rgb(148, 148, 255)',
            );

            widget.setCSSCustomProperty(
                '--tv-color-toolbar-button-text-active',
                'rgb(148, 148, 255)',
            );
        }
    }, [widget]);

    // const { fromToken, toToken } = useTradeStore();

    // const symbolString = useMemo(() => {
    //     if (fromToken && toToken) {
    //         return symbolMapper[fromToken][toToken];
    //     }

    //     return null;
    // }, [fromToken, toToken]);

    // useEffect(() => {
    //     if (widget && widget.setSymbol && symbolString) {
    //         widget?.setSymbol(symbolString, '1h' as any, () => {
    //             console.log('SYMBOL CHANGED');
    //         });
    //     }
    // }, [symbolString, widget]);

    return <div className={'chart'} ref={chartContainerRef}></div>;
};
