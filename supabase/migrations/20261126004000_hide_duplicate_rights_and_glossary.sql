-- Doubles in rights and glossary are hidden, never deleted (already applied to the live database).
alter table public.rights_duties add column if not exists is_hidden boolean not null default false;
alter table public.rights_duties add column if not exists hidden_reason text;
alter table public.glossary_terms add column if not exists is_hidden boolean not null default false;
alter table public.glossary_terms add column if not exists hidden_reason text;
alter policy "Anyone can read rights_duties" on public.rights_duties using (is_hidden = false);
alter policy "Anyone can read glossary" on public.glossary_terms using (is_hidden = false);
-- 15 rights and 7 glossary terms were marked is_hidden = true on 2026-11-26.
-- To bring one back: update ... set is_hidden = false where id = '...';
