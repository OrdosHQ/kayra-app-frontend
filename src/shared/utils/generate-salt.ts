export const generateSalt = (): `0x${string}` => {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    const newSalt = Array.from(array)
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
    console.log(newSalt, newSalt.length);
    return `0x${newSalt.padStart(64, '0')}`;
};
