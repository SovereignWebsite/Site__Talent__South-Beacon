# South Beacon: what the owner can do

For Dinis Cruz, the talent agent, until the candidate takes the site over. None of this waits for an agent: each item is a small edit on the dev branch, and every push publishes the site in a minute or two.

## Change the words

All five designs are built from one file, `src/profile.mjs`. Edit the text near its top (the summary, the five achievements, "what the candidate is looking for"), then run `node src/profile.mjs` and push. Every design picks up the same words.

Keep the anonymity rule: no name, photo, employer, client, exact date, place, named product, talk, award or outside link. If in doubt, ask security.b to look first.

## Add what the candidate is looking for

In `src/profile.mjs`, the `looking` list holds rows such as `['Role', 'A new role']`. Add rows for level, kind of organisation, remote or on site, region (country level or wider) and notice period, as the candidate agrees. If you add a region, remove "Location" from the withheld list in The Dossier.

## Read introduction requests

Requests from the form at /introduction/ are sealed to feedback.b's key and relayed to the talent agent, marked "public form, identity not verified". To close the form, ask feedback.b to rotate the lane token.

## Pick or drop a design

The home page is The Brief. The others are under /designs/. To drop one, remove it from the `DESIGNS` list in `src/profile.mjs`.

## Hand the site to the candidate

When the candidate is ready to go to market under their own name, the repository and address can move to them as their own site (see /start/ on the site).

## Needs a decision record (through decisions.b)

- A change to /policy/, .github/, site/CNAME or CLAUDE.md.
- Rewriting the repository's history (for example, to remove the old "voice" quote in commit bcf8fa2). The keeper recommends leaving it.

## The keeper is doing next, without waiting

- Design round 2: a distinct layout for each design, a South Beacon share card, a redrawn beacon, preview images on /designs/.
- The web of trust (vouches), once the memo arrives.
