'use client';
import { FC, useCallback, useMemo, useState } from 'react';
import { Button, TokenInput } from '@/shared/ui';
import { USDC, erc20ABI, faucetABI } from '@/shared/constants';
import {
    useAccount,
    useBalance,
    useConfig,
    useReadContract,
    useSendTransaction,
} from 'wagmi';
import {
    readContract,
    waitForTransactionReceipt,
    writeContract,
} from '@wagmi/core';
import { formatUnits, parseUnits } from 'ethers';
import { sepolia } from 'wagmi/chains';

import styles from './faucet.module.scss';
import { useModalStore } from '@/entities/modal/model';
import { Token } from '@/shared/types';
import { captureException } from '@sentry/nextjs';

export const Faucet: FC = () => {
    const [token1, setToken1] = useState(USDC);

    const [amount1, setAmount1] = useState('1000');

    const config = useConfig();
    const { address } = useAccount();

    // const result = useBalance({
    //     address: token1.sepoliaAddress as `0x${string}`,
    //     chainId: sepolia.id,
    //     config: {

    //     }
    // });

    const result = useReadContract({
        abi: erc20ABI,
        address: token1.sepoliaAddress as `0x${string}`,
        functionName: 'balanceOf',
        args: [address],
    });

    const balance = useMemo(() => {
        if (result.data) {
            return formatUnits(result.data.toString(), token1.decimals);
        }

        return '0';
    }, [result, token1]);

    const showModal = useModalStore((store) => store.showModal);
    const closeModal = useModalStore((store) => store.closeModal);
    const updateModalState = useModalStore((store) => store.updateModalState);

    const submitClickHandler = useCallback(async () => {
        showModal({
            modalType: 'transactionLoader',
            modalState: {
                token1,
                amount1,
                status: 'loading',
                title: 'Faucet',
            },
        });

        try {
            const tx = await writeContract(config, {
                abi: faucetABI,
                address: token1.sepoliaAddress as `0x${string}`,
                functionName: 'mint',
                args: [address, parseUnits(amount1, token1.decimals)],
                chainId: sepolia.id,
            });

            await waitForTransactionReceipt(config, {
                hash: tx,
                confirmations: 1,
            });

            await result.refetch();

            updateModalState({
                status: 'success',
            });
        } catch (err) {
            captureException(err);

            closeModal();
            console.log(err);
        }
    }, [
        config,
        amount1,
        address,
        token1,
        result,
        showModal,
        closeModal,
        updateModalState,
    ]);

    const onTokenClick = useCallback(() => {
        showModal({
            modalType: 'selectToken',
            modalState: {
                onSelect: (token: any) => {
                    if (token.symbol === 'Test USDC') {
                        setAmount1('1000');
                    } else {
                        setAmount1('1');
                    }

                    setToken1(token);
                },
            },
        });
    }, [showModal]);

    return (
        <div className={styles.container}>
            <div className={styles.item}>
                <TokenInput
                    value={amount1}
                    token={token1}
                    header={'You receive'}
                    balance={balance}
                    onTokenClick={onTokenClick}
                    placeholder="0"
                    disabled
                />
            </div>

            <div className={styles.action}>
                <Button onClick={submitClickHandler} fill>
                    Faucet
                </Button>
            </div>
        </div>
    );
};
