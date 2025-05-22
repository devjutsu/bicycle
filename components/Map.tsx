'use client'

import { useState, useRef, useEffect } from 'react'
import MapLibre, { Marker, MapRef } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Fullscreen, LocateFixed } from 'lucide-react'
import { useRouter } from 'next/navigation'

type MapProps = {
  fullScreen?: boolean
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
  }

  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation: [number, number] = [
          position.coords.longitude,
          position.coords.latitude,
        ]
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
        alert('Unable to retrieve your location.')
      }
    )
  }

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <button
        onClick={handleLocate}
        className="absolute top-2 left-2 z-20 p-2 rounded-full backdrop-blur transition cursor-pointer border border-gray-300 bg-gray-200"
        aria-label="Locate self"
      >
        <LocateFixed />
      </button>

      {!props.fullScreen && (
        <button
          onClick={() => router.push('/map')}
          className="absolute top-2 right-2 z-20 p-2 rounded-full backdrop-blur transition cursor-pointer border border-gray-300 bg-gray-200"
          aria-label="Open full screen map"
        >
          <Fullscreen className="w-5 h-5 text-black" />
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
      </MapLibre>
    </div>
  )
} 