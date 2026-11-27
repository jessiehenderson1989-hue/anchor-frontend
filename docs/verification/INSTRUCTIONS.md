# Proof records (read this fully before starting)

For this run you must leave a proof record for EVERY statement you test, so a person can retrace your steps.

Write your records to the file path you were given, one JSON object per line (JSONL), appended as you go (do not wait until the end). Writing this one file is required and allowed. Change nothing else: no database writes, no repo edits.

Each line:
{"table": "...", "id": "<row id, or file:line for code>", "title": "<entry title or term>", "role": "<user_role if any>", "field": "<description|simple_text|definition|full_content|plain_language|subsections|code>", "statement": "<the exact words from Anchor being tested, one claim only>", "verdict": "CONFIRMED|WRONG|OVERSTATED|OUT_OF_DATE|NOT_SUPPORTED|COULD_NOT_VERIFY", "source_name": "<e.g. WIC 366.21(e), Cal. Rules of Court rule 8.450, form JV-290, Judicial Council booklet>", "source_url": "<the page you actually opened>", "source_says": "<the exact words from that page that settle it, 30 words or fewer>", "steps": "<how you got there, e.g. searched 'WIC 349 minor present hearing', opened the public.law page, read subdivision (a)>", "fix": "<corrected plain wording if not CONFIRMED, else empty>"}

Rules for records:
- One record per claim. An entry with three claims gets three records. Cover every sentence that states a right, duty, deadline, number, age, amount, who may do what, what a judge or agency must or may do, a form, a phone number, or a named program. Sentences that are only encouragement or description ("this hearing is hard") need no record.
- "source_says" must be words you actually saw on the page you opened in this run. Never write it from memory. If you could not open a source, the verdict is COULD_NOT_VERIFY and source_says stays empty. A wrong CONFIRMED is the worst possible outcome of this run.
- If two sources disagree, record both in steps and use COULD_NOT_VERIFY.
- Search first, then open pages the search returned (opening other URLs may need an approval nobody is there to give). Good sources: california.public.law, courts.ca.gov (rules, forms), selfhelp.courts.ca.gov, cdss.ca.gov, dhcs.ca.gov, fosteryouthhelp.ca.gov, govinfo.gov, law.cornell.edu.
- When several entries state the same fact, you may reuse a source you already opened, but still write one record per statement.
- Keep valid JSON: escape quotes, no line breaks inside a record. At the end run: python3 -c "import json,sys; [json.loads(l) for l in open(sys.argv[1]) if l.strip()]; print('valid')" <your file>

Your final report (short, under 300 words): how many records you wrote by verdict, then every record that is not CONFIRMED as: title | statement | verdict | fix. Nothing else.

## Resuming (added after the first run was cut off)
An earlier run stopped partway. Before you start, collect the ids that already have records and SKIP those rows:
python3 -c "import json,glob; print(sorted({str(json.loads(l).get('id')) for f in glob.glob('/home/claude/anchor-verify/*.jsonl') for l in open(f) if l.strip()}))"
Append to your proof file; never rewrite or delete existing lines. Write each record as soon as you have it, so nothing is lost if the run stops again.
