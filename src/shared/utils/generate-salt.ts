export const generateSalt = () => {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    const newSalt = Array.from(array)
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');

    return `0x${newSalt}`;
};
