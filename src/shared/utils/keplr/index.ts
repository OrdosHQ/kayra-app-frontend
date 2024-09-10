import { oldConfig } from '@/shared/constants/nillion';
import { Window as KeplrWindow, Keplr } from '@keplr-wallet/types';

declare global {
    interface Window extends KeplrWindow {}
}

export async function getKeplr(): Promise<Keplr | undefined> {
    if (window.keplr) {
        return window.keplr;
    }

    if (document.readyState === 'complete') {
        return window.keplr;
    }

    return new Promise((resolve) => {
        const documentStateChange = (event: Event) => {
            if (
                event.target &&
                (event.target as Document).readyState === 'complete'
            ) {
                resolve(window.keplr);
                document.removeEventListener(
                    'readystatechange',
                    documentStateChange,
                );
            }
        };

        document.addEventListener('readystatechange', documentStateChange);
    });
}

export async function signerViaKeplr(chainId: string, keplr: Keplr) {
    return await keplr
        .experimentalSuggestChain(oldConfig.chain.chainInfo)
        .then(async () => {
            await keplr.enable(oldConfig.chain.chainId);
            const signer = await keplr.getOfflineSigner(
                oldConfig.chain.chainId,
            );
            return signer;
        });
}
