import React from 'react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">Loading Installation Schedule...</p>
        <p className="text-gray-500 text-sm mt-2">Please wait while we prepare your data</p>
      </div>
    </div>
  )
}