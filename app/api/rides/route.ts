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

    const rideData = {
      distance: parseInt(distance),
      creator,
      isOpenRoute: true, // Default to open route
      startLat,
      startLng,
    }
    console.log('Attempting to create ride with data:', rideData)

    try {
      const newRide = await db.insert(rides).values(rideData).returning()
      console.log('Successfully created ride:', newRide[0])
      return NextResponse.json(newRide[0])
    } catch (dbError) {
      console.error('Database error details:', {
        error: dbError,
        message: dbError instanceof Error ? dbError.message : 'Unknown database error',
        stack: dbError instanceof Error ? dbError.stack : undefined,
        code: dbError instanceof Error ? (dbError as any).code : undefined,
        detail: dbError instanceof Error ? (dbError as any).detail : undefined,
        constraint: dbError instanceof Error ? (dbError as any).constraint : undefined,
      })
      throw dbError // Re-throw to be caught by outer catch block
    }
  } catch (error) {
    console.error('Error creating ride:', error)
    const errorMessage = error instanceof Error 
      ? `${error.message}${(error as any).detail ? ` - ${(error as any).detail}` : ''}`
      : 'Failed to create ride'
    return NextResponse.json(
      { error: errorMessage },
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
        name: error.name,
        code: (error as any).code,
        detail: (error as any).detail,
        constraint: (error as any).constraint,
      })
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch rides' },
      { status: 500 }
    )
  }
} 