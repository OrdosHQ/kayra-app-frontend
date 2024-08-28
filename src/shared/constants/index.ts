import { ChainId, WETH9 } from '@uniswap/sdk-core';
import {} from '@uniswap/v2-sdk';
import { uniswapV2PoolABI } from './uniswapV2PoolAbi';
import { factoryABI } from './factoryAbi';
import { erc20ABI } from './erc20Abi';
import { faucetABI } from './faucetAbi';
export { inter } from './font';

export const graphqlURL =
    'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3';

export const USDT = {
    chain: ChainId.MAINNET,
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    decimals: 6,
    symbol: 'USDT',
    name: 'Tether USD',
    logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
};

export const USDC = {
    chain: ChainId.MAINNET,
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    decimals: 6,
    symbol: 'Test USDC',
    name: 'USD Coin',
    logoURI:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
    sepoliaAddress: '0x354ba21d46410bd5415a4797c086b009c4f2819f',
};

export const WETH = {
    chain: ChainId.MAINNET,
    address: WETH9[ChainId.MAINNET].address,
    decimals: WETH9[ChainId.MAINNET].decimals,
    symbol: 'Test WETH',
    name: WETH9[ChainId.MAINNET].name ?? 'Wrapped Ethereum',
    logoURI: `https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/${
        WETH9[ChainId.MAINNET].address
    }/logo.png`,
    sepoliaAddress: '0xbdf26f174cca9f10e1a14baa38f37487a21f5088',
};

console.log(WETH, 'WET');

export const tokens = [USDC, WETH];

export { uniswapV2PoolABI, factoryABI, erc20ABI, faucetABI };
