"use client"
import type React from "react"
import { useState, useMemo, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format, addDays, differenceInDays } from "date-fns"
import {
  Calendar as CalendarIconLucide,
  Clock,
  MapPin,
  Fuel,
  CheckCircle,
  AlertCircle,
  Play,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  CalendarDays,
  Search,
  Plus,
  Users,
  Truck,
  Download,
  RefreshCw,
  Utensils,
  CalendarIcon,
  Settings,
} from "lucide-react"

interface InstallationTask {
  day: number
  vehicleNo: number | null
  vehicleType: string
  location: string
  timeSlot: string
  fuelTanks: number
  progress: number
  status: "completed" | "in-progress" | "pending" | "travel" | "lunch"
  team?: string
  equipment?: string
  actualDate?: Date
}

interface TaskModalProps {
  task: InstallationTask | null
  isOpen: boolean
  onClose: () => void
}

const INSTALLATION_DATA: InstallationTask[] = [
  // Bahir Dar - Days 1-8
  {
    day: 1,
    vehicleNo: 1,
    vehicleType: "FORD/D/P/UP RANGER",
    location: "Bahir Dar",
    timeSlot: "8:30 AM - 11:30 AM",
    fuelTanks: 1,
    progress: 100,
    status: "completed",
    team: "Team Alpha",
    equipment: "GPS + Fuel Sensor",
  },
  {
    day: 1,
    vehicleNo: null,
    vehicleType: "",
    location: "Bahir Dar",
    timeSlot: "11:30 AM - 1:30 PM",
    fuelTanks: 0,
    progress: 0,
    status: "lunch",
    team: "Team Alpha",
    equipment: "Lunch Break",
  },
  {
    day: 1,
    vehicleNo: 2,
    vehicleType: "FORD/D/P/UP RANGER",
    location: "Bahir Dar",
    timeSlot: "1:30 PM - 5:30 PM",
    fuelTanks: 1,
    progress: 100,
    status: "completed",
    team: "Team Alpha",
    equipment: "GPS + Fuel Sensor",
  },
  {
    day: 2,
    vehicleNo: 3,
    vehicleType: "FORD/D/P/UP RANGER",
    location: "Bahir Dar",
    timeSlot: "8:30 AM - 11:30 AM",
    fuelTanks: 1,
    progress: 100,
    status: "completed",
    team: "Team Alpha",
    equipment: "GPS + Fuel Sensor",
  },
  {
    day: 2,
    vehicleNo: null,
    vehicleType: "",
    location: "Bahir Dar",
    timeSlot: "11:30 AM - 1:30 PM",
    fuelTanks: 0,
    progress: 0,
    status: "lunch",
    team: "Team Alpha",
    equipment: "Lunch Break",
  },
  {
    day: 2,
    vehicleNo: 4,
    vehicleType: "FORD/D/P/UP RANGER",
    location: "Bahir Dar",
    timeSlot: "1:30 PM - 5:30 PM",
    fuelTanks: 1,
    progress: 100,
    status: "completed",
    team: "Team Alpha",
    equipment: "GPS + Fuel Sensor",
  },
  {
    day: 3,
    vehicleNo: 5,
    vehicleType: "MAZDA/PICKUP W9AT",
    location: "Bahir Dar",
    timeSlot: "8:30 AM - 11:30 AM",
    fuelTanks: 1,
    progress: 85,
    status: "in-progress",
    team: "Team Alpha",
    equipment: "GPS + Fuel Sensor",
  },
  {
    day: 3,
    vehicleNo: null,
    vehicleType: "",
    location: "Bahir Dar",
    timeSlot: "11:30 AM - 1:30 PM",
    fuelTanks: 0,
    progress: 0,
    status: "lunch",
    team: "Team Alpha",
    equipment: "Lunch Break",
  },
  {
    day: 3,
    vehicleNo: 6,
    vehicleType: "Mercedes bus MCV260",
    location: "Bahir Dar",
    timeSlot: "1:30 PM - 5:30 PM",
    fuelTanks: 1,
    progress: 75,
    status: "in-progress",
    team: "Team Alpha",
    equipment: "GPS + Fuel Sensor",
  },
  {
    day: 4,
    vehicleNo: 7,
    vehicleType: "Toyota land cruiser",
    location: "Bahir Dar",
    timeSlot: "8:30 AM - 11:30 AM",
    fuelTanks: 1,
    progress: 60,
    status: "in-progress",
    team: "Team Alpha",
    equipment: "GPS + Fuel Sensor",
  },
  {
    day: 4,
    vehicleNo: null,
    vehicleType: "",
    location: "Bahir Dar",
    timeSlot: "11:30 AM - 1:30 PM",
    fuelTanks: 0,
    progress: 0,
    status: "lunch",
    team: "Team Alpha",
    equipment: "Lunch Break",
  },
  {
    day: 4,
    vehicleNo: 8,
    vehicleType: "MAZDA/PICKUP W9AT",
    location: "Bahir Dar",
    timeSlot: "1:30 PM - 5:30 PM",
    fuelTanks: 1,
    progress: 45,
    status: "pending",
    team: "Team Alpha",
    equipment: "GPS + Fuel Sensor",
  },
  {
    day: 5,
    vehicleNo: 9,
    vehicleType: "Mercedes bus MCV260",
    location: "Bahir Dar",
    timeSlot: "8:30 AM - 11:30 AM",
    fuelTanks: 1,
    progress: 30,
    status: "pending",
    team: "Team Alpha",
    equipment: "GPS + Fuel Sensor",
  },
  {
    day: 5,
    vehicleNo: null,
    vehicleType: "",
    location: "Bahir Dar",
    timeSlot: "11:30 AM - 1:30 PM",
    fuelTanks: 0,
    progress: 0,
    status: "lunch",
    team: "Team Alpha",
    equipment: "Lunch Break",
  },
  {
    day: 5,
    vehicleNo: 10,
    vehicleType: "UD truck CV86BLLDL",
    location: "Bahir Dar",
    timeSlot: "1:30 PM - 5:30 PM",
    fuelTanks: 2,
    progress: 20,
    status: "pending",
    team: "Team Alpha",
    equipment: "GPS + Fuel Sensor",
  },
  {
    day: 6,
    vehicleNo: 11,
    vehicleType: "Mitsubishi K777JENSU",
    location: "Bahir Dar",
    timeSlot: "8:30 AM - 11:30 AM",
    fuelTanks: 1,
    progress: 15,
    status: "pending",
    team: "Team Alpha",
    equipment: "GPS + Fuel Sensor",
  },
  {
    day: 6,
    vehicleNo: null,
    vehicleType: "",
    location: "Bahir Dar",
    timeSlot: "11:30 AM - 1:30 PM",
    fuelTanks: 0,
    progress: 0,
    status: "lunch",
    team: "Team Alpha",
    equipment: "Lunch Break",
  },
  {
    day: 6,
    vehicleNo: 12,
    vehicleType: "Terios j120cg",
    location: "Bahir Dar",
    timeSlot: "1:30 PM - 5:30 PM",
    fuelTanks: 1,
    progress: 10,
    status: "pending",
    team: "Team Alpha",
    equipment: "GPS + Fuel Sensor",
  },
  {
    day: 7,
    vehicleNo: 13,
    vehicleType: "MAZDA/PICKUP BT-50",
    location: "Bahir Dar",
    timeSlot: "8:30 AM - 11:30 AM",
    fuelTanks: 1,
    progress: 5,
    status: "pending",
    team: "Team Alpha",
    equipment: "GPS + Fuel Sensor",
  },
  {
    day: 7,
    vehicleNo: null,
    vehicleType: "",
    location: "Bahir Dar",
    timeSlot: "11:30 AM - 1:30 PM",
    fuelTanks: 0,
    progress: 0,
    status: "lunch",
    team: "Team Alpha",
    equipment: "Lunch Break",
  },
  {
    day: 7,
    vehicleNo: 14,
    vehicleType: "mitsubishi (k777jensl)",
    location: "Bahir Dar",
    timeSlot: "1:30 PM - 5:30 PM",
    fuelTanks: 1,
    progress: 0,
    status: "pending",
    team: "Team Alpha",
    equipment: "GPS + Fuel Sensor",
  },
  {
    day: 8,
    vehicleNo: 15,
    vehicleType: "Cherry c7180elkkhb0018",
    location: "Bahir Dar",
    timeSlot: "8:30 AM - 11:30 AM",
    fuelTanks: 1,
    progress: 0,
    status: "pending",
    team: "Team Alpha",
    equipment: "GPS + Fuel Sensor",
  },
  {
    day: 8,
    vehicleNo: null,
    vehicleType: "",
    location: "Bahir Dar",
    timeSlot: "11:30 AM - 1:30 PM",
    fuelTanks: 0,
    progress: 0,
    status: "lunch",
    team: "Team Alpha",
    equipment: "Lunch Break",
  },

  // Day 9 - Travel/logistics day
  {
    day: 9,
    vehicleNo: null,
    vehicleType: "",
    location: "Travel",
    timeSlot: "Travel/logistics day",
    fuelTanks: 0,
    progress: 0,
    status: "travel",
    team: "Team Alpha",
    equipment: "Travel Day",
  },

  // Kombolcha - Days 10-12
  {
    day: 10,
    vehicleNo: 16,
    vehicleType: "FORD/D/P/UP RANGER",
    location: "Kombolcha",
    timeSlot: "8:30 AM - 11:30 AM",
    fuelTanks: 1,
    progress: 0,
    status: "pending",
    team: "Team Beta",
    equipment: "GPS + Fuel Sensor",
  },
  {
    day: 10,
    vehicleNo: null,
    vehicleType: "",
    location: "Kombolcha",
    timeSlot: "11:30 AM - 1:30 PM",
    fuelTanks: 0,
    progress: 0,
    status: "lunch",
    team: "Team Beta",
    equipment: "Lunch Break",
  },
  {
    day: 10,
    vehicleNo: 17,
    vehicleType: "MAZDA/R/D/UP BT-50",
    location: "Kombolcha",
    timeSlot: "1:30 PM - 5:30 PM",
    fuelTanks: 1,
    progress: 0,
    status: "pending",
    team: "Team Beta",
    equipment: "GPS + Fuel Sensor",
  },
  {
    day: 11,
    vehicleNo: 18,
    vehicleType: "Mercedes bus MCV5115",
    location: "Kombolcha",
    timeSlot: "8:30 AM - 11:30 AM",
    fuelTanks: 1,
    progress: 0,
    status: "pending",
    team: "Team Beta",
    equipment: "GPS + Fuel Sensor",
  },
  {
    day: 11,
    vehicleNo: null,
    vehicleType: "",
    location: "Kombolcha",
    timeSlot: "11:30 AM - 1:30 PM",
    fuelTanks: 0,
    progress: 0,
    status: "lunch",
    team: "Team Beta",
    equipment: "Lunch Break",
  },
  {
    day: 11,
    vehicleNo: 19,
    vehicleType: "Toyota Pickup LN166L-PRMDS",
    location: "Kombolcha",
    timeSlot: "1:30 PM - 5:30 PM",
    fuelTanks: 1,
    progress: 0,
    status: "pending",
    team: "Team Beta",
    equipment: "GPS + Fuel Sensor",
  },
  {
    day: 12,
    vehicleNo: 20,
    vehicleType: "Mitsubishi K34)JUNJJC",
    location: "Kombolcha",
    timeSlot: "8:30 AM - 11:30 AM",
    fuelTanks: 1,
    progress: 0,
    status: "pending",
    team: "Team Beta",
    equipment: "GPS + Fuel Sensor",
  },
  {
    day: 12,
    vehicleNo: null,
    vehicleType: "",
    location: "Kombolcha",
    timeSlot: "11:30 AM - 1:30 PM",
    fuelTanks: 0,
    progress: 0,
    status: "lunch",
    team: "Team Beta",
    equipment: "Lunch Break",
  },
  {
    day: 12,
    vehicleNo: 21,
    vehicleType: "UD truck CV86BLLDL",
    location: "Kombolcha",
    timeSlot: "1:30 PM - 5:30 PM",
    fuelTanks: 2,
    progress: 0,
    status: "pending",
    team: "Team Beta",
    equipment: "GPS + Fuel Sensor",
  },

  // Addis Ababa - Days 13-14
  {
    day: 13,
    vehicleNo: 22,
    vehicleType: "FORD/D/P/UP RANGER",
    location: "Addis Ababa",
    timeSlot: "8:30 AM - 11:30 AM",
    fuelTanks: 1,
    progress: 0,
    status: "pending",
    team: "Team Gamma",
    equipment: "GPS + Fuel Sensor",
  },
  {
    day: 13,
    vehicleNo: null,
    vehicleType: "",
    location: "Addis Ababa",
    timeSlot: "11:30 AM - 1:30 PM",
    fuelTanks: 0,
    progress: 0,
    status: "lunch",
    team: "Team Gamma",
    equipment: "Lunch Break",
  },
  {
    day: 13,
    vehicleNo: 23,
    vehicleType: "MAZDA/PICKUP-626",
    location: "Addis Ababa",
    timeSlot: "1:30 PM - 5:30 PM",
    fuelTanks: 1,
    progress: 0,
    status: "pending",
    team: "Team Gamma",
    equipment: "GPS + Fuel Sensor",
  },
  {
    day: 14,
    vehicleNo: 24,
    vehicleType: "Cherry c7180elkkhb0018",
    location: "Addis Ababa",
    timeSlot: "8:30 AM - 11:30 AM",
    fuelTanks: 1,
    progress: 0,
    status: "pending",
    team: "Team Gamma",
    equipment: "GPS + Fuel Sensor",
  },
  {
    day: 14,
    vehicleNo: null,
    vehicleType: "",
    location: "Addis Ababa",
    timeSlot: "11:30 AM - 1:30 PM",
    fuelTanks: 0,
    progress: 0,
    status: "lunch",
    team: "Team Gamma",
    equipment: "Lunch Break",
  },
]

const getStatusColor = (status: InstallationTask["status"]): string => {
  const statusColors = {
    completed: "bg-green-500",
    "in-progress": "bg-yellow-500",
    pending: "bg-gray-400",
    travel: "bg-blue-500",
    lunch: "bg-orange-500",
  } as const
  return statusColors[status]
}

const getStatusIcon = (status: InstallationTask["status"]): React.ReactNode => {
  const statusIcons = {
    completed: <CheckCircle className="h-4 w-4" aria-label="Completed" />,
    "in-progress": <Play className="h-4 w-4" aria-label="In Progress" />,
    pending: <AlertCircle className="h-4 w-4" aria-label="Pending" />,
    travel: <MapPin className="h-4 w-4" aria-label="Travel Day" />,
    lunch: <Utensils className="h-4 w-4" aria-label="Lunch Break" />,
  } as const
  return statusIcons[status]
}

const TaskModal: React.FC<TaskModalProps> = ({ task, isOpen, onClose }) => {
  if (!task) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
              {getStatusIcon(task.status)}
              {task.vehicleNo ? `Vehicle #${task.vehicleNo} Installation` : "Travel Day"}
            </DialogTitle>
            <Badge variant="outline" className="text-xs px-2 py-1">
              Day {task.day}
              {task.actualDate && (
                <span className="ml-2 text-muted-foreground">
                  {format(task.actualDate, "MMM dd")}
                </span>
              )}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Schedule</h4>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span>Day {task.day}</span>
                  {task.actualDate && (
                    <span className="text-muted-foreground">
                      ({format(task.actualDate, "MMM dd, yyyy")})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm mt-1">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span>{task.timeSlot}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Location</h4>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <span>{task.location}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Team</h4>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-purple-600" />
                  <span>{task.team}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Equipment</h4>
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4 text-orange-600" />
                  <span>{task.equipment}</span>
                </div>
              </div>
            </div>
          </div>

          {task.vehicleNo && (
            <>
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Vehicle Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Vehicle Type</p>
                    <p className="text-sm font-medium">{task.vehicleType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Fuel Tanks</p>
                    <p className="text-sm font-medium">
                      {task.fuelTanks} tank{task.fuelTanks > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-medium text-gray-900">Installation Progress</h4>
                  <span className="text-sm font-semibold">{task.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>

                <div className="flex gap-2">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      task.progress >= 25 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    GPS Setup
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      task.progress >= 50 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    Fuel Sensor
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      task.progress >= 75 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    Testing
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      task.progress >= 100 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    Complete
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function InstallationSchedule() {
  const [selectedTask, setSelectedTask] = useState<InstallationTask | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string>("all")
  const [currentWeek, setCurrentWeek] = useState<number>(0)
  const [viewMode, setViewMode] = useState<"grid" | "calendar">("calendar")
  const [expandedTask, setExpandedTask] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [draggedTask, setDraggedTask] = useState<InstallationTask | null>(null)
  const [hoveredDay, setHoveredDay] = useState<number | null>(null)
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set())
  const [showTaskDetails, setShowTaskDetails] = useState<boolean>(false)
  const [scheduleStartDate, setScheduleStartDate] = useState<Date>(new Date())
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false)

  const locations = ["all", "Bahir Dar", "Kombolcha", "Addis Ababa", "Travel"] as const

  // Calculate actual dates for tasks based on schedule start date
  const tasksWithDates = useMemo(() => {
    return INSTALLATION_DATA.map(task => ({
      ...task,
      actualDate: addDays(scheduleStartDate, task.day - 1)
    }))
  }, [scheduleStartDate])
  const filteredData = useMemo(() => {
    return tasksWithDates.filter((task) => {
      const matchesLocation = selectedLocation === "all" || task.location === selectedLocation
      const matchesSearch =
        searchQuery === "" ||
        task.vehicleType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.vehicleNo && task.vehicleNo.toString().includes(searchQuery))
      return matchesLocation && matchesSearch
    })
  }, [selectedLocation, searchQuery, tasksWithDates])

  const weekDays = useMemo(() => {
    const startDay = currentWeek * 7 + 1
    return Array.from({ length: 7 }, (_, i) => startDay + i).filter((day) => day <= 14)
  }, [currentWeek])

  const totalWeeks = Math.ceil(14 / 7)

  const handleDateSelect = useCallback((date: Date | undefined) => {
    if (date) {
      setScheduleStartDate(date)
      setIsDatePickerOpen(false)
    }
  }, [])
  const handleTaskClick = useCallback((task: InstallationTask, event: React.MouseEvent) => {
    event.stopPropagation()
    if (event.ctrlKey || event.metaKey) {
      const taskId = `${task.day}-${task.vehicleNo}`
      setSelectedTasks((prev) => {
        const newSelected = new Set(prev)
        if (newSelected.has(taskId)) {
          newSelected.delete(taskId)
        } else {
          newSelected.add(taskId)
        }
        return newSelected
      })
    } else {
      setSelectedTask(task)
      setShowTaskDetails(true)
    }
  }, [])

  const handleTaskDoubleClick = useCallback((task: InstallationTask) => {
    setExpandedTask((prev) => (prev === task.vehicleNo ? null : task.vehicleNo))
  }, [])

  const handleDragStart = useCallback((task: InstallationTask, event: React.DragEvent) => {
    setDraggedTask(task)
    event.dataTransfer.effectAllowed = "move"
  }, [])

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const handleDrop = useCallback(
    (targetDay: number, event: React.DragEvent) => {
      event.preventDefault()
      if (draggedTask && draggedTask.day !== targetDay) {
        // Here you would update the task's day in your data
        console.log(`Moving task from day ${draggedTask.day} to day ${targetDay}`)
      }
      setDraggedTask(null)
    },
    [draggedTask],
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showTaskDetails) {
        setShowTaskDetails(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [showTaskDetails])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex transition-all duration-300">
      <div className="w-80 bg-white/95 backdrop-blur-sm border-r border-gray-200/50 flex flex-col shadow-lg">
        {/* Header */}
        <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">GPS Installation</h1>
              <p className="text-sm text-gray-500">Schedule Manager</p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search vehicles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              aria-label="Search vehicles"
            />
          </div>
        </div>

        {/* Schedule Start Date Picker */}
        <div className="p-4 border-b border-gray-200/50 bg-gradient-to-r from-green-50 to-emerald-50">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Settings className="h-4 w-4 text-green-600" />
            Schedule Configuration
          </h3>
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">Start Date</label>
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal transition-all duration-200 hover:bg-green-50 hover:border-green-300"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-green-600" />
                  {format(scheduleStartDate, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={scheduleStartDate}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-gray-500">
              Schedule will run for 14 days starting from selected date
            </p>
          </div>
        </div>
        {/* Mini Calendar */}
        <div className="p-4 border-b border-gray-200/50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">{format(scheduleStartDate, "MMMM yyyy")}</h3>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" aria-label="Previous month" className="hover:bg-blue-50 transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" aria-label="Next month" className="hover:bg-blue-50 transition-colors">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-xs">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div key={day} className="text-center text-gray-500 font-medium p-1">
                {day}
              </div>
            ))}
            {Array.from({ length: new Date(scheduleStartDate.getFullYear(), scheduleStartDate.getMonth() + 1, 0).getDate() }, (_, i) => i + 1).map((day) => {
              const currentDate = new Date(scheduleStartDate.getFullYear(), scheduleStartDate.getMonth(), day)
              const daysDiff = differenceInDays(currentDate, scheduleStartDate)
              const isScheduleDay = daysDiff >= 0 && daysDiff < 14
              
              return (
              <button
                key={day}
                className={`p-1 text-center rounded transition-all duration-200 ${
                  isScheduleDay 
                    ? "text-blue-600 font-medium bg-blue-50 hover:bg-blue-100" 
                    : "text-gray-400 hover:bg-gray-100"
                }`}
                aria-label={`Day ${day}`}
              >
                {day}
              </button>
              )
            })}
          </div>
        </div>

        {/* Schedule Filters */}
        <div className="p-4 border-b border-gray-200/50">
          <h3 className="font-medium text-gray-900 mb-3">My Schedule</h3>
          <div className="space-y-2">
            {[
              { name: "GPS Installation", count: 24, color: "bg-blue-500" },
              { name: "Fuel Sensor Setup", count: 24, color: "bg-green-500" },
              { name: "Lunch Breaks", count: 13, color: "bg-orange-500" },
              { name: "Travel Days", count: 1, color: "bg-purple-500" },
              { name: "Completed", count: 4, color: "bg-gray-500" },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-md transition-colors">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color} shadow-sm`} />
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                <span className="text-xs text-gray-500 font-medium">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Location Categories */}
        <div className="p-4 flex-1">
          <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
          <div className="space-y-1">
            {locations.map((location) => (
              <button
                key={location}
                onClick={() => setSelectedLocation(location)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedLocation === location
                    ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 font-medium shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:shadow-sm"
                }`}
                aria-pressed={selectedLocation === location}
              >
                <div className="flex items-center gap-2">
                  {location === "all" && <Grid3X3 className="h-4 w-4" />}
                  {location === "Bahir Dar" && <MapPin className="h-4 w-4" />}
                  {location === "Kombolcha" && <MapPin className="h-4 w-4" />}
                  {location === "Addis Ababa" && <MapPin className="h-4 w-4" />}
                  {location === "Travel" && <MapPin className="h-4 w-4" />}
                  {location === "all" ? "All Locations" : location}
                  <span className="ml-auto text-xs text-gray-500">
                    {filteredData.filter((task) => location === "all" || task.location === location).length}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Installation Calendar</h2>
              <p className="text-gray-500 mt-1">
                {filteredData.length} total entries • {filteredData.filter((t) => t.status === "completed").length}{" "}
                completed • {filteredData.filter((t) => t.status === "lunch").length} lunch breaks
                <span className="ml-2 text-blue-600 font-medium">
                  Starting {format(scheduleStartDate, "MMM dd, yyyy")}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 shadow-sm">
                <Button
                  variant={viewMode === "calendar" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("calendar")}
                  aria-pressed={viewMode === "calendar"}
                  className="transition-all duration-200"
                >
                  <CalendarDays className="h-4 w-4" />
                  Calendar
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  aria-pressed={viewMode === "grid"}
                  className="transition-all duration-200"
                >
                  <Grid3X3 className="h-4 w-4" />
                  Grid
                </Button>
              </div>

              <Button variant="outline" size="sm" aria-label="Refresh data" className="hover:bg-blue-50 transition-colors">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" aria-label="Download schedule" className="hover:bg-green-50 transition-colors">
                <Download className="h-4 w-4" />
              </Button>
              <Button size="sm" aria-label="Add new installation" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md">
                <Plus className="h-4 w-4 mr-2" />
                Add Installation
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          {viewMode === "calendar" ? (
            <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-gray-200/50 overflow-hidden shadow-lg">
              {/* Calendar Header */}
              <div className="border-b border-gray-200/50 p-4 bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Week {currentWeek + 1} of {totalWeeks}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))}
                      disabled={currentWeek === 0}
                      aria-label="Previous week"
                      className="transition-all duration-200 hover:bg-blue-50 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentWeek(Math.min(totalWeeks - 1, currentWeek + 1))}
                      disabled={currentWeek === totalWeeks - 1}
                      aria-label="Next week"
                      className="transition-all duration-200 hover:bg-blue-50 disabled:opacity-50"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-8 min-h-[600px] bg-gradient-to-br from-white to-gray-50">
                {/* Time Column */}
                <div className="border-r border-gray-200/50 bg-gradient-to-b from-gray-50 to-gray-100">
                  <div className="h-12 border-b border-gray-200/50 flex items-center justify-center text-sm font-medium text-gray-500">
                    Time
                  </div>
                  {["8:30 AM", "11:30 AM", "1:30 PM"].map((time) => (
                    <div
                      key={time}
                      className="h-24 border-b border-gray-100/50 flex items-center justify-center text-xs text-gray-500 font-medium"
                    >
                      {time}
                    </div>
                  ))}
                </div>

                {/* Day Columns */}
                {weekDays.map((dayNum, dayIndex) => {
                  const dayTasks = filteredData.filter((task) => task.day === dayNum)
                  const dayDate = addDays(scheduleStartDate, dayNum - 1)

                  return (
                    <div key={dayNum} className="border-r border-gray-200/50 relative hover:bg-blue-50/30 transition-colors">
                      {/* Day Header */}
                      <div className="h-12 border-b border-gray-200/50 flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-50">
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-900">Day {dayNum}</div>
                          <div className="text-xs text-gray-500">{format(dayDate, "MMM dd")}</div>
                        </div>
                      </div>

                      {/* Time Slots */}
                      <div className="relative">
                        {Array.from({ length: 3 }).map((_, timeIndex) => (
                          <div key={timeIndex} className="h-24 border-b border-gray-100/50" />
                        ))}

                        {/* Tasks */}
                        <div className="absolute inset-0 p-1 space-y-1">
                          {dayTasks.map((task, taskIndex) => {
                            const taskId = `${task.day}-${task.vehicleNo}`
                            const isSelected = selectedTasks.has(taskId)
                            const isExpanded = expandedTask === task.vehicleNo

                            const colors = {
                              completed: "bg-gradient-to-r from-green-100 to-emerald-100 border-green-300 text-green-800 hover:from-green-200 hover:to-emerald-200 shadow-sm",
                              "in-progress": "bg-gradient-to-r from-yellow-100 to-amber-100 border-yellow-300 text-yellow-800 hover:from-yellow-200 hover:to-amber-200 shadow-sm",
                              pending: "bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-300 text-blue-800 hover:from-blue-200 hover:to-indigo-200 shadow-sm",
                              travel: "bg-gradient-to-r from-purple-100 to-violet-100 border-purple-300 text-purple-800 hover:from-purple-200 hover:to-violet-200 shadow-sm",
                              lunch: "bg-gradient-to-r from-orange-100 to-red-100 border-orange-300 text-orange-800 hover:from-orange-200 hover:to-red-200 shadow-sm",
                            }

                            return (
                              <div
                                key={taskIndex}
                                draggable={task.vehicleNo !== null}
                                onDragStart={(e) => handleDragStart(task, e)}
                                className={`p-1.5 rounded-lg border cursor-pointer transition-all duration-300 group ${
                                  colors[task.status]
                                } ${isSelected ? "ring-2 ring-blue-500 scale-105 shadow-lg" : "hover:shadow-lg hover:scale-105"} ${
                                  isExpanded ? "z-10 scale-110 shadow-xl" : ""
                                }`}
                                onClick={(e) => handleTaskClick(task, e)}
                                onDoubleClick={() => handleTaskDoubleClick(task)}
                                role="button"
                                tabIndex={0}
                                aria-label={`${task.vehicleNo ? `Vehicle ${task.vehicleNo}` : task.status === "lunch" ? "Lunch break" : "Travel day"} - ${task.status}`}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    handleTaskClick(task, e as any)
                                  }
                                }}
                              >
                                <div className="flex items-center gap-1 mb-1">
                                  {getStatusIcon(task.status)}
                                  <span className="text-xs font-medium truncate">
                                    {task.vehicleNo
                                      ? `Vehicle #${task.vehicleNo}`
                                      : task.status === "lunch"
                                        ? "Lunch"
                                        : "Travel"}
                                  </span>
                                </div>

                                {task.vehicleNo && (
                                  <>
                                    <div className="text-xs text-gray-600 truncate mb-1">{task.vehicleType}</div>
                                    <div className="flex items-center gap-1 text-xs">
                                      <Fuel className="h-3 w-3" />
                                      <span>{task.fuelTanks}</span>
                                      <div className="ml-auto">
                                        <Progress value={task.progress} className="h-1 w-6 bg-white/50" />
                                      </div>
                                    </div>
                                  </>
                                )}

                                {task.status === "lunch" && (
                                  <div className="text-xs text-gray-600">11:30 AM - 1:30 PM</div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
              {Array.from({ length: 14 }, (_, i) => i + 1).map((day) => {
                const tasks = filteredData.filter((task) => task.day === day)
                if (tasks.length === 0) return null
                const dayDate = addDays(scheduleStartDate, day - 1)

                return (
                  <Card key={day} className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-gray-50 border-gray-200/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between text-lg">
                        <div>
                          <span>Day {day}</span>
                          <div className="text-xs text-gray-500 font-normal">{format(dayDate, "MMM dd, yyyy")}</div>
                        </div>
                        <Badge variant="outline">{tasks[0].location}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {tasks.map((task, index) => (
                        <div
                          key={index}
                          className="cursor-pointer rounded-lg border p-3 transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:scale-105 bg-gradient-to-r from-white to-gray-50"
                          onClick={(e) => handleTaskClick(task, e)}
                          role="button"
                          tabIndex={0}
                          aria-label={`${task.vehicleNo ? `Vehicle ${task.vehicleNo}` : task.status === "lunch" ? "Lunch break" : "Travel day"} installation`}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              handleTaskClick(task, e as any)
                            }
                          }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                {getStatusIcon(task.status)}
                                <span className="text-sm font-medium">
                                  {task.vehicleNo
                                    ? `Vehicle #${task.vehicleNo}`
                                    : task.status === "lunch"
                                      ? "Lunch Break"
                                      : "Travel Day"}
                                </span>
                              </div>

                              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                                <Clock className="h-3 w-3" />
                                {task.timeSlot}
                              </div>

                              {task.vehicleNo && (
                                <>
                                  <p className="text-xs text-muted-foreground truncate mb-2">{task.vehicleType}</p>

                                  <div className="flex items-center gap-2 mb-2">
                                    <Fuel className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-xs">
                                      {task.fuelTanks} tank{task.fuelTanks > 1 ? "s" : ""}
                                    </span>
                                  </div>

                                  <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                      <span>Progress</span>
                                      <span>{task.progress}%</span>
                                    </div>
                                    <Progress value={task.progress} className="h-2 bg-gray-200" />
                                  </div>
                                </>
                              )}
                            </div>

                            <Badge
                              variant="outline"
                              className={`${getStatusColor(task.status)} text-white border-transparent shadow-sm`}
                            >
                              {task.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <TaskModal task={selectedTask} isOpen={showTaskDetails} onClose={() => setShowTaskDetails(false)} />
    </div>
  )
}
