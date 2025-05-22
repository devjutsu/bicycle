import { Map } from '@/components/Map'

export default function MapPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex-1 relative">
        <Map fullScreen />
      </div>
    </main>
  )
} 