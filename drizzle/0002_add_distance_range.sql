-- Add new columns
ALTER TABLE rides ADD COLUMN start_distance integer NOT NULL DEFAULT 0;
ALTER TABLE rides ADD COLUMN end_distance integer NOT NULL DEFAULT 0;

-- Copy data from old distance column to new columns
UPDATE rides SET start_distance = distance, end_distance = distance;

-- Remove old column
ALTER TABLE rides DROP COLUMN distance; 