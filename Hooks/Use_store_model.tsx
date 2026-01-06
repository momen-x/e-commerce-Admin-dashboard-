import { create } from "zustand";
interface IUseStoreModelProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}
// const Use_store_model =
export const useStoreModel = create<IUseStoreModelProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
