import { FC } from 'react';

import styles from './button.module.scss';

interface IButtonProps
    extends React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    > {
    view?: 'primary' | 'secondary';
    size?: 'm' | 's' | 'xs';
    fill?: boolean;
}

export const Button: FC<IButtonProps> = ({
    view = 'primary',
    size = 'm',
    fill = false,
    ...props
}) => {
    return (
        <button
            className={`${styles.button} ${styles[`view_${view}`]} ${
                styles[`size_${size}`]
            } ${fill && styles['button_fill']}`}
            {...props}
        />
    );
};
