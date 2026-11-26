/*
  # Hide resources without deleting them

  `is_hidden` keeps a resource out of the app. The row stays in the database
  with the reason it was hidden. Used for the example listings (placeholder
  phone numbers) and for a listing whose website now forwards to an
  unrelated site.
*/
ALTER TABLE public.resources
  ADD COLUMN IF NOT EXISTS is_hidden boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS hidden_reason text;

ALTER POLICY "Anyone can view resources" ON public.resources USING (is_hidden = false);

UPDATE public.resources
SET is_hidden = true, hidden_reason = 'Example listing with placeholder contact details'
WHERE is_example = true;

UPDATE public.resources
SET is_hidden = true, hidden_reason = 'Website now forwards to an unrelated site (Nov 2026)'
WHERE website ILIKE '%sloride.org%';
