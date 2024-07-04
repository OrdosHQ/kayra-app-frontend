'use client';
import {
    createContext,
    FC,
    PropsWithChildren,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { NillionChainInfo } from './keplr.constants';
import { api } from './keplr.api';
import { Balances } from './keplr.types';
import { Dec, DecUtils } from '@keplr-wallet/unit';
// import { MsgSend } from '@/shared/cosmos/proto-types-gen/src/cosmos/bank/v1beta1/tx';

const KeplrWalletContext = createContext({});

export const KeplrProvider: FC<PropsWithChildren> = ({ children }) => {
    const [address, setAddress] = useState<null | string>(null);
    const [balance, setBalance] = useState<null | Dec>(null);
    const [nilDecimal, setNilDecimal] = useState<null | number>(null);

    const getBalance = async () => {
        const key = await window.keplr?.getKey(NillionChainInfo.chainId);
        const address = key!.bech32Address;

        if (address) {
            const uri = `${NillionChainInfo.rest}/cosmos/bank/v1beta1/balances/${address}?pagination.limit=1000`;

            const data = await api<Balances>(uri);
            const balance = data.balances.find(
                (balance) => balance.denom === 'unil',
            );

            const nilDecimal = NillionChainInfo.currencies.find(
                (currency) => currency.coinMinimalDenom === 'unil',
            )?.coinDecimals;

            if (nilDecimal) {
                setNilDecimal(nilDecimal);
            }

            if (balance) {
                const amount = new Dec(balance.amount, nilDecimal);
                setBalance(amount);
            } else {
            }
        }
    };

    const init = async () => {
        const keplr = window.keplr;
        if (keplr) {
            try {
                await keplr.experimentalSuggestChain(NillionChainInfo);
                const key = await keplr?.getKey(NillionChainInfo.chainId);

                setAddress(key.bech32Address);

                // if (!keplr.ethereum.isConnected()) {
                //     await keplr.ethereum.enable();
                // }
            } catch (e) {
                if (e instanceof Error) {
                    console.log(e.message);
                }
            }
        }
    };

    useEffect(() => {
        (async () => {
            await init();
            await getBalance();
        })();
    }, []);

    const sendBalance = async (recipient: string) => {
        if (window.keplr) {
            const key = await window.keplr?.getKey(NillionChainInfo.chainId);
            // const protoMsgs = {
            //     typeUrl: '/cosmos.bank.v1beta1.MsgSend',
            //     value: MsgSend.encode({
            //         fromAddress: key.bech32Address,
            //         toAddress: recipient,
            //         amount: [
            //             {
            //                 denom: 'uosmo',
            //                 amount: DecUtils.getTenExponentN(6)
            //                     .mul(new Dec(0.0000001))
            //                     .truncate()
            //                     .toString(),
            //             },
            //         ],
            //     }).finish(),
            // };

            try {
                // const gasUsed = await simulateMsgs(
                //     NillionChainInfo,
                //     key.bech32Address,
                //     [protoMsgs],
                //     [{ denom: 'uosmo', amount: '236' }],
                // );
                // if (gasUsed) {
                //     await sendMsgs(
                //         window.keplr,
                //         NillionChainInfo,
                //         key.bech32Address,
                //         [protoMsgs],
                //         {
                //             amount: [{ denom: 'uosmo', amount: '236' }],
                //             gas: Math.floor(gasUsed * 1.5).toString(),
                //         },
                //     );
                // }
            } catch (e) {
                if (e instanceof Error) {
                    console.log(e.message);
                }
            }
        }
    };

    console.log(address, balance);

    return (
        <KeplrWalletContext.Provider value={{}}>
            {children}
        </KeplrWalletContext.Provider>
    );
};
