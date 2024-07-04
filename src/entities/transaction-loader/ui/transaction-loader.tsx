'use client';
import { FC } from 'react';
import { useModalStore } from '@/entities/modal';
import { Icons } from '@/assets';

import styles from './transaction-loader.module.scss';
import Image from 'next/image';
import { TokenLogo } from '@/shared/ui';

export const TransactionLoader: FC = () => {
    const { state } = useModalStore();
    console.log(state);
    return (
        <div className={styles.container}>
            <div className={styles.loader}>
                <Image
                    width={200}
                    height={200}
                    alt="loader"
                    src={`/assets/icons/${
                        state.status === 'loading' ? 'loader' : 'success'
                    }.svg`}
                />
            </div>
            <div className={styles.title}>{state?.title}</div>
            <div className={styles.info}>
                <TokenLogo
                    size="s"
                    src={state?.token1?.logoURI}
                    alt={state?.token1?.name}
                />
                {`${state?.amount1} ${state?.token1?.symbol}`}{' '}
                {state.token2 && (
                    <>
                        <Image
                            width={20}
                            height={20}
                            src="/assets/icons/arrow-right.svg"
                            alt="arrowRight"
                        />{' '}
                        <TokenLogo
                            size="s"
                            src={state?.token2?.logoURI}
                            alt={state?.token2?.name}
                        />
                        {`${state?.amount2} ${state?.token2?.symbol}`}
                    </>
                )}
            </div>
        </div>
    );
};
