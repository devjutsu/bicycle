'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import MapLibre, { Marker, MapRef } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Fullscreen, LocateFixed } from 'lucide-react'
import { useRouter } from 'next/navigation'

type MapProps = {
  fullScreen?: boolean
  rides?: {
    id: string
    start_lat: number
    start_lng: number
    end_lat: number
    end_lng: number
    distance: number
    date: Date
    user_id: string
  }[]
}

export function Map(props: MapProps) {
  const mapRef = useRef<MapRef | null>(null)
  const [location, setLocation] = useState<[number, number]>([24.1066, 56.9498])
  const [mapHeight, setMapHeight] = useState('100vh')
  const router = useRouter()

  useEffect(() => {
    const updateMapHeight = () => {
      setMapHeight(`${window.innerHeight}px`)
    }

    updateMapHeight()
    window.addEventListener('resize', updateMapHeight)

    return () => {
      window.removeEventListener('resize', updateMapHeight)
    }
  }, [])

  const handleMapLoad = () => {
    console.log('Map loaded - requesting location...')
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: location,
        zoom: 17,
        duration: 1000,
      })

      if (!props.fullScreen) {
        const canvas = mapRef.current.getCanvas()
        canvas.style.cursor = 'grab'
      }
    }
    handleLocate() // Locate user when map loads
  }

  const handleLocate = useCallback(() => {
    console.log('handleLocate')
    if (!navigator.geolocation) {
      console.log('Geolocation not supported')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation: [number, number] = [
          position.coords.longitude,
          position.coords.latitude,
        ]
        console.log('Got user location:', userLocation)
        setLocation(userLocation)
        if (mapRef.current) {
          mapRef.current.flyTo({
            center: userLocation,
            zoom: 14,
            duration: 1000,
          })
        }
      },
      (error) => {
        console.error('Error getting location:', error)
      }
    )
  }, [])

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <button
        onClick={handleLocate}
        className="absolute top-2 left-2 z-20 p-2 rounded-full backdrop-blur transition cursor-pointer border border-gray-300 bg-white/80 hover:bg-white"
        aria-label="Locate me"
      >
        <LocateFixed className="w-4 h-4" />
      </button>

      {!props.fullScreen && (
        <button
          onClick={() => router.push('/map')}
          className="absolute top-2 right-2 z-20 p-2 rounded-full backdrop-blur transition cursor-pointer border border-gray-300 bg-white/80 hover:bg-white"
          aria-label="Open full screen map"
        >
          <Fullscreen className="w-4 h-4" />
        </button>
      )}

      <MapLibre
        ref={(instance: MapRef | null) => {
          if (instance) mapRef.current = instance
        }}
        style={{
          width: '100%',
          height: mapHeight,
          minWidth: '300px',
          minHeight: '300px',
          borderRadius: props.fullScreen ? '0' : '10px',
        }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        attributionControl={false}
        onLoad={handleMapLoad}
      >
        <Marker longitude={location[0]} latitude={location[1]} />
        {props.rides?.map((ride) => (
          <div key={ride.id}>
            <Marker longitude={ride.start_lng} latitude={ride.start_lat} color="red" />
            <Marker longitude={ride.end_lng} latitude={ride.end_lat} color="green" />
          </div>
        ))}
      </MapLibre>
    </div>
  )
} 