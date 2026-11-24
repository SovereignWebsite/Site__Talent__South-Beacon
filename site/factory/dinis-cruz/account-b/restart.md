# south-beacon.b: restart

A fresh session continues from START.md at the root of SovereignWebsite/Site__Talent__South-Beacon. Short form:

1. Clone the repository (dev branch) and read CLAUDE.md, docs/owner.md and this area.
2. Make your own key (`sgit pki keygen --label south-beacon.b`), publish only its public half at site/keys/<name>.json in a commit of its own, signed with it. Never print or commit the private half.
3. Rebuild with `node src/profile.mjs`; run the checks in START.md before every push; push to dev only.
4. Update agent.json and now.md at every wake.
