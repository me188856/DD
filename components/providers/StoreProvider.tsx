"use client"

import { createContext, useContext, useRef, type ReactNode } from 'react'
import { useStore } from 'zustand'
import { createWorkStore, type WorkStore } from '@/stores/workStore'

const StoreContext = createContext<WorkStore | null>(null)

export interface StoreProviderProps {
  children: ReactNode
}

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const storeRef = useRef<WorkStore>()
  
  if (!storeRef.current) {
    storeRef.current = createWorkStore()
  }

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  )
}

export const useWorkStore = <T,>(selector: (store: WorkStore) => T): T => {
  const storeContext = useContext(StoreContext)

  if (!storeContext) {
    throw new Error('useWorkStore must be used within StoreProvider')
  }

  return useStore(storeContext, selector)
}