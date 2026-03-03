-- Copy and paste this into your Supabase SQL Editor to update the candidates table
-- This script will safely add missing columns if the table already exists

CREATE TABLE IF NOT EXISTS public.candidates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY
);

-- Safely add all columns (won't error if they already exist)
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS age INTEGER;
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS dob DATE;
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS status TEXT;
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS height TEXT;
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS blood_group TEXT;
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS complexion TEXT;
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS mother_tongue TEXT;
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS native_place TEXT;
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS father_name TEXT;
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS mother_name TEXT;
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS siblings_details TEXT;
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS present_address TEXT;
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS education TEXT;
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS work_status TEXT;
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS workplace TEXT;
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS annual_salary TEXT;
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS church_name_address TEXT;
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS pastor_name_mobile TEXT;
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS partner_preferences TEXT;
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS interests TEXT[];
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS avatar TEXT;
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Enable RLS (Row Level Security)
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

-- We don't recreate policies here to avoid the error you just saw. 
-- As long as the table and columns exist, your app should be able to submit data!
