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
import { readContract, writeContract } from '@wagmi/core';
import { generateSalt } from '@/shared/utils';
import { getNillionClient, getUserKeyFromSnap } from '@/shared/utils/nillion';
import { storeSecretsInteger } from '@/shared/utils/nillion/storeSecretsInteger';
import { storeProgram } from '@/shared/utils/nillion/storeProgram';
import { compute } from '@/shared/utils/nillion/compute';
import { retrieveSecretInteger } from '@/shared/utils/nillion/retrieveSecretInteger';

import styles from './swap.module.scss';

const programName = 'addition_simple';
const parties = ['Party1'];
const outputs = ['my_output'];

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
        [token1],
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

    async function storeSecret(
        nillion: any,
        nillionClient: any,
        programId: string,
        secretName: string,
        secretValue: string,
        permissionedUserIdForRetrieveSecret: string | null,
        permissionedUserIdForUpdateSecret: string | null,
        permissionedUserIdForDeleteSecret: string | null,
        permissionedUserIdForComputeSecret: string | null,
    ) {
        if (!programId) return null;

        try {
            const partyName = parties[0];
            const storeId = await storeSecretsInteger(
                nillion,
                nillionClient,
                [{ name: secretName, value: secretValue }],
                programId,
                partyName,
                permissionedUserIdForRetrieveSecret
                    ? [permissionedUserIdForRetrieveSecret]
                    : [],
                permissionedUserIdForUpdateSecret
                    ? [permissionedUserIdForUpdateSecret]
                    : [],
                permissionedUserIdForDeleteSecret
                    ? [permissionedUserIdForDeleteSecret]
                    : [],
                permissionedUserIdForComputeSecret
                    ? [permissionedUserIdForComputeSecret]
                    : [],
            );
            // .then(async (store_id: string) => {
            //     console.log('Secret stored at store_id:', store_id);
            //     setStoredSecretsNameToStoreId((prevSecrets) => ({
            //         ...prevSecrets,
            //         [secretName]: store_id,
            //     }));
            // });

            return { [secretName]: storeId };
        } catch (err) {
            console.log('Store secret fail', err);
        }
    }

    const nillionCompute = useCallback(
        async (_salt: any, amount1: string, _address?: string) => {
            try {
                const snapResponse = await getUserKeyFromSnap();

                const userKey = snapResponse?.user_key;

                if (!userKey) return null;

                const libraries = await getNillionClient(userKey);

                const nillion = libraries.nillion;
                const nillionClient = libraries.nillionClient;

                const userId = nillionClient.user_id;

                const programId = await storeProgram(
                    nillionClient,
                    programName,
                );
                // const programId = `${userId}/${programName}`;

                const amount1Secret = await storeSecret(
                    nillion,
                    nillionClient,
                    programId,
                    'my_int1',
                    amount1,
                    null,
                    null,
                    null,
                    null,
                );

                const amount2Secret = await storeSecret(
                    nillion,
                    nillionClient,
                    programId,
                    'my_int2',
                    '1000',
                    null,
                    null,
                    null,
                    null,
                );

                if (!amount1Secret || !amount2Secret) return null;

                return await compute(
                    nillion,
                    nillionClient,
                    [amount1Secret['my_int1'], amount2Secret['my_int2']],
                    programId,
                    outputs[0],
                );
            } catch (err) {
                console.log(err);
            }
        },
        [],
    );

    const submitClickHandler = useCallback(async () => {
        try {
            const salt = generateSalt();

            const data = await readContract(config, {
                address: '0x2bf09A74b83263FB72Aa36D81a5D1e1c1cd9A67E',
                functionName: 'computeOrderWalletAddress',
                args: [salt, address],
                abi: factoryABI,
            });

            if (!data) return null;

            // if (token1.symbol === 'ETH') {
            //     await sendTransactionAsync({
            //         to: token1.address as `0x${string}`,
            //         value: parseEther(amount1),
            //     });
            // } else {
            //     await writeContract(config, {
            //         abi: erc20ABI,
            //         address: token1.sepoliaAddress as `0x${string}`,
            //         functionName: 'transfer',
            //         args: [data, parseUnits(amount1, token1.decimals)],
            //     });
            // }

            console.log(
                'compute response',
                await nillionCompute(salt, amount1, address),
            );
        } catch (err) {
            console.log(err);
        }
    }, [config, amount1, address, nillionCompute]);

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

    return (
        <div className={styles.container}>
            <div className={styles.item}>
                <TokenInput
                    value={amount1}
                    onChange={amount1ChangeHandler}
                    token={token1}
                    header={'You pay'}
                    balance={balance1}
                    placeholder="0"
                />
            </div>
            <div className={styles.item}>
                <TokenInput
                    value={trade?.outputAmount.toSignificant(6)}
                    token={token2}
                    header={'You receive'}
                    balance={balance2}
                    placeholder="0"
                    disabled
                />
            </div>

            <div className={styles.action}>{button}</div>

            {price && <div className={styles.price}>{price}</div>}
        </div>
    );
};
