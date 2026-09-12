# ASC3ND Project Media Workflow

Community Cuts for Kids is Project 001 and the reference implementation for every future ASC3ND project.

## Project structure

Use one project record and one media collection per project. Do not create one-off page structures for each event.

Suggested public path:

`/projects/community-cuts`

Suggested source-media organization:

`project-media/community-cuts/photos/`

`project-media/community-cuts/clips/`

`project-media/community-cuts/source-video/`

`project-media/community-cuts/thumbnails/`

Each public media item should have: project slug, media type, source URL/path, alt text, optional caption, optional credit, featured flag, approval state, and consent-confirmed state.

## What belongs on the homepage

Keep the homepage focused. Show a small editorial selection of the strongest approved Community Cuts media and link to the full project page. The full project page can carry the deeper proof record without turning the homepage into an archive.

## Photos

Approved still photographs can be optimized to WebP/AVIF for the site. Keep the original source files outside the Git repository. Only site-ready derivatives should be committed when direct object-storage delivery is not configured.

## Large event video

Do not commit a large master video into GitHub. Preserve the master in dedicated media storage. The public site should use either an adaptive-streaming provider or a web-optimized derivative/clip rather than serving the production master.

Until dedicated ASC3ND media storage is configured, treat large source videos as intake assets: keep them outside the repo, create a project manifest, extract approved stills/clips, and publish only the derived web assets.

## Frame extraction

Use LosslessCut or FFmpeg to pull clean source-resolution stills from event video. A repository helper script is provided at `scripts/extract-event-stills.sh` for repeatable extraction when the source video is locally available.

Suggested workflow:

1. Put the master video in a local working folder outside the repo.
2. Scrub or review the video and note candidate timestamps.
3. Export source-resolution stills.
4. Reject blurry, repetitive, unflattering, privacy-sensitive, or unapproved frames.
5. Confirm consent for identifiable participants.
6. Optimize selected images for web delivery.
7. Add approved items to the project media registry.
8. Publish to the project gallery.

## Human approval gate

Nothing becomes public until the organization confirms that the media is appropriate to publish and consent/release requirements are satisfied. Youth media receives the highest scrutiny.
