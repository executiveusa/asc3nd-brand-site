# ASC3ND Anti-Slop Release Policy

ASC3ND uses [The Extractor](https://github.com/executiveusa/the-extractor) as a machine gate and a human reduction discipline.

## Machine gate
- Source: `executiveusa/the-extractor`
- Pinned commit: `ea3df3e9e31bad432d2a3e15011d8a3dbccad621`
- Strict rule: zero high-severity findings.
- Medium findings must be fixed or justified in the release record.

## Human rule
A machine pass does not approve copy by itself. Reviewers must still protect:
- founder-authored language;
- verified legal and organizational facts;
- meaningful uncertainty;
- youth-safety and privacy requirements;
- Community Cuts evidence and provenance;
- obvious next actions;
- accessibility and error recovery.

Do not claim that text was AI-written from style alone. The Extractor is an anti-pattern and reduction system, not an authorship detector.

## Release sequence
1. Freeze the source and deployed SHA.
2. Run The Extractor.
3. Delete or reduce anything that does not earn its place.
4. Replace claims only with verified evidence.
5. Run mobile/accessibility/build checks.
6. Independent human review.
7. Release only with rollback.
