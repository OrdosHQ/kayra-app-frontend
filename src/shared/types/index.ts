import { ChainId } from '@uniswap/sdk-core';

export interface Token {
    address: string;
    chain: ChainId;
    decimals: number;
    name: string;
    symbol: string;
    logoURI: string;
}
