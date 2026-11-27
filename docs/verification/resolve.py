# Turns the fixers' change logs into the "what was done" line for each proof record.
import json, glob, os
res = json.load(open('resolutions.json')) if os.path.exists('resolutions.json') else {}
stats = {}
for f in sorted(glob.glob('changes_*.jsonl')):
    for line in open(f, encoding='utf-8'):
        line = line.strip()
        if not line: continue
        try: c = json.loads(line)
        except Exception: stats['bad'] = stats.get('bad', 0) + 1; continue
        k = c.get('key'); a = str(c.get('action', '')).lower(); after = str(c.get('after') or '').strip(); note = str(c.get('note') or '').strip()
        if not k or str(c.get('field', '')).startswith('spanish'): continue
        stats[a] = stats.get(a, 0) + 1
        if a == 'replaced': txt = 'Corrected on November 27, 2026. It now reads: ' + after
        elif a == 'removed': txt = 'Removed from the app on November 27, 2026.'
        elif a == 'citation': txt = 'Citation corrected on November 27, 2026 to: ' + after
        elif a == 'already_changed': txt = 'Already corrected before this pass.'
        else: txt = 'Still open: ' + (note or 'not changed yet')
        if k in res and res[k].startswith('Corrected in the app') : continue
        res[k] = txt
json.dump(res, open('resolutions.json', 'w'), indent=1, ensure_ascii=False)
print(len(res), 'resolutions', stats)
