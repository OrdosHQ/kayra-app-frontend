import axios from 'axios';

const apiUrl = `http://46.101.136.69:8080`;

// {"party_id_1": "12D3KooWJHrXiK2JTCjJxwCCktJPSYsUsz2WHEBSB5iZtqGiZ8Qm", "user_id_1": "3rgqxWd47e171EUwe4RXP9hm45tmoXfuF8fC52S7jcFoQTnU8wPiL7hqWzyV1muak6bEg7iWhudwg4t2pM9XnXcp", "program_id": "3rgqxWd47e171EUwe4RXP9hm45tmoXfuF8fC52S7jcFoQTnU8wPiL7hqWzyV1muak6bEg7iWhudwg4t2pM9XnXcp/midpoint_darkpool"}

export const fetchBackendParameters = async () => {
    return await axios
        .get<{
            party_id_1: string;
            user_id_1: string;
            program_id: string;
        }>(`${apiUrl}/program`)
        .then((res) => res.data);
};

// curl POST -H "Content-Type: application/json" localhost:8080/order -d '{"party_name":"Party2", "party_id": "12D3KooWNHNG5akLrVB1u6CDEjGdugthQunJkg59cxZNQ1qKyTdF", "store_id":"efccd162-cdbd-4b70-8313-10f83f889f75"}'

export const fetchBackendCompute = ({ store_id, party_id }: any) => {
    return axios.post(`${apiUrl}/order`, {
        store_id,
        party_id,
        party_name: 'Party2',
    });
};
