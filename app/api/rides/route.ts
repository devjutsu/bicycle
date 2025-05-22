import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { rides } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received request body:', body)
    
    const { startDistance, endDistance, creator, startLat, startLng, startTime } = body

    if (!startLat || !startLng) {
      return NextResponse.json(
        { error: 'Starting point coordinates are required' },
        { status: 400 }
      )
    }

    if (!startDistance || !endDistance || isNaN(Number(startDistance)) || isNaN(Number(endDistance))) {
      return NextResponse.json(
        { error: 'Valid start and end distances are required' },
        { status: 400 }
      )
    }

    if (Number(startDistance) >= Number(endDistance)) {
      return NextResponse.json(
        { error: 'End distance must be greater than start distance' },
        { status: 400 }
      )
    }

    if (!startTime) {
      return NextResponse.json(
        { error: 'Start time is required' },
        { status: 400 }
      )
    }

    const rideData = {
      startDistance: parseInt(startDistance),
      endDistance: parseInt(endDistance),
      creator,
      isOpenRoute: true, // Default to open route
      startLat,
      startLng,
      startTime: new Date(startTime),
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
    console.log('Attempting to fetch recent rides...')
    const recentRides = await db.select()
      .from(rides)
      .orderBy(desc(rides.createdAt))
    console.log('Successfully fetched recent rides:', recentRides)
    return NextResponse.json(recentRides)
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