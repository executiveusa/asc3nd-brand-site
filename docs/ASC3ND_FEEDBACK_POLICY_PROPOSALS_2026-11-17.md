# ASC3ND — website feedback stack and counsel-review proposals (2026-11-17)

**Approval boundary:** Numbers 2–3 are CSS/navigation fixes on this PR. Number 1 is explicitly *not* a homepage removal: the client spoke about the Story page, and the homepage retains both founders. Numbers 5–7 are legal review proposals **only**; no new legal assertion is published. Number 8 is a separate client review-document action after approval.

## 1. Founders — correct scope, no homepage removal
- Client attachment `Asc3nd Website Updates 11.12.26.docx`, Story p.2: “Can you reduce the size of Otha’s photo and enlarge the wording. I’d rather see the words more than the photo.” “Please remove my photo for now (side note: desktop version doesn’t have my quoted commentary).” “Replace using images from the event. More visual storytelling images.”
- **Implementation:** Keep both Otha and Elisha, each with their picture and quote, on the **homepage**. Story already renders Otha's portrait as the smaller supporting element and larger text. Elisha's Story portrait remains hidden. Her quote remains in the data; any change to its public Story placement requires a distinct decision.
- **Acceptance:** Desktop and mobile homepage each still display two founders; Story displays only Otha portrait and quote. No existing quote or image is deleted from the content registry.

## 2. Events typography
- Use a shared `events-section-heading` scale for “Current & Upcoming Initiatives” and “Past Events & Community Impact” on desktop and all responsive breakpoints.
- Acceptance: computed font-size, line-height, letter-spacing and weight match at 320, 390, 768, 1440px without horizontal overflow.

## 3. Footer email / giving
- Stack the `main@asc3nd.org` mailto link and Zeffy button vertically with responsive spacing; preserve the currently authorized donation destination (do not invent a campaign URL).
- Mailto uses a populated subject to open the visitor's **configured email app**; this cannot prove that an external email was subsequently sent.
- Acceptance: minimum 12px actual spacing at 320–1440px, valid mailto with subject, no clipped CTA.

## 4. Contact confirmation / Resend evidence
- Public contact form POSTs to `/api/participation/submit`; on confirmed DB acceptance it shows “Thank you. Your message was received.” This is an **intake acknowledgement**, not proof of email delivery to the user.
- Supabase Edge Function `asc3nd-site-notifications` (active v6 inspected) claims queued notifications, sends them to Resend using an idempotency key, and has a distinct `participation_ack` message intended for the submitter.
- Resend account domain `asc3nd.org`: sending enabled, partially verified, inbound receiving disabled. DNS MX points to external Hostinger mail servers. Resend has recent **delivered** website intake and acknowledgement test emails, but a true independent end-to-end production test for a non-test submitter is still required.
- Do **not** change authenticated Supabase triggers, secrets, webhooks, email domains, recipient lists, or production database in this PR.
- A failed outbound email must not turn a saved request into a false submission failure. A saved request must never be portrayed as a delivered confirmation email.
- Next verification: controlled opted-in adult test submission, check on-page success, database queued/sent states, corresponding Resend message and mailbox receipt, then delete test content according to approved policy.

## 5. Organizational classification and donation disclosures — request approval/evidence before copy
- State incorporation is **not** IRS exemption. Federal income tax exemption usually requires recognition by the IRS, except certain exceptions. Washington charities registration is a **third** inquiry: whether charitable solicitations registration applies and what disclosure applies.
- Website currently prints Washington nonprofit corporation / UBI 606 247 629 in its footer and a limited transparency notice. We have not independently authenticated the corporate filing and IRS determination from official records.
- **New IRS-derived public evidence:** both ProPublica Nonprofit Explorer and philanthropy.org independently list **The Asc3nd Collective**, **EIN 42-3010954**, as a **501(c)(3)** with tax-exemption issued **June 2026** and contributions described as deductible. These are persuasive public sources derived from IRS Business Master File / Publication 78, but are **secondary**; verify with the official IRS Tax Exempt Organization Search by EIN and the determination letter before making a new legal representation on the website. No change to public tax/deduction statements in this PR. See https://projects.propublica.org/nonprofits/organizations/423010954 and https://philanthropy.org/990/report/423010954/the-asc3nd-collective.
- Prior to a donation CTA identifying an actual recipient, verify the Zeffy campaign legal beneficiary and, where applicable, RCW 19.09.100 Washington solicitation disclosures. Do not equate SOS registration with state endorsement.
- **Client request:** corporate filing/status (UBI), charity registration or documented exemption, EIN and IRS determination letter/status, fiscal sponsor agreement if donations are handled under one, correct legal donation recipient and approved campaign link.

Primary law / official lookup:
- https://www.irs.gov/charities-non-profits/federal-tax-obligations-of-nonprofit-corporations
- https://www.irs.gov/charities-non-profits/search-for-tax-exempt-organizations
- https://www.sos.wa.gov/corporations-charities/frequently-asked-questions-faqs/charitable-organizations-frequently-asked-questions
- https://ccfs.sos.wa.gov/
- https://app.leg.wa.gov/rcw/default.aspx?cite=19.09.100
- https://app.leg.wa.gov/rcw/default.aspx?cite=19.09.065

## 6. Privacy page — proposed text and obligations (NOT published)

**Proposed heading:** How we use the information you share.

**Proposed introduction:**
> When you contact ASC3ND Collective through our website, we use the information you provide to respond to your request, connect you with the appropriate team, and send community updates only when you separately ask to receive them. We aim to collect only information needed for those purposes.

**Information shared through forms**
> Depending on the form, we receive your name, email address, optional phone number, organization or participation interest, message, and your contact or subscription preferences. Please do not include a child's name, school, medical information, health history, financial credentials or other sensitive details in a public form. Our website host and service providers may also process technical connection and security information to operate and protect the site.

**How it is used and who handles it**
> We use your information to respond to inquiries and manage community participation. Website submissions are processed by our service providers for site hosting, secure intake storage, and transaction-related email delivery. Receiving general community updates is a separate choice, which you can withdraw. We do not use a website form submission as permission to publish anyone's story or photograph.

**Local drafts**
> If you begin a participating form and do not submit it, your browser may retain a draft on that device. You can clear that draft by clearing the site's local browser data. ASC3ND does not receive a locally saved draft unless you submit it.

**Retention — counsel and implementation approval required**
> We keep information for the purpose for which it was provided and for any additional period required by applicable law, legitimate records obligations, or an active legal hold. Website inquiry records are managed separately from nonprofit corporate, accounting, and charitable solicitation records. You may contact us about information you submitted, including to ask for correction or deletion; some records cannot be removed immediately when retention is legally required.

**Contact**
> For questions about website information or to request correction or deletion, write to main@asc3nd.org. Please use a separate secure channel for any sensitive information and do not include private details about a child in your initial email.

**Important legal distinction:** Washington does not specify one universal public posting or retention term for ordinary nonprofit website contact submissions. RCW 24.03A.210 requires permanent retention of specified corporate minutes/actions and a current copy of certain records including past **six years** of member communications; these are **not** automatically a six-year website contact retention mandate. If subject to charitable registration, RCW 19.09.200 requires relevant books/records for at least **three years** after the applicable period, not every website contact for three years. If the organization collects regulated consumer health data, RCW 19.373.020/.030/.040 can impose substantial additional privacy notice/consent/rights duties; do not rely on a generic website privacy page alone. Washington RCW 19.255.010 addresses certain breach notices.

**Before publication**, verify and approve: actual categories logged (including analytics/cookies), stored fields and processors, privacy request process, operational deletion mechanism, retention schedule by category, subscription unsubscribe functionality, whether any consumer health data is collected or inferred, and photo consent handling. No arbitrary website-data deadline should be called a Washington-law requirement.

Primary sources:
- https://app.leg.wa.gov/RCW/default.aspx?cite=24.03A.210
- https://app.leg.wa.gov/rcw/default.aspx?cite=19.09.200
- https://app.leg.wa.gov/RCW/default.aspx?cite=19.373.020
- https://app.leg.wa.gov/RCW/default.aspx?cite=19.373.030
- https://app.leg.wa.gov/RCW/default.aspx?cite=19.373.040
- https://app.leg.wa.gov/RCW/default.aspx?cite=19.255.010

## 7. Youth safety page — proposed text and obligations (NOT published)

**Proposed heading:** Youth safety starts with clear ways to reach us.

**Introduction**
> ASC3ND welcomes families, volunteers, mentors, and community partners. Our public website provides information and an intake route for adults; it is not a private messaging service for children or a channel for emergency response.

**Protect children's information**
> Parents and guardians should submit general participation inquiries. Please do not include a child's name, school, date of birth, medical information, private family history, or details of a safety incident in public website forms. ASC3ND will arrange a more appropriate method if additional information is necessary.

**Concerns and reporting**
> If a child is in immediate danger, call 911. To report suspected child abuse or neglect in Washington, contact the Washington Department of Children, Youth, and Families at 1-866-ENDHARM (1-866-363-4276), or the appropriate law-enforcement agency. Do not rely on a website form for an urgent safety report. Questions about this website or a photograph can be sent to main@asc3nd.org, but email is not monitored as an emergency line.

**Adult roles and safeguards**
> Washington law imposes child-abuse reporting duties on specified professionals and, in certain circumstances, supervisors of nonprofit personnel who work with children. Additional rules may apply to screening people who will have regular unsupervised access to children. ASC3ND maintains its program-specific participation, supervision, screening, and reporting procedures separately from this website notice. [Only keep this final sentence after policies are documented and approved; otherwise refer to management for current procedures.]

**Photographs and stories**
> Contact main@asc3nd.org if you believe a photograph, name or story involving a child was published without appropriate permission. We will review the concern using our media consent and safeguarding process. Website feedback forms are not substitutes for permission from a parent or guardian where it is legally required.

**Legal nuance:** RCW 26.44.030 defines specific mandatory reporting roles, including some nonprofit supervisors; it does **not** turn every volunteer into a mandated reporter just because the organization is a nonprofit. RCW 43.43.830/.832 should be reviewed for screening rules applicable to the actual program and supervision model. The FTC COPPA rules generally apply to commercial entities within FTC jurisdiction; the FTC notes an exemption for qualifying nonprofit entities under Section 5 FTC Act, so do not claim without analysis that COPPA necessarily applies to this organization, but do avoid collecting minors' information on public forms.

Primary sources:
- https://app.leg.wa.gov/rcw/default.aspx?cite=26.44.030
- https://www.dcyf.wa.gov/safety/mandated-reporter
- https://app.leg.wa.gov/RCW/default.aspx?cite=43.43.830
- https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions

## 8. Move verified client needs to the final review section
The original client email of November 13 + 13-page attachment asks for an accurate legal name/registration/nonprofit statement on p.6, Project Joy participation/donation details on pp.8–10, and use of a direct campaign link. It does **not** supply an EIN, IRS determination letter, charity registration certificate, confirmed tax deductibility, fixed website retention schedule, child safeguarding policy, official Zeffy campaign link, or an explicit legal/consent contact.
The existing review flipbook already has a grouped “Needed From ASC3ND” ending. Proposed next update after approval: include the legal/tax evidence, status/deductibility wording, privacy data retention approval, youth-safeguarding process owner, and donation beneficiary/link in that ending. Do not invent approvals or publish tax claims.

## Gate and rollback
- **Website UI fixes:** pending independent PR checks and real desktop/mobile visual proof; retain approved homepage, footer brand and domain behavior.
- **Privacy/Youth Safety:** proposals only; no public policy page changes until owner reviews each numbered item and confirms operations match claims.
- **Rollback:** revert this UI PR without altering database, Resend domain, emails, donations, DNS, or legal statements.
