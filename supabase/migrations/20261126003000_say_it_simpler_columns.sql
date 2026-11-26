-- "Say it simpler" line for each right and glossary term (already applied to the live database).
alter table public.rights_duties add column if not exists simple_text text;
alter table public.glossary_terms add column if not exists simple_text text;
