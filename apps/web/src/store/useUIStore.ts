// use thi simple UI states like loading indicators or theme 
import { create } from "zustand";


interface UIState{
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) =>({
    isSidebarOpen: false,
    toggleSidebar: () => set((state) =>({isSidebarOpen: !state.isSidebarOpen})),
}));