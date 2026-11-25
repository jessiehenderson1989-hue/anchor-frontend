/*
  # Intake answers that were being lost, and a username check that works

  1. Intake
     The intake screens save these answers, but the columns did not exist, so
     the whole save was rejected and the answers were lost without a message.
     All are optional.

  2. Username check
     A signed-out person cannot read `profiles`, so the sign-up screen could
     never tell whether a username was taken. This function answers yes or no
     and exposes nothing else.
*/

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS youth_age text,
  ADD COLUMN IF NOT EXISTS youth_placement text,
  ADD COLUMN IF NOT EXISTS has_casd text,
  ADD COLUMN IF NOT EXISTS casd_name text,
  ADD COLUMN IF NOT EXISTS casd_phone text,
  ADD COLUMN IF NOT EXISTS supporter_relation text,
  ADD COLUMN IF NOT EXISTS who_supporting text,
  ADD COLUMN IF NOT EXISTS reminder_settings jsonb;

CREATE OR REPLACE FUNCTION public.username_available(p_username text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE lower(username) = lower(trim(p_username))
  );
$$;

REVOKE ALL ON FUNCTION public.username_available(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.username_available(text) TO anon, authenticated;
