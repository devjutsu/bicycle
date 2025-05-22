'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MapSelector } from '@/components/MapSelector'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Calendar } from '@/components/ui/calendar'
import { addDays, startOfDay, format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'

type DateOption = 'today' | 'tomorrow' | 'custom'

export function CreateRideButton() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [distance, setDistance] = useState('20')
  const [date, setDate] = useState(startOfDay(new Date()))
  const [dateOption, setDateOption] = useState<DateOption>('today')
  const [time, setTime] = useState('12:00')
  const [timeMode, setTimeMode] = useState<'now' | 'later'>('now')
  const [startLat, setStartLat] = useState<number>()
  const [startLng, setStartLng] = useState<number>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Helper to get default time: 1 hour from now, rounded to nearest half hour
  function getDefaultTime() {
    const now = new Date()
    now.setMinutes(now.getMinutes() + 60)
    const mins = now.getMinutes()
    if (mins < 15) {
      now.setMinutes(0)
    } else if (mins < 45) {
      now.setMinutes(30)
    } else {
      now.setHours(now.getHours() + 1)
      now.setMinutes(0)
    }
    now.setSeconds(0)
    now.setMilliseconds(0)
    return now.toTimeString().slice(0, 5)
  }

  // Helper to get current time rounded to nearest half hour
  function getNowRoundedTime() {
    const now = new Date()
    const mins = now.getMinutes()
    if (mins < 15) {
      now.setMinutes(0)
    } else if (mins < 45) {
      now.setMinutes(30)
    } else {
      now.setHours(now.getHours() + 1)
      now.setMinutes(0)
    }
    now.setSeconds(0)
    now.setMilliseconds(0)
    return now.toTimeString().slice(0, 5)
  }

  const handleDateOptionChange = (value: DateOption) => {
    setDateOption(value)
    switch (value) {
      case 'today':
        setDate(startOfDay(new Date()))
        break
      case 'tomorrow':
        setDate(startOfDay(addDays(new Date(), 1)))
        break
      // For 'custom', we keep the current date value
    }
  }

  const handleMapSelect = (point: { lat: number; lng: number }) => {
    setStartLat(point.lat)
    setStartLng(point.lng)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!startLat || !startLng) return

    setIsSubmitting(true)
    try {
      // Combine date and time into a single ISO string
      const [hours, minutes] = time.split(':').map(Number)
      const dateWithTime = new Date(date)
      dateWithTime.setHours(hours)
      dateWithTime.setMinutes(minutes)
      dateWithTime.setSeconds(0)
      dateWithTime.setMilliseconds(0)

      const response = await fetch('/api/rides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start_lat: startLat,
          start_lng: startLng,
          distance: parseFloat(distance),
          date: dateWithTime.toISOString()
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create ride')
      }

      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Error creating ride:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setDistance('20')
    setDate(startOfDay(new Date()))
    setDateOption('today')
    setTime(getDefaultTime())
    setTimeMode('now')
    setStartLat(undefined)
    setStartLng(undefined)
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen)
      if (newOpen) {
        setTime(getDefaultTime())
        setTimeMode('now')
      }
      if (!newOpen) handleReset()
    }}>
      <DialogTrigger asChild>
        <Button>Create Ride</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Ride</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between w-full">
              <RadioGroup value={dateOption} onValueChange={(value) => handleDateOptionChange(value as DateOption)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="today" id="today" />
                  <Label htmlFor="today">Today</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tomorrow" id="tomorrow" />
                  <Label htmlFor="tomorrow">Tomorrow</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom">Custom date</Label>
                </div>
              </RadioGroup>
              <div className="flex flex-col items-end ml-4">
                <span className="text-base font-semibold text-gray-800 whitespace-nowrap mb-2">
                  {format(date, 'PPP')}
                </span>
                <div className="w-full flex justify-end gap-2 mb-2">
                  {timeMode === 'now' ? (
                    <>
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={() => {
                          setTimeMode('now')
                          setTime(getNowRoundedTime())
                        }}
                      >
                        Now
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setTimeMode('later')}
                      >
                        Later
                      </Button>
                    </>
                  ) : (
                    <Input
                      type="time"
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      className="w-[120px]"
                      step="1800"
                      placeholder="13:30"
                    />
                  )}
                </div>
              </div>
            </div>
            {dateOption === 'custom' && (
              <div className="mt-2 w-full flex justify-start">
                <Input
                  type="date"
                  value={date.toISOString().slice(0, 10)}
                  onChange={e => setDate(startOfDay(new Date(e.target.value)))}
                  className="w-[180px]"
                />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <MapSelector 
              onSelect={handleMapSelect} 
              selectedLat={startLat} 
              selectedLng={startLng}
            />
            {startLat && startLng && (
              <div className="text-sm text-gray-500">
                Coordinates: {startLat.toFixed(6)}, {startLng.toFixed(6)}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Distance (km)</Label>
            <div className="flex gap-4 items-center">
              <Input
                type="range"
                min="5"
                max="100"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="flex-1"
              />
              <Input
                type="number"
                min="5"
                max="100"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-20"
              />
            </div>
          </div>

          <Button type="submit" disabled={!startLat || !startLng || isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Ride'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 