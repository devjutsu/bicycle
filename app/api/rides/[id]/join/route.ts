import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { rideParticipants } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const rideId = parseInt(params.id)
    if (isNaN(rideId)) {
      return NextResponse.json(
        { error: 'Invalid ride ID' },
        { status: 400 }
      )
    }

    // For now, we'll use a hardcoded user ID since we don't have auth yet
    const userId = 'User'

    console.log('Attempting to join ride:', { rideId, userId })

    const participant = await db.insert(rideParticipants)
      .values({
        rideId,
        userId,
      })
      .returning()

    console.log('Successfully joined ride:', participant[0])
    return NextResponse.json(participant[0])
  } catch (error) {
    console.error('Error joining ride:', error)
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
      { error: error instanceof Error ? error.message : 'Failed to join ride' },
      { status: 500 }
    )
  }
} 