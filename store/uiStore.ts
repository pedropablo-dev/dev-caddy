import { create } from "zustand"
import { persist, createJSONStorage } from 'zustand/middleware'

interface UIState {
  isSidebarCollapsed: boolean
  toggleSidebar: () => void
}

export const useUIStore = create(
  persist<UIState>(
    (set) => ({
      isSidebarCollapsed: false,
      toggleSidebar: () =>
        set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
    }),
    {
      name: 'dev-caddy-ui-state', // Nombre único para el almacenamiento
      storage: createJSONStorage(() => localStorage), // Usar localStorage
    }
  )
)