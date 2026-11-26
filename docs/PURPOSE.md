# Anchor: purpose and rules

This is the standard every change is checked against. It is written from
Jessie's own words. If code, a design, or an AI suggestion conflicts with
this file, this file wins until Jessie says otherwise.

## Who it is for
Parents, youth aged 13 and older, and supporters going through California's
dependency court and child welfare system. Many are in crisis, carry trauma,
have limited education or a language barrier, or are in the system for the
first time.

## The problem it solves
There is no reliable, easy to reach blueprint for dependency court. The
information is scattered across pamphlets, court papers, conversations,
attorneys, caseworkers and advocates. Anchor puts it in one place, step by
step, so a person can understand where they are, keep their information
organized, track their case, and speak up for themselves. Jessie calls it a
"second brain" for before, during and after a court hearing.

## What it is not
- It does not give legal advice about a person's own case.
- It does not predict outcomes.
- It does not replace an attorney. It points people to one.

## How the app is laid out
1. A person who is not signed in sees the sign-in screen.
2. After sign-in comes intake, which is different for each role: parent,
   youth, supporter. Roles are always lowercase in code and data.
3. Intake must be finished before any tab opens.
4. Then a fixed header and five tabs: Home, Timeline, Contacts, Notes,
   Resources. Content is personal to the role.

## Rules
- Things that already work stay where they are. A design pass changes how a
  screen looks. It keeps the heart of the app and its features. It does not
  move, remove, or add functions.
- No new features without Jessie asking for them.
- Trauma-informed wording everywhere. Nonjudgmental. "Your child", "you have
  the right to". No legal jargon without a plain explanation next to it.
- Plain language at a 6th to 8th grade reading level.
- Low mental load. One clear thing per screen. Easy to use for everyone.
- Soft, warm, welcoming look. Soft mauve. Background #FDF9FF, purple accent
  #7C3AED. No alarming red warning treatments.
- The timeline follows California dependency milestones, changes with the
  person's role, and each item opens in place.
- Notes and contacts are private to the person and are core features.
- Rights information is fixed content that ships with the app. It is not
  limited by the person's profile.
- Forms and templates open California Judicial Council forms from Supabase
  or public links, in the browser.
- The language choice is remembered.
- Privacy signals are visible. People can tell their information is theirs.
- Anchor is separate from every other app. No shared code or data.
- Design changes go to the preview link first. Live changes need Jessie's OK.
- Edge functions are deployed through Supabase, never through git.

## Where the content comes from
Anchor's timeline, rights, legal pages and glossary must agree with the
official California sources. When Anchor and a source disagree, the source
wins and Anchor is corrected.
- Judicial Council parent handbook, "Juvenile Dependency Court and You":
  https://courts.ca.gov/publication/juvenile-dependency-court-and-you-guide-parents
- California Courts Self-Help, Juvenile Dependency (guides for parents,
  parents' right to be included, children and youth, relatives, the court
  orientation video, live chat): https://selfhelp.courts.ca.gov/juvenile-dependency
- Judicial Branch dependency page (includes Caregivers and the Courts):
  https://courts.ca.gov/programs-initiatives/families-and-children/juvenile-law/dependency
- Dependency Quick Guide. This is an attorney manual. Use it to check
  accuracy behind the scenes, never as something shown to parents.
- Welfare and Institutions Code sections 300 to 395, Judicial Council forms.
- Advokids, For Birth Parents: https://advokids.org/for-birth-parents/

Gaps found when these were first reviewed (Nov 2026), all built and
approved by Jessie on Nov 26, 2026:
- Relatives and close family friends: Legal Library page
- Court orientation video: link in the Legal Library
- Self-Help live chat: link in the Legal Library
- How a parent gets included in the case: Legal Library page

Accounts are for ages 13 and up. Youth sign-up asks age before an account
is made. Under 13 gets the /under-13 page and no account.

## Not built yet (do not describe as working)
- Spanish (planned for year two)
- County search
