export const factoryABI = [
    { inputs: [], name: 'Create2EmptyBytecode', type: 'error' },
    { inputs: [], name: 'Create2FailedDeployment', type: 'error' },
    {
        inputs: [
            { internalType: 'bytes32', name: 'salt', type: 'bytes32' },
            {
                internalType: 'bytes32',
                name: 'creationCodeHash',
                type: 'bytes32',
            },
        ],
        name: 'computeAddress',
        outputs: [{ internalType: 'address', name: 'addr', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'bytes32', name: 'salt', type: 'bytes32' },
            { internalType: 'address', name: 'owner', type: 'address' },
        ],
        name: 'computeOrderWalletAddress',
        outputs: [{ internalType: 'address', name: 'addr', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'bytes32', name: 'salt', type: 'bytes32' },
            { internalType: 'bytes', name: 'creationCode', type: 'bytes' },
        ],
        name: 'deploy',
        outputs: [{ internalType: 'address', name: 'addr', type: 'address' }],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'bytes32', name: 'salt', type: 'bytes32' },
            { internalType: 'address', name: 'owner', type: 'address' },
        ],
        name: 'deployOrderWallet',
        outputs: [{ internalType: 'address', name: 'addr', type: 'address' }],
        stateMutability: 'payable',
        type: 'function',
    },
];
