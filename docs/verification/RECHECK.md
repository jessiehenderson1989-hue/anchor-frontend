# Checking the corrections

Earlier today a fact check found problems and a fixer rewrote those sentences. Your job is to fact-check the NEW wording, so every correction has its own proof. First read /home/claude/anchor-verify/INSTRUCTIONS.md: the record format, the rule that source_says must be words you saw in this run, and the search-first rule all apply here. Ignore its "Resuming" section.

Input: your changes file (JSONL). Use only lines whose action is "replaced" or "citation" and whose field does not start with "spanish". Each has: key, table, id, title, field, before, after.

For each such line:
1. Confirm the "after" text is live: for database tables, SELECT that field for that id (Supabase project dmrmgpidvfcywilcsmff, SELECT only) and check it contains the after text; for table "code", grep the file. If it is not there, write a record with verdict COULD_NOT_VERIFY and steps saying the text was not found.
2. Test every claim in the after text against a primary source you open now. Do not trust the earlier record. For a citation line, open the cited section, rule or form and check it supports what the entry says.
3. Write ONE record per line to your proof file, in the INSTRUCTIONS.md format, with "statement" set to the after text, plus an extra field "recheck_of": "<the line's key>". If any claim in the after text fails, the verdict is the worst one that applies and "fix" holds corrected plain wording (5th-grade level, no em or en dashes).
Write each record as soon as you have it. Change nothing in the database or the repo.

Final report under 200 words: counts by verdict, then each record that is not CONFIRMED as: title | statement | verdict | fix.
