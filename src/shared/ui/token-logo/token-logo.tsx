import { FC } from 'react';

import styles from './token-logo.module.scss';

export const TokenLogo: FC<{
    src: string;
    alt?: string;
    size?: 'm' | 's' | 'l';
}> = ({ src, alt, size = 'm' }) => (
    <img
        className={`${styles.image} ${styles[`image_size_${size}`]}`}
        src={src}
        alt={alt}
    />
);
