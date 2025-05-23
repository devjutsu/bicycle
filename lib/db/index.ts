import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:54323/postgres'

const client = postgres(connectionString)
export const db = drizzle(client, { schema }) 