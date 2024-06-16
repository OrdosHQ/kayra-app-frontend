import { FC } from 'react';

import styles from './switch.module.scss';

interface ISwitchProps {
    value?: string;
    items?: {
        value: string;
        label: string;
        disabled?: boolean;
    }[];
}

export const Switch: FC<ISwitchProps> = ({ value, items }) => {
    return (
        <div className={styles.container}>
            {items &&
                items.map(({ value: itemValue, label, disabled }) => (
                    <div
                        key={itemValue}
                        className={`${styles.item} ${
                            value === itemValue && styles.selected
                        } ${disabled && styles.disabled}`}
                    >
                        {label}
                    </div>
                ))}
        </div>
    );
};
