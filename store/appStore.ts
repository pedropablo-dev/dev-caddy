import { create } from "zustand"
import { persist, createJSONStorage } from 'zustand/middleware'

interface AppState {
  selectedCategory: string
  adminSelectedCategory: string | null
  setSelectedCategory: (id: string) => void
  setAdminSelectedCategory: (id: string | null) => void
}

export const useAppStore = create(
  persist<AppState>(
    (set) => ({
      selectedCategory: 'favorites',
      adminSelectedCategory: null,
      setSelectedCategory: (id) => set({ selectedCategory: id }),
      setAdminSelectedCategory: (id) => set({ adminSelectedCategory: id }),
    }),
    {
      name: 'dev-caddy-app-state', // Nombre único para el almacenamiento
      storage: createJSONStorage(() => localStorage), // Usar localStorage
    }
  )
)