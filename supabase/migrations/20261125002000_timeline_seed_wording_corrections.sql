/*
  # Timeline seed wording, corrected against the official California guides

  Rewrites five phrases inside initialize_user_timeline and in timeline rows
  already seeded: first-hearing timing in court days, what a youth's lawyer
  does, and that a supporter asks to attend rather than having a right to.

  The matching corrections to rights_duties, glossary_terms and legal_content
  were made directly in the database on 2026-11-25. The text as it stood
  before is kept in public.content_backup_20261125.
*/
DO $$
DECLARE d text;
BEGIN
  SELECT pg_get_functiondef(p.oid) INTO d
  FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
  WHERE n.nspname = 'public' AND p.proname = 'initialize_user_timeline';

  d := replace(d, ', usually within 2-3 days of removal', '. The social worker has 2 court days to file papers, and the hearing is the next court day');
  d := replace(d, ', usually 2-3 days after being placed', ', usually a few court days after you are placed');
  d := replace(d, 'Meet your lawyer - they work for YOU', 'Meet your lawyer - they tell the judge what you want');
  d := replace(d, 'Right to have lawyer argue for what you want', 'Right to have your lawyer tell the judge what you want');
  d := replace(d, 'Right to attend as support person', 'You can ask to attend. The judge decides.');
  EXECUTE d;
END $$;

UPDATE public.timeline_stages SET
  what_happens = replace(replace(what_happens,
    ', usually within 2-3 days of removal', '. The social worker has 2 court days to file papers, and the hearing is the next court day'),
    ', usually 2-3 days after being placed', ', usually a few court days after you are placed'),
  your_rights = array_replace(array_replace(your_rights,
    'Right to have lawyer argue for what you want', 'Right to have your lawyer tell the judge what you want'),
    'Right to attend as support person', 'You can ask to attend. The judge decides.'),
  tasks = replace(tasks::text, 'Meet your lawyer - they work for YOU', 'Meet your lawyer - they tell the judge what you want')::jsonb
WHERE what_happens LIKE '%2-3 days%'
   OR 'Right to have lawyer argue for what you want' = ANY(your_rights)
   OR 'Right to attend as support person' = ANY(your_rights)
   OR tasks::text LIKE '%they work for YOU%';
