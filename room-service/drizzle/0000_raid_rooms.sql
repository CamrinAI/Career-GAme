CREATE TABLE raid_rooms (
  code text PRIMARY KEY NOT NULL,
  revision integer NOT NULL DEFAULT 0,
  data text NOT NULL,
  expires integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX raid_rooms_expires_idx ON raid_rooms (expires);
