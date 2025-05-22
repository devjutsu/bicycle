'use client'

import { useCallback, useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

interface MapSelectorProps {
  onSelect: (lat: number, lng: number) => void
  selectedLat?: string
  selectedLng?: string
}

export function MapSelector({ onSelect, selectedLat, selectedLng }: MapSelectorProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const marker = useRef<maplibregl.Marker | null>(null)

  useEffect(() => {
    if (map.current) return

    map.current = new maplibregl.Map({
      container: mapContainer.current!,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [-122.4, 37.8],
      zoom: 12
    })

    map.current.on('click', (e) => {
      const { lat, lng } = e.lngLat
      console.log('Map clicked:', { lat, lng })
      onSelect(lat, lng)
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [onSelect])

  useEffect(() => {
    if (!map.current) return

    if (marker.current) {
      marker.current.remove()
    }

    if (selectedLat && selectedLng) {
      marker.current = new maplibregl.Marker({ color: '#3b82f6' })
        .setLngLat([parseFloat(selectedLng), parseFloat(selectedLat)])
        .addTo(map.current)
    }
  }, [selectedLat, selectedLng])

  return (
    <div className="h-[200px] w-full rounded-lg overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  )
} 