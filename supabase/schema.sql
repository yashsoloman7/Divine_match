-- Create the candidates table
CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    full_name TEXT NOT NULL,
    age INTEGER,
    dob DATE,
    gender TEXT,
    status TEXT,
    phone TEXT NOT NULL,
    email TEXT,
    height TEXT,
    blood_group TEXT,
    complexion TEXT,
    mother_tongue TEXT,
    native_place TEXT,
    category TEXT,
    father_name TEXT,
    mother_name TEXT,
    siblings_details TEXT,
    present_address TEXT,
    education TEXT,
    work_status TEXT,
    company_name TEXT,
    workplace TEXT,
    annual_salary TEXT,
    church_name_address TEXT,
    pastor_name_mobile TEXT,
    partner_preferences TEXT,
    interests TEXT[],
    avatar TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

-- Allow public read access to candidates (adjust policies later if needed for privacy)
CREATE POLICY "Allow public read access"
  ON candidates FOR SELECT
  USING (true);

-- Allow public insert access for registration
CREATE POLICY "Allow public insert access"
  ON candidates FOR INSERT
  WITH CHECK (true);

-- Allow public update access (if candidates edit profiles)
CREATE POLICY "Allow public update access"
  ON candidates FOR UPDATE
  USING (true);
