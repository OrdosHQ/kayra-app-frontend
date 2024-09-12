import { FC, useCallback, useMemo } from 'react';
import { Button, TokenLogo } from '@/shared/ui';
import { Order as IOrder, useOrdersStore } from '../model';
import moment from 'moment';

import styles from './orders.module.scss';
import { useAccount, useConfig, useReadContract } from 'wagmi';
import { factoryABI } from '@/shared/constants';
import { waitForTransactionReceipt, writeContract } from '@wagmi/core';
import { useModalStore } from '@/entities/modal';
import { useConnectWallet } from '@/features/connect-wallet';

export const Orders: FC = () => {
    const { orders } = useOrdersStore();

    return (
        <div className={styles.container}>
            {/* <div className={styles.header}>
                <div className={styles.title}>Orders</div>
            </div> */}

            <div className={styles.content}>
                <table className={styles.orders}>
                    <thead>
                        <tr>
                            <th>Order Time</th>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <Order key={order.salt} {...order} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const Order: FC<IOrder> = ({
    salt,
    timestamp,
    token1,
    token2,
    amount1,
    amount2,
    address,
    depositAddress,
}) => {
    const { data } = useReadContract({
        address: `0x6D2762dD27C439E1D74B53F89DbB3DEc51f14795`,
        functionName: 'isContract',
        args: [depositAddress],
        abi: factoryABI,
    });
    const { connected, connectClickHandler } = useConnectWallet();

    const status = useMemo(() => (data ? 'success' : 'in progress'), [data]);
    const config = useConfig();
    const { showModal, closeModal, updateModalState } = useModalStore();
    const removeOrder = useOrdersStore((store) => store.removeOrder);

    const cancelOrder = useCallback(async () => {
        try {
            if (!connected) {
                await connectClickHandler();
            }

            showModal({
                modalType: 'transactionLoader',
                modalState: {
                    token1,
                    amount1,
                    status: 'loading',
                    title: 'Canceling order',
                },
            });

            const txHash = await writeContract(config, {
                address: '0x6D2762dD27C439E1D74B53F89DbB3DEc51f14795',
                functionName: 'forceWithdraw',
                args: [salt, token1.sepoliaAddress],
                abi: factoryABI,
            });

            await waitForTransactionReceipt(config, {
                hash: txHash,
                confirmations: 1,
            });

            removeOrder(salt);

            updateModalState({
                status: 'success',
                title: 'Order canceled',
                link: `https://sepolia.etherscan.io/tx/${txHash}`,
            });
        } catch {
            closeModal();
        }
    }, [
        config,
        connected,
        salt,
        token1.sepoliaAddress,
        removeOrder,
        closeModal,
        updateModalState,
    ]);

    const { chainId } = useAccount();

    const buttonContent = useMemo(() => {
        if (chainId !== 11155111) {
            return (
                <Button disabled view="secondary" size="xs">
                    Switch to Sepolia
                </Button>
            );
        }

        return (
            <Button onClick={cancelOrder} size="xs">
                Cancel
            </Button>
        );
    }, [chainId]);

    return (
        <tr key={salt} className={styles.order}>
            <td>
                <div className={styles.time}>
                    {moment.unix(timestamp).fromNow()}
                </div>
            </td>

            <td>
                <div className={styles.type}>
                    <span>Swap</span>
                    <div className={styles.token}>
                        <TokenLogo size="xs" src={token1.logoURI} />

                        <div className={styles.tokenSymbol}>
                            {token1.symbol}
                        </div>
                    </div>
                    for
                    <div className={styles.token}>
                        <TokenLogo size="xs" src={token2.logoURI} />

                        <div className={styles.tokenSymbol}>
                            {token2.symbol}
                        </div>
                    </div>
                </div>
            </td>

            <td>
                <div className={styles.amount}>
                    {amount1}
                    <div className={styles.token}>
                        <TokenLogo size="xs" src={token1.logoURI} />

                        <div className={styles.tokenSymbol}>
                            {token1.symbol}
                        </div>
                    </div>
                </div>
            </td>

            {/* <div className={styles.amount}>
                {amount2}
                <div className={styles.token}>
                    <TokenLogo size="xs" src={token2.logoURI} />

                    <div className={styles.tokenSymbol}>{token2.symbol}</div>
                </div>
            </div> */}

            <td>
                <div className={styles.actions}>
                    {status === 'in progress' ? <>{buttonContent}</> : null}
                </div>
            </td>
        </tr>
    );
};
