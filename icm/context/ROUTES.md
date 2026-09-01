# C — Context routing matrix

Context determines which ASC3ND team/lane owns follow-up. One person can occupy multiple routes without duplicating identity.

| Route | ICM folder | Intake mapping | Primary owner |
|---|---|---|---|
| Family | `C/participation/family` | `interest=attend` | program manager / event staff |
| Updates | `C/participation/updates` | `interest=updates`; legacy `general`; preference `event-updates` | communications manager |
| Volunteer | `C/participation/volunteer` | `interest=volunteer`; preference `volunteer` | volunteer coordinator |
| Mentor | `C/participation/mentor` | `interest=mentor` | volunteer coordinator / program manager |
| Supplies | `C/participation/supplies` | `interest=supplies`; preference `supplies` | volunteer coordinator |
| Sponsor | `C/participation/sponsor` | `interest=sponsor` | program manager / communications manager |
| Partner | `C/participation/partner` | `interest=partner`; legacy `partner` | program manager |

## Route behavior

Every new canonical RSVP creates:
1. a person/source link in Identity;
2. source-backed event context;
3. one primary `person_routes` record;
4. additional routes for selected preferences;
5. a follow-up task for the primary route;
6. event-specific consent proof for available contact channels.

## Legacy port mapping

Legacy `public.rsvps` becomes canonical `asc3nd.event_rsvps` with `interest=attend`.

Legacy `public.supporters.participation` maps:
- `volunteer` → `volunteer`
- `supplies` → `supplies`
- `partner` → `partner`
- `general` → `updates`

Legacy RSVP fields preserved in canonical schema:
- confirmation code
- age range
- arrival window
- requested service
- private-contact flag
- language
- updates/preferences
- attendance lifecycle status

## Processing boxes

The UI may present these as separate boxes/queues, but the database must not create separate person copies. Queues are projections of `person_routes` + `followup_tasks`.
