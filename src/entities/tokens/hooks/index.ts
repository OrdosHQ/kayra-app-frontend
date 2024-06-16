import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Token } from 'shared/types';

export const useTokens = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['tokens'],
        queryFn: async () => {
            return await axios
                .get<{ tokens: Token[] }>(
                    `https://tokens.coingecko.com/ethereum/all.json`,
                )
                .then((res) => res.data);
        },
        initialData: {
            tokens: [],
        },
    });

    return useMemo(
        () => ({ tokens: data.tokens, isLoading }),
        [data, isLoading],
    );
};
