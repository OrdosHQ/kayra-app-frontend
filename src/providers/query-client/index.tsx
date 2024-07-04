'use client';
import {
    QueryClient,
    QueryClientProvider as LQueryClientProvider,
} from '@tanstack/react-query';
import { FC, PropsWithChildren } from 'react';

const client = new QueryClient();

export const QueryClientProvider: FC<PropsWithChildren> = ({ children }) => {
    return (
        <LQueryClientProvider client={client}>{children}</LQueryClientProvider>
    );
};
