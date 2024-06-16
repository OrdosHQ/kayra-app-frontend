import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface IShowModalPayload {
    modalState: any;
    modalType: string;
}
interface ModalState {
    modalType: null | string;
    state: any;
    showModal: (modalState: IShowModalPayload) => void;
    closeModal: () => void;
    updateModalState: (payload: any) => void;
}

export const useModalStore = create<ModalState>()(
    devtools(
        immer((set) => ({
            state: {},
            modalType: null,
            showModal: (payload) =>
                set((state) => {
                    state.state = payload.modalState;
                    state.modalType = payload.modalType;
                }),
            closeModal: () =>
                set((state) => {
                    state.modalType = null;
                }),
            updateModalState: (payload) =>
                set((state) => {
                    state.state = {
                        ...state.state,
                        ...payload,
                    };
                }),
        })),
    ),
);
