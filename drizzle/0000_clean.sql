-- Drop Drizzle migrations table
DROP TABLE IF EXISTS "__drizzle_migrations" CASCADE;

-- Drop all tables in reverse order of dependencies
DROP TABLE IF EXISTS ride_participants CASCADE;
DROP TABLE IF EXISTS rides CASCADE;
DROP TABLE IF EXISTS invitations CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS users CASCADE; 