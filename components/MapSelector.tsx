'use client'

import { useRef, useState, useCallback } from 'react'
import MapLibre, { Marker, MapRef } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { LocateFixed } from 'lucide-react'

interface MapSelectorProps {
  onSelect: (point: { lat: number; lng: number }) => void
  selectedLat?: number
  selectedLng?: number
}

export function MapSelector({ onSelect, selectedLat, selectedLng }: MapSelectorProps) {
  const mapRef = useRef<MapRef | null>(null)
  const [location, setLocation] = useState<[number, number]>([24.1066, 56.9498])

  const handleMapLoad = () => {
    console.log('MapSelector loaded - requesting location...')
    handleLocate() // Locate user when map loads
  }

  const handleLocate = useCallback(() => {
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
        // Select the located point
        onSelect({ lat: position.coords.latitude, lng: position.coords.longitude })
      },
      (error) => {
        console.error('Error getting location:', error)
      }
    )
  }, [onSelect])

  const handleMapClick = (e: any) => {
    const { lng, lat } = e.lngLat
    console.log('Map clicked:', { lat, lng })
    onSelect({ lat, lng })
  }

  return (
    <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={handleLocate}
        className="absolute top-2 left-2 z-20 p-2 rounded-full backdrop-blur transition cursor-pointer border border-gray-300 bg-white/80 hover:bg-white"
        aria-label="Locate me"
      >
        <LocateFixed className="w-4 h-4" />
      </button>

      <MapLibre
        ref={(instance: MapRef | null) => {
          if (instance) mapRef.current = instance
        }}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '10px',
        }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        attributionControl={false}
        onLoad={handleMapLoad}
        onClick={handleMapClick}
      >
        {selectedLat && selectedLng ? (
          <Marker 
            longitude={selectedLng} 
            latitude={selectedLat} 
            color="red"
          />
        ) : (
          <Marker 
            longitude={location[0]} 
            latitude={location[1]} 
            color="blue"
          />
        )}
      </MapLibre>
    </div>
  )
} 