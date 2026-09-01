# I — Identity

Identity is the durable person record. It must be boring, stable, and source-backed.

## Canonical objects
- `asc3nd.people`
- `asc3nd.person_sources`
- `asc3nd.identity_resolution_cases`
- `asc3nd.import_batches`
- `asc3nd.import_contacts_staging`

## Promotion rule
A staged contact becomes canonical only after the identity fields used for matching are verified.

## Merge rule
Allowed:
- exact verified email match;
- exact normalized phone match;
- explicit human confirmation.

Not allowed:
- fuzzy name similarity;
- shared household name alone;
- AI guess;
- photo/face similarity.

If email and phone point at different canonical people, create an identity-resolution case and do not silently merge.

## Sensitive-data rule
No biometric face embeddings or automated face identification. Approved photographs may be linked manually to known people only when appropriate consent/provenance exists.
