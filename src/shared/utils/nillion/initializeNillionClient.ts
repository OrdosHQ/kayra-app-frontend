import { config } from '@/shared/constants/nillion';
import * as nillion from '@nillion/client-web';

export const initializeNillionClient = (
    userKey: nillion.UserKey,
): nillion.NillionClient => {
    const nodeKey = nillion.NodeKey.from_seed('');
    return new nillion.NillionClient(userKey, nodeKey, config.bootnodes);
};
