import { TransactionLoader } from '@/entities/transaction-loader';
import { ConnectWalletModal } from '@/features/connect-wallet';
import { SelectToken } from '@/features/select-token';

export const contentFromModalType: Record<string, React.ReactNode | undefined> =
    {
        selectToken: <SelectToken />,
        transactionLoader: <TransactionLoader />,
        connectWallet: <ConnectWalletModal />,
    };
