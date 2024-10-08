import { nillionConfig } from '@/shared/constants/nillion';
import * as nillion from '@nillion/client-web';

export async function getQuote({
    client,
    operation,
}: {
    client: nillion.NillionClient;
    operation: nillion.Operation;
}) {
    return await client.request_price_quote(nillionConfig.clusterId, operation);
}
