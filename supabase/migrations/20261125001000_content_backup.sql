/*
  # Content backup before the November 2026 accuracy corrections

  A full copy of the rights, legal and glossary tables, taken before any
  wording was corrected against the official California sources and before
  duplicate entries were removed. Private: row level security on, no policies.
*/

CREATE TABLE IF NOT EXISTS public.content_backup_20261125 (
  tbl text NOT NULL,
  row_data jsonb NOT NULL,
  saved_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.content_backup_20261125 ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.content_backup_20261125 FROM anon, authenticated;

INSERT INTO public.content_backup_20261125 (tbl, row_data)
SELECT 'rights_duties', to_jsonb(r) - 'search_vector' FROM public.rights_duties r
UNION ALL SELECT 'legal_content', to_jsonb(l) - 'search_vector' FROM public.legal_content l
UNION ALL SELECT 'glossary_terms', to_jsonb(g) FROM public.glossary_terms g;
