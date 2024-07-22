export const shortAddress = (address?: string | null) => {
    if (!address) {
        return null;
    }

    return `${address.slice(0, 5)}...${address.slice(-5)}`;
};
