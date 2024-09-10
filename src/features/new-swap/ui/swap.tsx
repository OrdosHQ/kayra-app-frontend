'use client';
import { FC, useCallback, useMemo, useState } from 'react';
import { Button, TokenInput, TokenLogo } from '@/shared/ui';
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
import { generateSalt } from '@/shared/utils';
import styles from './swap.module.scss';
import {
    fetchBackendCompute,
    fetchBackendParameters,
    fetchExecutorId,
} from '../api';
import { useModalStore } from '@/entities/modal';
import Image from 'next/image';
import { captureException } from '@sentry/nextjs';
import { useConnectWallet } from '@/features/connect-wallet';
import {
    useNillion,
    useNillionAuth,
    useNilStoreValue,
} from '@nillion/client-react-hooks';
import {
    Days,
    NadaValue,
    NadaValues,
    NamedValue,
    ProgramBindings,
    ProgramId,
    SecretInteger,
    StoreAcl,
    UserId,
    UserSeed,
} from '@nillion/client-core';
import { useOrdersStore } from '@/entities/orders/model';
import moment from 'moment';

// nillion.default();

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
            if (!e.target.value.length) setAmount1('');

            if (!isNaN(Number(e.target.value))) {
                setAmount1(e.target.value);
            }
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

    const priceContent = useMemo(() => {
        if (!trade) return null;

        return (
            <>
                <TokenLogo size="s" src={token1.logoURI} /> 1 {tokenA.symbol} =
                <TokenLogo size="s" src={token2.logoURI} />
                {trade.executionPrice.toSignificant(6)} {tokenB.symbol}
            </>
        );
    }, [trade, tokenA, tokenB]);

    const config = useConfig();
    const { address } = useAccount();
    const { sendTransactionAsync } = useSendTransaction();
    const { showModal, closeModal, updateModalState } = useModalStore();

    const swapClickHandler = useCallback(() => {
        setToken1(token2);
        setToken2(token1);

        setAmount1(trade?.outputAmount.toSignificant(6) as any);
    }, [token1, token2, trade]);

    const { login } = useNillionAuth();
    const nilStore = useNilStoreValue();
    const nilClient = useNillion();

    const nillionExecute = useCallback(
        async (address: `0x${string}`, salt: `0x${string}`, amount: string) => {
            try {
                const userSeed = UserSeed.parse(generateSalt());
                const isLoggedIn = await login({
                    userSeed: userSeed,
                    signer: 'keplr',
                });

                if (!isLoggedIn) return null;

                const backendParameters = await fetchBackendParameters();
                const executorId = await fetchExecutorId();

                const nadaValues = NadaValues.create();

                console.log(Number(amount), 'amount');

                const secretAmountName = NamedValue.parse('amount');
                const secretAmountValue = NadaValue.createSecretInteger(
                    Number(amount),
                );

                nadaValues.insert(secretAmountName, secretAmountValue);

                const secretTokenAddressValue =
                    NadaValue.createSecretIntegerUnsigned(
                        BigInt(token1.sepoliaAddress),
                    );

                const secretTokenAddressName = NamedValue.parse('asset');

                nadaValues.insert(
                    secretTokenAddressName,
                    secretTokenAddressValue,
                );

                const secretReceiverAddress =
                    NadaValue.createSecretIntegerUnsigned(BigInt(address));

                const secretReceiverAddressName = NamedValue.parse('address');

                nadaValues.insert(
                    secretReceiverAddressName,
                    secretReceiverAddress,
                );

                const secretSalt = NadaValue.createSecretIntegerUnsigned(
                    BigInt(salt),
                );

                const secretSaltName = NamedValue.parse('salt');

                nadaValues.insert(secretSaltName, secretSalt);

                const acl = StoreAcl.create();

                const executorUserId = UserId.parse(executorId);
                const programId = ProgramId.parse(backendParameters.program_id);

                acl.allowRetrieve(executorUserId);
                acl.allowUpdate(executorUserId);
                acl.allowDelete(executorUserId);
                acl.allowCompute(executorUserId, programId);

                const storeId = await nilClient.client.storeValues({
                    values: nadaValues,
                    ttl: 1 as any,
                    acl,
                });

                return await fetchBackendCompute({
                    store_id: storeId.ok,
                    party_id: nilClient.client.partyId,
                    executor_id: executorId,
                });
            } catch (err) {
                captureException(err);

                console.log(err);

                throw err;
            }
        },
        [amount1, token1, token2, trade, nilClient, login],
    );

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

    const { addOrder } = useOrdersStore();

    const submitClickHandler = useCallback(async () => {
        const salt = generateSalt();
        let depositAddress = '' as `0x${string}`;

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

            depositAddress = (await readContract(config, {
                address: '0x6D2762dD27C439E1D74B53F89DbB3DEc51f14795',
                functionName: 'computeOrderWalletAddress',
                args: [salt, address],
                abi: factoryABI,
            })) as `0x${string}`;

            if (!depositAddress) return null;

            let amount: any = null;

            // if (token1.symbol === 'ETH') {
            //     amount = parseEther(amount1);

            //     await sendTransactionAsync({
            //         to: token1.address as `0x${string}`,
            //         value: amount,
            //     });
            // } else {
            //     amount = parseUnits(amount1, token1.decimals);

            //     await writeContract(config, {
            //         abi: erc20ABI,
            //         address: token1.sepoliaAddress as `0x${string}`,
            //         functionName: 'transfer',
            //         args: [data, amount],
            //     });
            // }
            amount = parseUnits(amount1, token1.decimals);

            await writeContract(config, {
                abi: erc20ABI,
                address: token1.sepoliaAddress as `0x${string}`,
                functionName: 'transfer',
                args: [depositAddress, amount],
            });

            const response = await nillionExecute(
                address!,
                salt,
                amount.toString(),
            );

            if (!response) return;

            await waitForTransactionReceipt(config, {
                hash: response.settlement_result.tx_hash,
                confirmations: 1,
            });

            updateModalState({
                status: 'success',
                link: `https://sepolia.etherscan.io/tx/${response.settlement_result.tx_hash}`,
            });
        } catch (err) {
            captureException(err);

            const order = {
                salt,
                token1,
                token2,
                amount1: amount1,
                amount2: trade?.outputAmount.toSignificant(6) ?? '0',
                address: address as any,
                depositAddress: depositAddress,
                timestamp: moment().unix(),
                storeId: '',
            };

            addOrder(order);

            closeModal();
        } finally {
            result1.refetch();
            result2.refetch();
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
        addOrder,
    ]);

    const { connected, connectClickHandler } = useConnectWallet();

    const button = useMemo(() => {
        if (!connected) {
            return (
                <Button fill onClick={connectClickHandler}>
                    Connect Wallet
                </Button>
            );
        }

        if (Number(balance1) < Number(amount1)) {
            return (
                <Button disabled fill onClick={submitClickHandler}>
                    Not enough balance
                </Button>
            );
        }

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
    }, [connected, trade, submitClickHandler, connectClickHandler]);

    const amount2 = useMemo(() => {
        if (!Number(amount1)) return '';

        return trade?.outputAmount.toSignificant(6);
    }, [amount1, trade]);

    const maxClickHandler = useCallback(() => {
        setAmount1(balance1);
    }, [balance1]);

    return (
        <div className={styles.container}>
            <div className={styles.form}>
                <div className={styles.item}>
                    <TokenInput
                        maxLength={18}
                        onMaxClick={maxClickHandler}
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
                        value={amount2}
                        token={token2}
                        balance={balance2}
                        placeholder="0"
                        disabled
                    />
                </div>
            </div>

            {priceContent && <div className={styles.price}>{priceContent}</div>}

            <div className={styles.action}>{button}</div>
        </div>
    );
};
