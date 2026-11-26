/*
  # Resource checker

  Every two days the database asks the `check-resources` edge function to
  visit each resource's website and record what it finds: does the page load,
  did it move, does our phone number still appear. Nothing here edits a
  resource. People review the flags in `resource_review`.

  The edge function is deployed through Supabase, not from this repository.
  The shared secret is created inside the database and kept in Vault.
*/
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS listing_checked_at timestamptz;

CREATE TABLE IF NOT EXISTS public.resource_checks (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  resource_id uuid NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  checked_at timestamptz NOT NULL DEFAULT now(),
  website text,
  website_status text NOT NULL,
  http_status integer,
  final_url text,
  phone_on_site boolean,
  pages_checked integer NOT NULL DEFAULT 0,
  flags text[] NOT NULL DEFAULT '{}',
  details jsonb NOT NULL DEFAULT '{}'
);
CREATE INDEX IF NOT EXISTS resource_checks_latest ON public.resource_checks (resource_id, checked_at DESC);
ALTER TABLE public.resource_checks ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.resource_checks FROM anon, authenticated;

CREATE OR REPLACE VIEW public.resource_review WITH (security_invoker = true) AS
  SELECT DISTINCT ON (c.resource_id)
         r.id AS resource_id, r.name, r.county, r.category, r.is_example,
         c.checked_at, c.website_status, c.http_status, c.website, c.final_url,
         r.phone, c.phone_on_site, c.flags, c.details
  FROM public.resource_checks c
  JOIN public.resources r ON r.id = c.resource_id
  ORDER BY c.resource_id, c.checked_at DESC;
REVOKE ALL ON public.resource_review FROM anon, authenticated;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM vault.secrets WHERE name = 'resource_checker_secret') THEN
    PERFORM vault.create_secret(
      replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''),
      'resource_checker_secret',
      'Shared secret between the database and the check-resources function');
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.resource_checker_secret()
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, vault AS $$
  SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'resource_checker_secret' LIMIT 1
$$;
REVOKE ALL ON FUNCTION public.resource_checker_secret() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.resource_checker_secret() TO service_role;

CREATE OR REPLACE FUNCTION public.run_resource_check(p_limit integer DEFAULT 25)
RETURNS bigint LANGUAGE sql SECURITY DEFINER SET search_path = public, net AS $$
  SELECT net.http_post(
    url := 'https://dmrmgpidvfcywilcsmff.supabase.co/functions/v1/check-resources',
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-checker-secret', public.resource_checker_secret()),
    body := jsonb_build_object('limit', p_limit),
    timeout_milliseconds := 150000)
$$;
REVOKE ALL ON FUNCTION public.run_resource_check(integer) FROM PUBLIC, anon, authenticated;

SELECT cron.schedule('check-resources', '0,4,8,12,16,20,24,28,32,36,40,44,48 10 */2 * *', 'SELECT public.run_resource_check(25)');
