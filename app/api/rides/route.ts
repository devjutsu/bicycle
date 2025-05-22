import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { rides } from '@/lib/db/schema'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received request body:', body)
    
    const { distance, creator, startLat, startLng } = body

    if (!startLat || !startLng) {
      return NextResponse.json(
        { error: 'Starting point coordinates are required' },
        { status: 400 }
      )
    }

    if (!distance || isNaN(Number(distance))) {
      return NextResponse.json(
        { error: 'Valid distance is required' },
        { status: 400 }
      )
    }

    console.log('Creating ride with data:', {
      distance: parseInt(distance),
      creator,
      startLat,
      startLng,
    })

    const newRide = await db.insert(rides).values({
      distance: parseInt(distance),
      creator,
      isOpenRoute: true, // Default to open route
      startLat,
      startLng,
    }).returning()

    console.log('Created ride:', newRide[0])
    return NextResponse.json(newRide[0])
  } catch (error) {
    console.error('Error creating ride:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create ride' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    console.log('Attempting to fetch rides...')
    const allRides = await db.select().from(rides)
    console.log('Successfully fetched rides:', allRides)
    return NextResponse.json(allRides)
  } catch (error) {
    console.error('Error fetching rides:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch rides' },
      { status: 500 }
    )
  }
} 