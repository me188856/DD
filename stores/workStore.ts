import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WorkStoreState {
  // Schedule state
  selectedLocation: string
  viewMode: 'grid' | 'calendar'
  currentWeek: number
  searchQuery: string
  scheduleStartDate: Date
  
  // UI state
  showFilters: boolean
  selectedTasks: Set<string>
  expandedTask: number | null
  
  // Actions
  setSelectedLocation: (location: string) => void
  setViewMode: (mode: 'grid' | 'calendar') => void
  setCurrentWeek: (week: number) => void
  setSearchQuery: (query: string) => void
  setScheduleStartDate: (date: Date) => void
  setShowFilters: (show: boolean) => void
  setSelectedTasks: (tasks: Set<string>) => void
  setExpandedTask: (taskId: number | null) => void
  
  // Reset functions
  resetFilters: () => void
  resetSelection: () => void
}

export const useWorkStore = create<WorkStoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      selectedLocation: 'all',
      viewMode: 'calendar',
      currentWeek: 0,
      searchQuery: '',
      scheduleStartDate: new Date(),
      showFilters: false,
      selectedTasks: new Set(),
      expandedTask: null,
      
      // Actions
      setSelectedLocation: (location) => set({ selectedLocation: location }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setCurrentWeek: (week) => set({ currentWeek: week }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setScheduleStartDate: (date) => set({ scheduleStartDate: date }),
      setShowFilters: (show) => set({ showFilters: show }),
      setSelectedTasks: (tasks) => set({ selectedTasks: tasks }),
      setExpandedTask: (taskId) => set({ expandedTask: taskId }),
      
      // Reset functions
      resetFilters: () => set({
        selectedLocation: 'all',
        searchQuery: '',
        showFilters: false,
      }),
      resetSelection: () => set({
        selectedTasks: new Set(),
        expandedTask: null,
      }),
    }),
    {
      name: 'work-store',
      // Only persist certain fields
      partialize: (state) => ({
        selectedLocation: state.selectedLocation,
        viewMode: state.viewMode,
        scheduleStartDate: state.scheduleStartDate,
      }),
      // Handle Set serialization
      serialize: (state) => {
        return JSON.stringify({
          ...state,
          selectedTasks: Array.from(state.selectedTasks),
        })
      },
      deserialize: (str) => {
        const parsed = JSON.parse(str)
        return {
          ...parsed,
          selectedTasks: new Set(parsed.selectedTasks || []),
        }
      },
    }
  )
)

// Selector hooks for better performance
export const useSelectedLocation = () => useWorkStore((state) => state.selectedLocation)
export const useViewMode = () => useWorkStore((state) => state.viewMode)
export const useCurrentWeek = () => useWorkStore((state) => state.currentWeek)
export const useSearchQuery = () => useWorkStore((state) => state.searchQuery)
export const useScheduleStartDate = () => useWorkStore((state) => state.scheduleStartDate)