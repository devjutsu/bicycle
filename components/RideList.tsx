'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import type { Ride } from '@/lib/db/schema'

export function RideList() {
  const [rides, setRides] = useState<Ride[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRides = async () => {
      try {
        console.log('Fetching rides...')
        const response = await fetch('/api/rides')
        console.log('Response status:', response.status)
        
        const data = await response.json()
        console.log('Response data:', data)
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch rides')
        }
        
        setRides(data)
        setError(null)
      } catch (error) {
        console.error('Error fetching rides:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch rides')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRides()
  }, [])

  if (isLoading) {
    return <div className="animate-pulse">Loading rides...</div>
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 border border-red-200 rounded-md bg-red-50">
        <p className="font-semibold">Error loading rides:</p>
        <p>{error}</p>
      </div>
    )
  }

  if (rides.length === 0) {
    return (
      <div className="text-gray-500 p-4 border border-gray-200 rounded-md bg-gray-50">
        No rides available
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {rides.map((ride) => (
        <Card key={ride.id} className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{ride.distance}km</h3>
              <p className="text-sm text-gray-500">Created by {ride.creator}</p>
              <p className="text-sm text-gray-500">
                Starting point: {ride.startLat}, {ride.startLng}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {new Date(ride.startTime).toLocaleString()}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
} 