'use client';
import { nillionConfig } from '@/shared/constants/nillion';
import { NillionProvider as LNillionProvider } from '@nillion/client-react-hooks';
import { FC, PropsWithChildren } from 'react';

export const NillionProvider: FC<PropsWithChildren> = ({ children }) => {
    return (
        <LNillionProvider config={nillionConfig}>{children}</LNillionProvider>
    );
};
