# ASC3ND Closeout Agent Loop

Use this file as the durable instruction for any agent working on the final 30-day ASC3ND closeout.

## Core loop
INTENT -> BAR -> LOCK -> EVIDENCE -> GRAPH -> SPEC -> SLICE -> BUILD -> VERIFY -> GAUNTLET -> RELEASE -> LEARN

## Per-node loop

1. READ
   - this run's STATE.md
   - PROJECT-LOCK.md
   - BAR.md
   - GRAPH.md
   - only files required by the current node

2. INSPECT
   - current repository/deployment/runtime before edits
   - current SHA
   - open PRs
   - blast radius
   - rollback

3. SPEC
   Write the smallest reversible slice with:
   - goal
   - files/systems touched
   - explicit non-goals
   - acceptance tests
   - proof source
   - rollback

4. BUILD
   One writer per artifact.
   Do not redesign.
   Do not create new repos.
   Do not add frameworks because they are interesting.
   Do not broaden scope during execution.

5. VERIFY
   Use a fresh verifier context when possible.
   Code/build/deploy is not enough.
   Verify actual behavior.

6. GAUNTLET
   Compare to:
   - COLLINS structural craft;
   - nonprofit funding/trust bar;
   - mobile/accessibility release gates;
   - owner/handoff bar.
   Record exact failures.

7. LOOP
   If a gate fails, reopen only the failed node/slice.
   Do not restart the whole project.
   Do not create parallel replacement implementations.

8. RELEASE
   Only after all relevant checks pass.
   Production/consequential actions stop at a human gate.
   End-state vocabulary:
   - NOT READY
   - READY FOR PREVIEW
   - PREVIEW VERIFIED
   - PRODUCTION VERIFIED

9. LEARN
   After each verified slice record:
   - decision
   - changes
   - proof
   - status
   - commercial impact
   - risks
   - rollback
   - next
   - human approval needed
   - reusable learning for the Social Purpose Launch System

## Priority algorithm
P0 safety/trust/release blockers first.
Then P1 funding/reliability.
Then handoff.
Then productization.
Polish never outranks proof.

## Automatic stop
Stop and escalate instead of guessing when a task needs:
- legal/tax truth;
- youth/media permission;
- safeguarding approval;
- owner credentials;
- production DNS;
- destructive archival;
- external grant submission;
- money;
- client communication not already approved.

## Current next node
A0_BASELINE.
