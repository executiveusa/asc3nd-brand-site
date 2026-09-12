# ASC3ND Current Wave — 1 through 10

The next-wave fundraising/operations document exists at `docs/ASC3ND_NEXT_WAVE.md`, but it is intentionally queued behind this proof-build wave.

| # | Work | Status | Evidence / next dependency |
|---|---|---|---|
| 1 | Lock founders | COMPLETE | Otha and Elisha portraits are merged on `main`, mapped to their correct founder slots. |
| 2 | Build reusable project proof gallery | COMPLETE IN REVIEW | `ProjectProofGallery` provides a restrained responsive grid and keyboard-accessible lightbox. The pattern is reusable for any ASC3ND project. |
| 3 | Make Community Cuts Project 001 | COMPLETE IN REVIEW | `lib/projects.ts` defines the reusable project model and Community Cuts as the first project. |
| 4 | Add featured Community Cuts proof to homepage | STRUCTURE COMPLETE / MEDIA PENDING | Homepage now reads Project 001 from the project model and renders its approved media. No project media has been supplied/approved yet. |
| 5 | Build full Community Cuts project page | COMPLETE IN REVIEW | `/projects/community-cuts` holds project identity, proof gallery, outcomes, and next-action structure. |
| 6 | Add protected staff project-media intake | PARTIAL / SAFE STAGING COMPLETE | Staff page now includes a Community Cuts media intake workbench that inventories selected files and exports a manifest. It deliberately does not publish or persist files until dedicated media storage and access rules are approved. |
| 7 | Establish large-video storage path | ARCHITECTURE COMPLETE / PROVIDER PENDING | Large masters must not go in GitHub. `docs/COMMUNITY_CUTS_MEDIA_WORKFLOW.md` defines source-video, clips, thumbnails, and derived-web-asset handling. A dedicated streaming/storage provider still needs to be authorized/configured. |
| 8 | Extract a first batch of event stills | TOOLING COMPLETE / SOURCE VIDEO NEEDED | `scripts/extract-event-stills.sh` provides repeatable FFmpeg extraction. LosslessCut is also appropriate for manual frame selection. No Community Cuts master video was attached to this workstream, so no event frames can truthfully be produced yet. |
| 9 | Add staggered diagonal footer arrows | COMPLETE IN REVIEW | Founders, Community, Take part, and Donate now share the diagonal-arrow treatment with restrained desktop/mobile staggering. |
| 10 | Move into “What Comes Next” | BLOCKED BY PROOF POPULATION | Do not promote a next-program story until Community Cuts has real approved photos/video and at least the verified facts ASC3ND wants to publish. |

## Release gate

Do not mark the current wave complete until Community Cuts has real approved proof in the gallery, the project page has been visually reviewed on mobile/desktop, and the organization has confirmed any participant consent needed for public media.

When that gate is passed, bring forward `docs/ASC3ND_NEXT_WAVE.md` and begin the nonprofit visibility, donor, grant, sponsorship, governance, and fundraising operating system.
