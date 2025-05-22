'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { MapSelector } from './MapSelector'

export function CreateRideButton() {
  const [distance, setDistance] = useState('10')
  const [startLat, setStartLat] = useState('')
  const [startLng, setStartLng] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleCreateRide = async () => {
    if (!distance || isNaN(Number(distance)) || Number(distance) < 10) {
      alert('Please enter a valid distance (minimum 10km)')
      return
    }

    if (!startLat || !startLng) {
      alert('Please select a starting point')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/rides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          distance: Number(distance),
          creator: 'User', // TODO: Replace with actual user name
          startLat,
          startLng,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create ride')
      }

      setIsOpen(false)
      setDistance('10')
      setStartLat('')
      setStartLng('')
      router.refresh()
    } catch (error) {
      console.error('Error creating ride:', error)
      alert(error instanceof Error ? error.message : 'Failed to create ride. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMapSelect = (lat: number, lng: number) => {
    setStartLat(lat.toString())
    setStartLng(lng.toString())
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Create Ride
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Ride</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="distance">Distance (km)</Label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                id="distance"
                min="10"
                max="200"
                step="5"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="flex-1"
                disabled={isLoading}
              />
              <span className="text-sm font-medium min-w-[3rem] text-right">
                {distance}km
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Starting Point</Label>
            <div className="text-sm text-gray-500 mb-2">
              Click on the map to select the starting point
            </div>
            <MapSelector
              onSelect={handleMapSelect}
              selectedLat={startLat}
              selectedLng={startLng}
            />
            {startLat && startLng && (
              <div className="text-sm text-gray-500">
                Selected coordinates: {startLat}, {startLng}
              </div>
            )}
          </div>
          <Button 
            onClick={handleCreateRide} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Ride'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 