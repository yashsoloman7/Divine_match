-- Create the admins table
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'host', -- 'admin' or 'host'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Allow public read access (We use this for the mock auth to verify login)
-- In a real production app, you'd use Supabase Auth and restrict this to authenticated users.
CREATE POLICY "Allow public read access for admins"
  ON admins FOR SELECT
  USING (true);

-- Allow public insert access
CREATE POLICY "Allow public insert access for admins"
  ON admins FOR INSERT
  WITH CHECK (true);

-- Allow public delete access
CREATE POLICY "Allow public delete access for admins"
  ON admins FOR DELETE
  USING (true);

-- Seed the initial Grand Admin account
INSERT INTO admins (name, email, role)
VALUES ('Grand Admin', 'admin@divinematch.com', 'admin');
