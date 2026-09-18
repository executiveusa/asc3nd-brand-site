# Rollback

## Code
Every implementation slice uses a branch/PR or a reversible commit.
Record pre-change SHA and post-change SHA.

## Public site
Before production cutover:
- record current DNS;
- record current production deployment;
- record canonical domain settings;
- preserve last known-good deployment URL.
Rollback = restore prior domain target/deployment and verify public runtime.

## Data
Do not perform destructive Supabase schema/data changes without backup/explicit migration plan.
Client submissions and evidence are protected assets.

## Media
Do not delete original Drive/R2/approved assets when changing delivery systems.
Adaptive video migration must retain source MP4 as rollback.

## Repositories
Do not delete history.
Archive only after dependency audit + owner approval.
If archived prematurely, unarchive and restore canonical documentation.

## Productization
Never move ASC3ND-specific confidential/tenant truth into reusable UJIMA or Grant Agent defaults.
Rollback = remove tenant-derived defaults and restore separation.
