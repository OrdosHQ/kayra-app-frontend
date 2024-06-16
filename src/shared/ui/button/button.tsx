import { FC } from 'react';

import styles from './button.module.scss';

interface IButtonProps
    extends React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    > {
    view?: 'primary';
    size?: 'm';
}

export const Button: FC<IButtonProps> = ({
    view = 'primary',
    size = 'm',
    ...props
}) => {
    return (
        <button
            className={`${styles.button} ${styles[`view_${view}`]} ${
                styles[`size_${size}`]
            }`}
            {...props}
        />
    );
};
