CREATE TABLE "ride_participants" (
	"id" serial PRIMARY KEY NOT NULL,
	"ride_id" integer NOT NULL,
	"participant" text NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "rides" ALTER COLUMN "start_lat" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "rides" ALTER COLUMN "start_lng" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "rides" ALTER COLUMN "start_time" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "rides" ADD COLUMN "start_distance" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "rides" ADD COLUMN "end_distance" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "ride_participants" ADD CONSTRAINT "ride_participants_ride_id_rides_id_fk" FOREIGN KEY ("ride_id") REFERENCES "public"."rides"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rides" DROP COLUMN "distance";