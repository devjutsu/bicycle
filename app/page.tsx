import { Map } from '@/components/Map'
import { RideList } from '@/components/RideList'
import { CreateRideButton } from '@/components/CreateRideButton'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex-1 relative">
        <Map />
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <RideList />
        </div>
        <div className="absolute top-4 right-4 z-10">
          <CreateRideButton />
        </div>
      </div>
    </main>
  )
} 