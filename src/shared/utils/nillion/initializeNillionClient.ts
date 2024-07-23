import { config } from '@/shared/constants/nillion';
import * as nillion from '@nillion/client-web';
import { generateSalt } from '../generate-salt';

export const initializeNillionClient = (
    userKey: nillion.UserKey,
): nillion.NillionClient => {
    const seed = generateSalt();
    const nodeKey = nillion.NodeKey.from_seed(seed);
    console.log(nodeKey, 'nodeKey');
    return new nillion.NillionClient(userKey, nodeKey, config.bootnodes);
};
