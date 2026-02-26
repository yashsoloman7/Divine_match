-- Create the events table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    date_start DATE NOT NULL,
    date_end DATE,
    location TEXT NOT NULL,
    price_candidate NUMERIC DEFAULT 0,
    price_family NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Allow public read access to events
CREATE POLICY "Allow public read access for events"
  ON events FOR SELECT
  USING (true);

-- Allow public insert access for events (Assuming admin will insert from frontend)
-- For a real production app, restrict this to admin users only.
CREATE POLICY "Allow public insert access for events"
  ON events FOR INSERT
  WITH CHECK (true);

-- Allow public delete access for events
CREATE POLICY "Allow public delete access for events"
  ON events FOR DELETE
  USING (true);
