'use client';
import { FC, useCallback, useMemo, useState } from 'react';
import { Button, TokenInput } from '@/shared/ui';
import {
    USDC,
    USDT,
    WETH,
    erc20ABI,
    factoryABI,
    uniswapV2PoolABI,
} from '@/shared/constants';
import { Token, CurrencyAmount, TradeType } from '@uniswap/sdk-core';
import { Pair, Route, Trade } from '@uniswap/v2-sdk';
import {
    JsonRpcProvider,
    ethers,
    formatUnits,
    parseEther,
    parseUnits,
} from 'ethers';
import { useQuery } from '@tanstack/react-query';
import {
    useAccount,
    useConfig,
    useReadContract,
    useSendTransaction,
} from 'wagmi';
import {
    readContract,
    waitForTransactionReceipt,
    writeContract,
} from '@wagmi/core';
import {
    generateSalt,
    getQuote,
    getUserKey,
    initializeNillionClient,
} from '@/shared/utils';
import * as nillion from '@nillion/client-web';
import styles from './swap.module.scss';
import { storeSecrets } from '@/shared/utils/nillion/storeSecrets';
import {
    createNilChainClientAndKeplrWallet,
    payWithKeplrWallet,
} from '@/shared/constants/nillion';
import {
    fetchBackendCompute,
    fetchBackendParameters,
    fetchExecutorId,
} from '../api';
import { useModalStore } from '@/entities/modal';
import Image from 'next/image';

nillion.default();

export const Swap: FC = () => {
    const [token1, setToken1] = useState(WETH);
    const [token2, setToken2] = useState(USDC);

    const tokenA = useMemo(
        () =>
            new Token(
                token1.chain,
                token1.address,
                token1.decimals,
                token1.symbol,
                token1.name,
            ),
        [token1],
    );

    const tokenB = useMemo(
        () =>
            new Token(
                token2.chain,
                token2.address,
                token2.decimals,
                token2.symbol,
                token2.name,
            ),
        [token2],
    );

    const [amount1, setAmount1] = useState('');

    const amount1ChangeHandler = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            // if (!e.target.value) setAmount1('');

            // if (Number(e.target.value)) {
            setAmount1(e.target.value);
            // }
        },
        [],
    );

    const { data: pair } = useQuery({
        queryKey: ['pair', tokenA, tokenB],
        queryFn: async () => {
            const pairAddress = Pair.getAddress(tokenA, tokenB);

            const pairContract = new ethers.Contract(
                pairAddress,
                uniswapV2PoolABI,
                new JsonRpcProvider('https://ethereum-rpc.publicnode.com'),
            );
            const reserves = await pairContract['getReserves']();

            const [reserve0, reserve1] = reserves;

            const tokens = [tokenA, tokenB];

            const [token0, token1] = tokens[0].sortsBefore(tokens[1])
                ? tokens
                : [tokens[1], tokens[0]];

            const pair = new Pair(
                CurrencyAmount.fromRawAmount(token0, String(reserve0)),
                CurrencyAmount.fromRawAmount(token1, String(reserve1)),
            );

            return pair;
        },
    });

    const trade = useMemo(() => {
        if (!pair || !Number(amount1)) return null;

        const amountA = Number(amount1) * 10 ** tokenA.decimals;

        const currencyA = CurrencyAmount.fromRawAmount(tokenA, amountA);

        // const [currencyB] = pair.getOutputAmount(currencyA);

        const route = new Route([pair], tokenA, tokenB);

        const trade = new Trade(route, currencyA, TradeType.EXACT_INPUT);

        return trade;
    }, [pair, amount1, tokenA, tokenB]);

    const price = useMemo(() => {
        if (!trade) return null;

        return `1 ${tokenA.symbol} = ${trade.executionPrice.toSignificant(6)} ${
            tokenB.symbol
        }`;
    }, [trade, tokenA, tokenB]);

    const { address } = useAccount();
    const { sendTransactionAsync } = useSendTransaction();
    const config = useConfig();
    const { showModal, closeModal, updateModalState } = useModalStore();

    const swapClickHandler = useCallback(() => {
        setToken1(token2);
        setToken2(token1);

        setAmount1(trade?.outputAmount.toSignificant(6) as any);
    }, [token1, token2, trade]);

    const nillionExecute = useCallback(
        async (address: `0x${string}`, salt: `0x${string}`, amount: string) => {
            try {
                const userKey = getUserKey();
                console.log(userKey);
                const nillionClient = initializeNillionClient(userKey);

                const secretForQuote = new nillion.NadaValues();

                const secrentAmount =
                    nillion.NadaValue.new_secret_integer(amount);
                const secretAmountName = 'amount';

                secretForQuote.insert(secretAmountName, secrentAmount);

                const secretTokenAddress = nillion.NadaValue.new_secret_integer(
                    BigInt(token1.sepoliaAddress).toString(),
                );

                const secretTokenAddressName = 'asset';

                secretForQuote.insert(
                    secretTokenAddressName,
                    secretTokenAddress,
                );

                const secretReceiverAddress =
                    nillion.NadaValue.new_secret_integer(
                        BigInt(address).toString(),
                    );
                const secretReceiverAddressName = 'address';

                secretForQuote.insert(
                    secretReceiverAddressName,
                    secretReceiverAddress,
                );

                const secretSalt = nillion.NadaValue.new_secret_integer(
                    BigInt(salt).toString(),
                );
                const secretSaltName = 'salt';

                secretForQuote.insert(secretSaltName, secretSalt);

                const ttl_days = 30;

                const storeOperation = nillion.Operation.store_values(
                    secretForQuote,
                    ttl_days,
                );

                const quoteResponse = await getQuote({
                    client: nillionClient,
                    operation: storeOperation,
                });

                const quote = {
                    quote: quoteResponse,
                    quoteJson: quoteResponse.toJSON(),
                    secret: secretForQuote,
                    operation: storeOperation,
                };

                const [nilChainClient, nilChainWallet] =
                    await createNilChainClientAndKeplrWallet();

                const paymentReceipt = await payWithKeplrWallet(
                    nilChainClient,
                    nilChainWallet,
                    quote,
                    `Storing secrets for swap ${amount1} ${
                        token1.symbol
                    } to ${trade?.outputAmount.toSignificant(6)} ${
                        token2.symbol
                    }`,
                );

                console.log('paymentReceipt:', paymentReceipt);

                const backend = await fetchBackendParameters();
                const executorId = await fetchExecutorId();

                const permissions = {
                    usersWithRetrievePermissions: [executorId],
                    usersWithUpdatePermissions: [executorId],
                    usersWithDeletePermissions: [executorId],
                    usersWithComputePermissions: [executorId],
                    programIdForComputePermissions: backend.program_id,
                };

                const storeId = await storeSecrets({
                    nillionClient,
                    nillionSecrets: quote.secret,
                    storeSecretsReceipt: paymentReceipt.receipt!,
                    ...permissions,
                });

                console.log(storeId);

                return await fetchBackendCompute({
                    store_id: storeId,
                    party_id: nillionClient.party_id,
                    executor_id: executorId,
                });
            } catch (err) {
                console.log(err);

                throw err;
            }
        },
        [amount1, token1, token2, trade],
    );

    const submitClickHandler = useCallback(async () => {
        try {
            showModal({
                modalType: 'transactionLoader',
                modalState: {
                    token1,
                    token2,
                    amount1,
                    amount2: trade?.outputAmount.toSignificant(6),
                    status: 'loading',
                    title: 'Swap',
                },
            });
            const salt = generateSalt();

            const data = await readContract(config, {
                address: '0x451021801954e3cb0e37eebe95284b0e1134027e',
                functionName: 'computeOrderWalletAddress',
                args: [salt, address],
                abi: factoryABI,
            });

            if (!data) return null;

            let amount: any = null;

            if (token1.symbol === 'ETH') {
                amount = parseEther(amount1);

                await sendTransactionAsync({
                    to: token1.address as `0x${string}`,
                    value: amount,
                });
            } else {
                amount = parseUnits(amount1, token1.decimals);

                await writeContract(config, {
                    abi: erc20ABI,
                    address: token1.sepoliaAddress as `0x${string}`,
                    functionName: 'transfer',
                    args: [data, amount],
                });
            }

            const response = await nillionExecute(
                address!,
                salt,
                amount.toString(),
            );

            await waitForTransactionReceipt(config, {
                hash: response.settlement_result.tx_hash,
                confirmations: 1,
            });

            updateModalState({
                status: 'success',
                link: `https://sepolia.etherscan.io/tx/${response.settlement_result.tx_hash}`,
            });
        } catch (err) {
            closeModal();
        }
    }, [
        config,
        amount1,
        address,
        token1,
        token2,
        showModal,
        trade,
        nillionExecute,
        closeModal,
        updateModalState,
        sendTransactionAsync,
    ]);

    const button = useMemo(() => {
        if (trade) {
            return (
                <Button fill onClick={submitClickHandler}>
                    Swap
                </Button>
            );
        }

        return (
            <Button fill disabled>
                Swap
            </Button>
        );
    }, [trade, submitClickHandler]);

    const result1 = useReadContract({
        abi: erc20ABI,
        address: token1.sepoliaAddress as `0x${string}`,
        functionName: 'balanceOf',
        args: [address],
    });

    const balance1 = useMemo(() => {
        if (result1.data) {
            return formatUnits(result1.data.toString(), token1.decimals);
        }

        return '0';
    }, [result1, token1]);

    const result2 = useReadContract({
        abi: erc20ABI,
        address: token2.sepoliaAddress as `0x${string}`,
        functionName: 'balanceOf',
        args: [address],
    });

    const balance2 = useMemo(() => {
        if (result2.data) {
            return formatUnits(result2.data.toString(), token2.decimals);
        }

        return '0';
    }, [result2, token2]);

    const amount2 = useMemo(() => {
        if (!amount1) return '';

        return trade?.outputAmount.toSignificant(6);
    }, [amount1, trade]);

    return (
        <div className={styles.container}>
            <div className={styles.form}>
                <div className={styles.item}>
                    <TokenInput
                        onMaxClick={() => {}}
                        value={amount1}
                        token={token1}
                        balance={balance1}
                        placeholder="0"
                        onChange={amount1ChangeHandler}
                    />
                </div>
                <div onClick={swapClickHandler} className={styles.swap}>
                    <Image
                        src="/assets/icons/arrow-bottom.svg"
                        width={35}
                        height={35}
                        alt="arrow"
                    />
                </div>
                <div className={styles.item}>
                    <TokenInput
                        onMaxClick={() => {}}
                        value={amount2}
                        token={token2}
                        balance={balance2}
                        placeholder="0"
                        disabled
                    />
                </div>
            </div>

            <div className={styles.action}>{button}</div>

            {price && <div className={styles.price}>{price}</div>}
        </div>
    );
};
