# Builds the verification ledger page from the checkers' proof records.
# Usage: python3 build.py   (reads *.jsonl here, writes site/index.html and site/records.json)
import json, glob, os, hashlib, collections, datetime

HERE = os.path.dirname(os.path.abspath(__file__))
SECTION = {'rights_duties': 'Rights', 'glossary_terms': 'Glossary', 'legal_content': 'Legal pages', 'code': 'App text', 'timeline_stages': 'App text', 'open': 'Open questions'}
VERDICTS = ['CONFIRMED', 'WRONG', 'OVERSTATED', 'OUT_OF_DATE', 'NOT_SUPPORTED', 'COULD_NOT_VERIFY']

def key(r):
    return hashlib.sha1((str(r.get('table')) + '|' + str(r.get('id')) + '|' + str(r.get('statement'))).encode()).hexdigest()[:12]

records, bad = [], 0
for f in sorted(glob.glob(os.path.join(HERE, '*.jsonl'))):
    base = os.path.basename(f)
    if base.startswith('audit') or base.startswith('changes'):
        continue
    for line in open(f, encoding='utf-8'):
        line = line.strip()
        if not line:
            continue
        try:
            r = json.loads(line)
        except Exception:
            bad += 1
            continue
        v = str(r.get('verdict', '')).upper().replace(' ', '_')
        r['verdict'] = v if v in VERDICTS else 'COULD_NOT_VERIFY'
        r['section'] = SECTION.get(str(r.get('table')), 'App text')
        r['key'] = key(r)
        r['batch'] = base.replace('.jsonl', '')
        for k in ('title', 'role', 'field', 'statement', 'source_name', 'source_url', 'source_says', 'steps', 'fix', 'id'):
            r[k] = '' if r.get(k) is None else str(r.get(k))
        r['resolution'] = ''
        r['recheck_of'] = str(r.get('recheck_of') or '')
        records.append(r)

# What was done about each problem, and the auditor's spot check, if those files exist
res_path = os.path.join(HERE, 'resolutions.json')
if os.path.exists(res_path):
    res = json.load(open(res_path, encoding='utf-8'))
    for r in records:
        if r['key'] in res:
            r['resolution'] = res[r['key']]
audit = []
for f in sorted(glob.glob(os.path.join(HERE, 'audit*.jsonl'))):
    for line in open(f, encoding='utf-8'):
        line = line.strip()
        if line:
            try:
                audit.append(json.loads(line))
            except Exception:
                pass
amap = {a.get('key'): a for a in audit if a.get('key')}
for r in records:
    a = amap.get(r['key'])
    r['audit'] = (a.get('audit_verdict', '') + ((': ' + a.get('audit_note', '')) if a.get('audit_note') else '')) if a else ''

os.makedirs(os.path.join(HERE, 'site'), exist_ok=True)
with open(os.path.join(HERE, 'site', 'records.json'), 'w', encoding='utf-8') as out:
    out.write('[\n' + ',\n'.join(json.dumps(r, ensure_ascii=False) for r in records) + '\n]\n')

counts = collections.Counter(r['verdict'] for r in records)
print('records', len(records), 'bad lines', bad, dict(counts), 'audited', len(amap))

PAGE = r'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Anchor Verification Ledger</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
:root {
  /* A ledger: summary first, then every entry with each statement, its source and its verdict. */
  --paper: #F6F7F5; --card: #FFFFFF; --ink: #17212B; --muted: #5A6772; --line: #D9DEDB; --accent: #0E5E6F;
  --good: #1F7A4D; --good-bg: #E3F3EA; --bad: #B3261E; --bad-bg: #FBE6E4; --warn: #8A5A00; --warn-bg: #FBF0D5; --unk: #4A5568; --unk-bg: #E8ECEF;
  --display: 'Source Serif 4', Georgia, serif; --body: 'IBM Plex Sans', system-ui, sans-serif; --mono: 'IBM Plex Mono', ui-monospace, monospace;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { color-scheme: dark;
  --paper: #10171C; --card: #18222A; --ink: #E8EDF0; --muted: #9AA8B3; --line: #2B3944; --accent: #6CC5D6;
  --good: #7BD3A3; --good-bg: #17382A; --bad: #FF9A91; --bad-bg: #44201D; --warn: #F0C56A; --warn-bg: #3D3016; --unk: #B5C0CA; --unk-bg: #26323C; } }
:root[data-theme="dark"] { color-scheme: dark;
  --paper: #10171C; --card: #18222A; --ink: #E8EDF0; --muted: #9AA8B3; --line: #2B3944; --accent: #6CC5D6;
  --good: #7BD3A3; --good-bg: #17382A; --bad: #FF9A91; --bad-bg: #44201D; --warn: #F0C56A; --warn-bg: #3D3016; --unk: #B5C0CA; --unk-bg: #26323C; }
* { box-sizing: border-box; }
[hidden] { display: none !important; }
html, body { margin: 0; }
body { background: var(--paper); color: var(--ink); font-family: var(--body); font-size: 16px; line-height: 1.5; }
main { max-width: 1040px; margin: 0 auto; padding: 32px 20px 80px; display: flex; flex-direction: column; gap: 24px; }
h1 { font-family: var(--display); font-size: 34px; line-height: 1.15; margin: 0; text-wrap: balance; }
h2 { font-family: var(--display); font-size: 21px; margin: 0; }
p { margin: 0; }
.lede { color: var(--muted); max-width: 68ch; }
.tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 12px; }
.tile { background: var(--card); border: 1px solid var(--line); border-radius: 10px; padding: 14px 16px; display: flex; flex-direction: column; gap: 2px; }
.tile b { font-family: var(--display); font-size: 30px; font-variant-numeric: tabular-nums; line-height: 1.1; }
.tile span { color: var(--muted); font-size: 14px; }
.tile.good b { color: var(--good); } .tile.bad b { color: var(--bad); } .tile.unk b { color: var(--unk); }
.panel { background: var(--card); border: 1px solid var(--line); border-radius: 10px; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
.scroll { overflow-x: auto; }
table { border-collapse: collapse; width: 100%; font-variant-numeric: tabular-nums; }
th, td { text-align: right; padding: 7px 10px; border-bottom: 1px solid var(--line); white-space: nowrap; }
th:first-child, td:first-child { text-align: left; }
th { font-size: 13px; color: var(--muted); font-weight: 500; }
.controls { display: flex; flex-wrap: wrap; gap: 10px; align-items: end; }
.controls label { display: flex; flex-direction: column; gap: 4px; font-size: 13px; color: var(--muted); }
select, input[type=search] { font: inherit; color: var(--ink); background: var(--card); border: 1px solid var(--line); border-radius: 8px; padding: 8px 10px; min-width: 170px; }
select:focus-visible, input:focus-visible, summary:focus-visible, a:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
#count { color: var(--muted); font-size: 14px; margin-left: auto; }
#list { display: flex; flex-direction: column; gap: 10px; }
details.entry { background: var(--card); border: 1px solid var(--line); border-radius: 10px; }
details.entry > summary { cursor: pointer; padding: 12px 16px; display: flex; flex-wrap: wrap; gap: 8px 12px; align-items: center; list-style: none; }
details.entry > summary::-webkit-details-marker { display: none; }
details.entry > summary::before { content: '+'; font-family: var(--mono); color: var(--accent); width: 12px; }
details.entry[open] > summary::before { content: '-'; }
.etitle { font-weight: 600; flex: 1 1 260px; min-width: 0; overflow-wrap: anywhere; }
.meta { color: var(--muted); font-size: 13px; }
.chip { font-size: 12px; font-weight: 600; letter-spacing: .02em; border-radius: 999px; padding: 2px 9px; white-space: nowrap; }
.CONFIRMED { color: var(--good); background: var(--good-bg); }
.WRONG, .OUT_OF_DATE { color: var(--bad); background: var(--bad-bg); }
.OVERSTATED, .NOT_SUPPORTED { color: var(--warn); background: var(--warn-bg); }
.COULD_NOT_VERIFY { color: var(--unk); background: var(--unk-bg); }
.stmts { border-top: 1px solid var(--line); display: flex; flex-direction: column; }
.stmt { padding: 14px 16px; border-bottom: 1px solid var(--line); display: grid; grid-template-columns: 150px 1fr; gap: 6px 14px; }
.stmt:last-child { border-bottom: 0; }
.stmt .k { color: var(--muted); font-size: 13px; padding-top: 2px; }
.stmt .v { min-width: 0; overflow-wrap: anywhere; }
.quote { font-family: var(--mono); font-size: 14px; border-left: 3px solid var(--accent); padding-left: 10px; }
.steps { color: var(--muted); font-size: 14px; }
.fix { border-left: 3px solid var(--warn); padding-left: 10px; }
.done { color: var(--good); font-weight: 500; }
a { color: var(--accent); }
@media (max-width: 620px) { .stmt { grid-template-columns: 1fr; } h1 { font-size: 27px; } #count { margin-left: 0; } }
</style>
</head>
<body>
<main>
  <header style="display:flex;flex-direction:column;gap:10px">
    <h1>Anchor Verification Ledger</h1>
    <p class="lede">Every statement Anchor makes about rights, deadlines, forms and the court, checked against a source. Each line shows what Anchor says, the page that was opened, the words on that page that settle it, and the verdict. Built __DATE__.</p>
  </header>
  <section class="panel" id="statusbox" style="border-left:4px solid var(--warn)"><h2>This check is not finished</h2><p>__STATUS__</p></section>
  <section class="tiles" id="tiles" aria-label="Totals"></section>
  <section class="panel"><h2>By part of the app</h2><div class="scroll"><table id="bysection"></table></div></section>
  <section class="panel" id="recheckbox" hidden><h2>Corrections checked again</h2><p id="rechecktext"></p></section>
  <section class="panel" id="auditbox" hidden><h2>Second check of the checkers</h2><p id="audittext"></p></section>
  <section class="panel">
    <h2>Every entry</h2>
    <div class="controls">
      <label for="fsec">Part of the app<select id="fsec"><option value="">All</option></select></label>
      <label for="fver">Verdict<select id="fver"><option value="">All</option><option value="PROBLEM">Anything not confirmed</option></select></label>
      <label for="fq">Search<input type="search" id="fq" placeholder="word, form or code section"></label>
      <span id="count"></span>
    </div>
    <div id="list"></div>
  </section>
</main>
<script>
const TOTALS = __TOTALS__;
const LABEL = {CONFIRMED:'Confirmed', WRONG:'Wrong', OVERSTATED:'Overstated', OUT_OF_DATE:'Out of date', NOT_SUPPORTED:'Not supported', COULD_NOT_VERIFY:'Could not verify'};
const ORDER = ['WRONG','OUT_OF_DATE','OVERSTATED','NOT_SUPPORTED','COULD_NOT_VERIFY','CONFIRMED'];
const el = (t, c, txt) => { const e = document.createElement(t); if (c) e.className = c; if (txt != null) e.textContent = txt; return e; };
let ALL = [], BASE = [];
function worst(rs) { return ORDER.find(v => rs.some(r => r.verdict === v)) || 'CONFIRMED'; }
function tiles() {
  const n = v => BASE.filter(r => r.verdict === v).length;
  const bad = BASE.filter(r => !['CONFIRMED','COULD_NOT_VERIFY'].includes(r.verdict));
  const dealt = r => r.resolution && !r.resolution.startsWith('Still open');
  const fixed = bad.filter(dealt).length; const unk = BASE.filter(r => r.verdict === 'COULD_NOT_VERIFY');
  const data = [['', BASE.length, 'statements checked'], ['good', n('CONFIRMED'), 'confirmed against a source'], ['bad', bad.length, 'wrong or overstated (' + fixed + ' corrected or removed)'], ['unk', unk.length, 'could not be verified (' + unk.filter(dealt).length + ' reworded or removed)']];
  const box = document.getElementById('tiles');
  data.forEach(([c, num, lab]) => { const t = el('div', 'tile ' + c); t.append(el('b', '', num.toLocaleString()), el('span', '', lab)); box.append(t); });
}
function bySection() {
  const secs = [...new Set(BASE.map(r => r.section))];
  const t = document.getElementById('bysection');
  const head = el('tr'); ['Part', 'Entries checked', 'Statements', 'Confirmed', 'Wrong or overstated', 'Could not verify'].forEach(h => head.append(el('th', '', h))); t.append(head);
  secs.forEach(s => { const rs = BASE.filter(r => r.section === s); const tr = el('tr');
    const ne = new Set(rs.map(r => r.table + r.id)).size;
    [s, TOTALS[s] ? ne + ' of ' + TOTALS[s] : ne + ' (all)', rs.length, rs.filter(r => r.verdict === 'CONFIRMED').length, rs.filter(r => !['CONFIRMED','COULD_NOT_VERIFY'].includes(r.verdict)).length, rs.filter(r => r.verdict === 'COULD_NOT_VERIFY').length].forEach(v => tr.append(el('td', '', typeof v === 'number' ? v.toLocaleString() : v)));
    t.append(tr); const o = el('option', '', s); o.value = s; document.getElementById('fsec').append(o); });
  if (ALL.some(r => r.section === 'Open questions')) { const o = el('option', '', 'Open questions'); o.value = 'Open questions'; document.getElementById('fsec').append(o); }
  ORDER.slice().reverse().forEach(v => { const o = el('option', '', LABEL[v]); o.value = v; document.getElementById('fver').append(o); });
}
function auditBox() {
  const a = ALL.filter(r => r.audit); if (!a.length) return;
  const ok = a.filter(r => /^AGREE/i.test(r.audit)).length;
  document.getElementById('auditbox').hidden = false;
  document.getElementById('audittext').textContent = 'A separate checker reopened the source for ' + a.length + ' of these records without seeing the first checker\'s reasoning. It agreed with ' + ok + ' and disagreed with ' + (a.length - ok) + '. Each audited line shows the result.';
}
function recheckBox() {
  const rc = ALL.filter(r => r.recheck_of); if (!rc.length) return;
  const ok = rc.filter(r => r.verdict === 'CONFIRMED').length;
  document.getElementById('recheckbox').hidden = false;
  document.getElementById('rechecktext').textContent = 'Every corrected sentence was fact-checked again as its own statement. ' + rc.length + ' corrections were checked: ' + ok + ' confirmed, ' + (rc.length - ok) + ' not confirmed. They appear below marked "Check of a correction".';
}
function row(k, node) { const a = el('div', 'k', k); const b = el('div', 'v'); b.append(node); return [a, b]; }
function render() {
  const sec = document.getElementById('fsec').value, ver = document.getElementById('fver').value, q = document.getElementById('fq').value.trim().toLowerCase();
  const pass = r => (!sec || r.section === sec) && (!ver || (ver === 'PROBLEM' ? r.verdict !== 'CONFIRMED' : r.verdict === ver)) && (!q || (r.title + ' ' + r.statement + ' ' + r.source_name + ' ' + r.source_says + ' ' + r.fix).toLowerCase().includes(q));
  const groups = new Map();
  ALL.filter(pass).forEach(r => { const k = r.section + '|' + r.table + '|' + r.id + '|' + r.title; if (!groups.has(k)) groups.set(k, []); groups.get(k).push(r); });
  const list = document.getElementById('list'); list.textContent = '';
  const arr = [...groups.values()].sort((a, b) => ORDER.indexOf(worst(a)) - ORDER.indexOf(worst(b)) || a[0].section.localeCompare(b[0].section) || a[0].title.localeCompare(b[0].title));
  let shown = 0;
  arr.forEach(rs => { shown += rs.length; const w = worst(rs); const d = el('details', 'entry'); if (w !== 'CONFIRMED' && arr.length < 80) d.open = true;
    const s = el('summary'); s.append(el('span', 'etitle', rs[0].title || rs[0].id), el('span', 'meta', rs[0].section + (rs[0].role ? ' / ' + rs[0].role : '')), el('span', 'meta', rs.length + (rs.length === 1 ? ' statement' : ' statements')), el('span', 'chip ' + w, LABEL[w])); d.append(s);
    const box = el('div', 'stmts');
    rs.sort((a, b) => ORDER.indexOf(a.verdict) - ORDER.indexOf(b.verdict)).forEach(r => { const st = el('div', 'stmt');
      if (r.recheck_of) st.append(...row('Type', el('span', 'meta', 'Check of a correction')));
      st.append(...row('Verdict', el('span', 'chip ' + r.verdict, LABEL[r.verdict])));
      st.append(...row('Anchor says', el('span', '', r.statement)));
      if (r.source_says) st.append(...row('The source says', el('div', 'quote', r.source_says)));
      const src = el('span'); if (r.source_url && /^https?:/.test(r.source_url)) { const a = el('a', '', r.source_name || r.source_url); a.href = r.source_url; a.rel = 'noopener'; a.target = '_blank'; src.append(a); } else src.textContent = r.source_name || 'No source opened';
      st.append(...row('Source', src));
      if (r.steps) st.append(...row('How it was checked', el('span', 'steps', r.steps)));
      if (r.fix) st.append(...row('Corrected wording', el('div', 'fix', r.fix)));
      if (r.resolution) st.append(...row('What was done', el('span', r.resolution.startsWith('Still open') ? '' : 'done', r.resolution)));
      if (r.audit) st.append(...row('Second check', el('span', '', r.audit)));
      st.append(...row('Where', el('span', 'meta', (r.table === 'code' ? r.id : r.table + ' / ' + r.field) )));
      box.append(st); });
    d.append(box); list.append(d); });
  document.getElementById('count').textContent = arr.length.toLocaleString() + ' entries, ' + shown.toLocaleString() + ' statements shown';
}
fetch('records.json').then(r => r.json()).then(d => { ALL = d; BASE = d.filter(r => !r.recheck_of && r.section !== 'Open questions'); tiles(); bySection(); recheckBox(); auditBox(); render(); ['fsec', 'fver'].forEach(i => document.getElementById(i).addEventListener('change', render)); document.getElementById('fq').addEventListener('input', render); })
  .catch(() => { document.getElementById('list').textContent = 'The records could not be loaded. Reload the page to try again.'; });
</script>
</body>
</html>
'''
STATUS = open(os.path.join(HERE, 'status.txt'), encoding='utf-8').read().strip() if os.path.exists(os.path.join(HERE, 'status.txt')) else ''
page = PAGE.replace('__DATE__', datetime.date.today().strftime('%B %-d, %Y')).replace('__TOTALS__', json.dumps({'Rights': 101, 'Glossary': 158, 'Legal pages': 39})).replace('__STATUS__', STATUS)
if not STATUS:
    page = page.replace('<section class="panel" id="statusbox"', '<section class="panel" id="statusbox" hidden')
open(os.path.join(HERE, 'site', 'index.html'), 'w', encoding='utf-8').write(page)
