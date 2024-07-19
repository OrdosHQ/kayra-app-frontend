import axios from 'axios';

const apiUrl = `https://app.aphotic.ai`;

export const fetchExecutorId = async () => {
    return await axios
        .get<{
            user_id: string;
        }>(`${apiUrl}/executor`)
        .then((res) => res.data.user_id);
};

export const fetchBackendParameters = async () => {
    return await axios
        .get<{
            party_id_1: string;
            user_id_1: string;
            program_id: string;
        }>(`${apiUrl}/program`)
        .then((res) => res.data);
};

export const fetchBackendCompute = ({
    store_id,
    party_id,
    executor_id,
}: any) => {
    return axios
        .post<{
            matching_result: {
                amount_out: number;
                address: number;
                amount_in: number;
                salt: number;
                asset: number;
            };
            settlement_result: {
                tx_hash: `0x${string}`;
                status: string;
            };
        }>(`${apiUrl}/order`, {
            store_id,
            party_id,
            executor_id,
        })
        .then((res) => res.data);
};
