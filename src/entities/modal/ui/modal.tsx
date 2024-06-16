'use client';
import { Icons } from '@/assets';
import { FC, useCallback, useMemo } from 'react';
import { contentFromModalType, closableModals } from '../constants';
import { useModalStore } from '../model';

import styles from './modal.module.scss';
import Image from 'next/image';

export const Modal: FC = () => {
    const closeModal = useModalStore((state) => state.closeModal);

    const closeClickCallback = useCallback(() => {
        closeModal();
    }, [closeModal]);

    const modalType = useModalStore((state) => state.modalType);

    const { isModalShow, content } = useMemo(() => {
        const content = modalType
            ? contentFromModalType[modalType] ?? null
            : null;

        const isModalShow = Boolean(content);

        return {
            isModalShow,
            content,
        };
    }, [modalType]);

    const isCloseShow = useMemo(
        () => (modalType ? closableModals.includes(modalType) : false),
        [modalType],
    );
    return (
        <div className={`${styles.container} ${isModalShow && styles.show}`}>
            {/* {'NULL'} */}
            <div className={styles.content}>
                {isCloseShow && (
                    <div onClick={closeClickCallback} className={styles.close}>
                        <Image
                            width={24}
                            height={24}
                            src="/close.svg"
                            alt="Close modal"
                        />
                    </div>
                )}
                {content}
            </div>
        </div>
    );
};
