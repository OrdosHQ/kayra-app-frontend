import { FC, useCallback, useEffect, useState } from 'react';
import { shortAddress } from '@/shared/utils';
import copy from 'copy-to-clipboard';

import styles from './address.module.scss';

interface IAddressProps {
    address?: string;
}

export const Address: FC<IAddressProps> = ({ address }) => {
    const [isCopied, setIsCopied] = useState(false);

    const addressClickHandler = useCallback(
        (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            e.stopPropagation();

            if (!address) return;

            const isCopied = copy(address);

            setIsCopied(isCopied);
        },
        [address],
    );

    useEffect(() => {
        if (isCopied) {
            setTimeout(() => setIsCopied(false), 1_000);
        }
    }, [isCopied]);

    return (
        <div onClick={addressClickHandler} className={styles.address}>
            {isCopied ? (
                'Address Copied!'
            ) : (
                <>
                    {shortAddress(address)}
                    <svg
                        className={styles.icon}
                        width={10}
                        height={10}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M14 8H4C2.897 8 2 8.897 2 10V20C2 21.103 2.897 22 4 22H14C15.103 22 16 21.103 16 20V10C16 8.897 15.103 8 14 8Z"
                            fill="currentColor"
                        ></path>
                        <path
                            d="M20 2H10C8.896 2 8 2.896 8 4V6H9H16C17.104 6 18 6.896 18 8V15V16H20C21.104 16 22 15.104 22 14V4C22 2.896 21.104 2 20 2Z"
                            fill="currentColor"
                        ></path>
                    </svg>
                </>
            )}{' '}
        </div>
    );
};
