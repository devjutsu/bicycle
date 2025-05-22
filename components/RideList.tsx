'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Ride } from '@/lib/db/schema'

export function RideList() {
  const [rides, setRides] = useState<Ride[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [joiningRideId, setJoiningRideId] = useState<number | null>(null)

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

  useEffect(() => {
    fetchRides()
  }, [])

  const handleJoinRide = async (rideId: number) => {
    try {
      setJoiningRideId(rideId)
      const response = await fetch(`/api/rides/${rideId}/join`, {
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to join ride')
      }

      // Refresh the rides list to show updated participant count
      await fetchRides()
    } catch (error) {
      console.error('Error joining ride:', error)
      alert(error instanceof Error ? error.message : 'Failed to join ride')
    } finally {
      setJoiningRideId(null)
    }
  }

  const getMapUrl = (lat: string, lng: string) => {
    return `https://www.google.com/maps?q=${lat},${lng}`
  }

  if (isLoading) {
    return <div className="animate-pulse">Loading recent rides...</div>
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
      <h2 className="text-lg font-semibold">Recent Rides</h2>
      {rides.map((ride) => (
        <Card key={ride.id} className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{ride.startDistance}km - {ride.endDistance}km</h3>
              <p className="text-sm text-gray-500">Created by {ride.creator}</p>
              <p className="text-sm text-gray-500">
                Starting point:{' '}
                <a
                  href={getMapUrl(ride.startLat.toString(), ride.startLng.toString())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {ride.startLat}, {ride.startLng}
                </a>
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-sm text-gray-500">
                {new Date(ride.startTime).toLocaleString()}
              </div>
              <Button
                onClick={() => handleJoinRide(ride.id)}
                disabled={joiningRideId === ride.id}
                className="bg-green-600 hover:bg-green-700"
              >
                {joiningRideId === ride.id ? 'Joining...' : 'Join Ride'}
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
} 