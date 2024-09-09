export const factoryABI = [
    {
        inputs: [{ internalType: 'address', name: '_owner', type: 'address' }],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    { inputs: [], name: 'Create2EmptyBytecode', type: 'error' },
    { inputs: [], name: 'Create2FailedDeployment', type: 'error' },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'user',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
    },
    {
        inputs: [
            { internalType: 'bytes32', name: 'salt', type: 'bytes32' },
            {
                internalType: 'bytes32',
                name: 'creationCodeHash',
                type: 'bytes32',
            },
            {
                internalType: 'address',
                name: 'deployerAddress',
                type: 'address',
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
            { internalType: 'address', name: 'owner', type: 'address' },
            { internalType: 'address', name: 'solver', type: 'address' },
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
            { internalType: 'address', name: 'solver', type: 'address' },
        ],
        name: 'deployOrderWallet',
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
    {
        inputs: [
            { internalType: 'bytes32', name: 'salt', type: 'bytes32' },
            { internalType: 'address', name: 'asset', type: 'address' },
        ],
        name: 'forceWithdraw',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'bytes32', name: 'saltA', type: 'bytes32' },
            { internalType: 'address', name: 'ownerA', type: 'address' },
            { internalType: 'bytes32', name: 'saltB', type: 'bytes32' },
            { internalType: 'address', name: 'ownerB', type: 'address' },
        ],
        name: 'getWallets',
        outputs: [
            { internalType: 'address', name: 'owA', type: 'address' },
            { internalType: 'address', name: 'owB', type: 'address' },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: '_addr', type: 'address' }],
        name: 'isContract',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'bytes32', name: 'saltA', type: 'bytes32' },
            { internalType: 'address', name: 'ownerA', type: 'address' },
            { internalType: 'bytes32', name: 'saltB', type: 'bytes32' },
            { internalType: 'address', name: 'ownerB', type: 'address' },
            { internalType: 'address', name: 'assetA', type: 'address' },
            { internalType: 'uint256', name: 'amountA', type: 'uint256' },
            { internalType: 'address', name: 'assetB', type: 'address' },
            { internalType: 'uint256', name: 'amountB', type: 'uint256' },
        ],
        name: 'solveForEOAs',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'bytes32', name: 'saltA', type: 'bytes32' },
            { internalType: 'address', name: 'ownerA', type: 'address' },
            { internalType: 'bytes32', name: 'saltB', type: 'bytes32' },
            { internalType: 'address', name: 'ownerB', type: 'address' },
            { internalType: 'address', name: 'assetA', type: 'address' },
            { internalType: 'uint256', name: 'amountA', type: 'uint256' },
            { internalType: 'address', name: 'assetB', type: 'address' },
            { internalType: 'uint256', name: 'amountB', type: 'uint256' },
        ],
        name: 'solveForOrderWallets',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: 'newOwner', type: 'address' },
        ],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
