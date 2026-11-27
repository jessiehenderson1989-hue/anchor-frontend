# How information gets into Anchor

Anchor tells families what their rights and deadlines are. A wrong sentence can cost someone a hearing or a right. These rules apply to every right, glossary term, legal page, Timeline step, checklist step and translation, whoever writes it.

1. **Source first, then the sentence.** Open the statute, court rule, form or official guide before writing. Write the sentence from what the source says. Never write from memory and look for a citation afterward.
2. **Every entry carries its source.** The exact section, rule or form goes in the entry's source field. "Best practice" or "general principle" is not a source.
3. **The writer does not check their own work.** Before anything is shown, `content-fact-checker` reads it against the source, statement by statement. It did not write it and it starts from the assumption that it is wrong.
4. **Not confirmed means not shown.** If a statement cannot be confirmed, it is left out or the entry stays hidden. No softened guess takes its place. "Could not verify" is an acceptable answer. A plausible sentence is not.
5. **The simple line is checked too.** A simpler sentence that drops a condition ("free", "always", "must") is a different claim and gets its own check.
6. **One fact, one wording.** When a fact changes in one place, `content-consistency-checker` finds every other place it appears, including the Spanish.
7. **Nothing made up fills a gap.** No sample data, placeholder text, invented quotes or default text a person can see. `filler-sweeper` runs before every release.
8. **Spanish follows English.** Any English change is followed by `spanish-checker` on the same entries.
9. **A lawyer has the last word.** The checkers lower the error rate. They do not replace review by a California dependency attorney.
10. **Recheck on a schedule.** The law check runs every January and September. The line on the Legal screen shows the month of the last full review.

Order of work for any content change: source, write, fact check, consistency check, Spanish check, then live.
