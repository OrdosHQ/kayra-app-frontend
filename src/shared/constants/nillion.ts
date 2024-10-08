import { Registry } from '@cosmjs/proto-signing';
import { GasPrice, SigningStargateClient } from '@cosmjs/stargate';
import { PaymentReceipt } from '@nillion/client-web';
import { MsgPayFor, typeUrl } from '@nillion/client-web/proto';
import { ChainInfo } from '@keplr-wallet/types';
import { getKeplr, signerViaKeplr } from '../utils/keplr';
import { captureException } from '@sentry/nextjs';

export interface NillionEnvConfig {
    clusterId: string;
    bootnodes: string[];
    chain: {
        chainId: string;
        endpoint: string;
        keys: string[];
        chainInfo: ChainInfo;
    };
}

export const oldConfig: NillionEnvConfig = {
    clusterId: process.env.NEXT_PUBLIC_NILLION_CLUSTER_ID || '',
    bootnodes: [process.env.NEXT_PUBLIC_NILLION_BOOTNODE_WEBSOCKET || ''],
    chain: {
        chainId: process.env.NEXT_PUBLIC_NILLION_NILCHAIN_CHAIN_ID || '',
        endpoint: process.env.NEXT_PUBLIC_NILLION_NILCHAIN_JSON_RPC || '', // see webpack.config.js proxy
        keys: [process.env.NEXT_PUBLIC_NILLION_NILCHAIN_PRIVATE_KEY || ''],
        chainInfo: {
            rpc: process.env.NEXT_PUBLIC_NILLION_NILCHAIN_JSON_RPC || '',
            rest: 'https://nillion-testnet-api.polkachu.com',
            chainId: process.env.NEXT_PUBLIC_NILLION_NILCHAIN_CHAIN_ID || '',
            chainName: process.env.NEXT_PUBLIC_NILLION_NILCHAIN_CHAIN_ID || '',
            chainSymbolImageUrl:
                'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/nillion-chain-testnet/nil.png',
            stakeCurrency: {
                coinDenom: 'NIL',
                coinMinimalDenom: 'unil',
                coinDecimals: 6,
                coinImageUrl:
                    'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/nillion-chain-testnet/nil.png',
            },
            bip44: {
                coinType: 118,
            },
            bech32Config: {
                bech32PrefixAccAddr: 'nillion',
                bech32PrefixAccPub: 'nillionpub',
                bech32PrefixValAddr: 'nillionvaloper',
                bech32PrefixValPub: 'nillionvaloperpub',
                bech32PrefixConsAddr: 'nillionvalcons',
                bech32PrefixConsPub: 'nillionvalconspub',
            },
            currencies: [
                {
                    coinDenom: 'NIL',
                    coinMinimalDenom: 'unil',
                    coinDecimals: 6,
                    coinImageUrl:
                        'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/nillion-chain-testnet/nil.png',
                },
            ],
            feeCurrencies: [
                {
                    coinDenom: 'NIL',
                    coinMinimalDenom: 'unil',
                    coinDecimals: 6,
                    coinImageUrl:
                        'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/nillion-chain-testnet/nil.png',
                    gasPriceStep: {
                        low: 0.001,
                        average: 0.001,
                        high: 0.01,
                    },
                },
            ],
            features: [],
        },
    },
};

export const nillionConfig = {
    clusterId: process.env.NEXT_PUBLIC_NILLION_CLUSTER_ID || '',
    bootnodes: [process.env.NEXT_PUBLIC_NILLION_BOOTNODE_WEBSOCKET || ''],
    nilChainId: process.env.NEXT_PUBLIC_NILLION_NILCHAIN_CHAIN_ID || '',
    nilChainEndpoint: process.env.NEXT_PUBLIC_NILLION_NILCHAIN_JSON_RPC || '',
};

export async function createNilChainClientAndKeplrWallet(): Promise<
    [SigningStargateClient, any]
> {
    const keplr = await getKeplr();
    if (!keplr) {
        alert(
            'Install Keplr and create a Nillion Wallet following instructions here: https://docs.nillion.com/guide-testnet-connect',
        );
        throw new Error('Keplr extension not installed');
    }
    const wallet = await signerViaKeplr(oldConfig.chain.chainId, keplr);

    const registry = new Registry();
    registry.register(typeUrl, MsgPayFor);

    const options = {
        registry,
        gasPrice: GasPrice.fromString('0.0unil'),
    };

    const client = await SigningStargateClient.connectWithSigner(
        oldConfig.chain.endpoint,
        wallet,
        options,
    );
    return [client, wallet];
}

export interface PaymentResult {
    error?: any | null;
    receipt: PaymentReceipt | null;
    tx: string | null;
}

export async function payWithKeplrWallet(
    nilChainClient: SigningStargateClient,
    wallet: any,
    quoteInfo: any,
    memo: string = '',
): Promise<PaymentResult> {
    const { quote } = quoteInfo;
    const denom = 'unil';
    const [account] = await wallet.getAccounts();
    console.log(account);
    const currentAddress = account.address;

    const balance = await nilChainClient.getBalance(currentAddress, denom);

    const paymentResult: PaymentResult = {
        error: null,
        receipt: null,
        tx: null,
    };
    if (balance > quote.cost.total) {
        const payload: MsgPayFor = {
            fromAddress: currentAddress,
            resource: quote.nonce,
            amount: [{ denom, amount: quote.cost.total }],
        };
        try {
            const result = await nilChainClient.signAndBroadcast(
                currentAddress,
                [{ typeUrl, value: payload }],
                'auto',
                memo,
            );
            return {
                ...paymentResult,
                receipt: new PaymentReceipt(quote, result.transactionHash),
                tx: result.transactionHash,
            };
        } catch (error) {
            captureException(error);

            return {
                ...paymentResult,
                error,
            };
        }
    } else {
        return {
            ...paymentResult,
            error: `Account ${currentAddress} has an insufficient balance.`,
        };
    }
}
