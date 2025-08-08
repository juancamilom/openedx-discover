-- Add reviewer's name to reviews table
ALTER TABLE public.reviews
ADD COLUMN IF NOT EXISTS name text;