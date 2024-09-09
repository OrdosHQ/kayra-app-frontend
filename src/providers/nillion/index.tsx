'use client';
import { config } from '@/shared/constants/nillion';
import { NillionProvider as LNillionProvider } from '@nillion/client-react-hooks';
import { FC, PropsWithChildren } from 'react';

export const NillionProvider: FC<PropsWithChildren> = ({ children }) => {
    return <LNillionProvider config={config}>{children}</LNillionProvider>;
};
