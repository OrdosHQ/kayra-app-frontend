import { Token } from '@/shared/types';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface Order {
    salt: string;
    timestamp: number;
    token1: Token;
    token2: Token;
    amount1: number | string;
    amount2: number | string;
    storeId: string;
    txHash?: string;
    address: `0x${string}`;
    depositAddress: `0x${string}`;
}

interface OrdersStore {
    orders: Order[];
    addOrder: (orders: Order) => void;
    removeOrder: (salt: string) => void;
}

export const useOrdersStore = create<OrdersStore>()(
    devtools(
        persist(
            immer((set) => ({
                orders: [],
                addOrder: (order) =>
                    set((state) => {
                        state.orders.push(order);
                    }),
                removeOrder: (salt) =>
                    set((state) => {
                        state.orders = state.orders.filter(
                            (order) => order.salt !== salt,
                        );
                    }),
            })),
            {
                name: 'orders',
            },
        ),
    ),
);
