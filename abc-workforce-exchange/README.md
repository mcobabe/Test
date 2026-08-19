# ABC NorCal Workforce Exchange

This repository contains the working browser prototype and the foundation for the production ABC NorCal Workforce Exchange application.

## Current goals

The platform is designed to be substantially self-managing:

- Candidates create and maintain their own workforce profiles.
- Candidate identity and contact details remain private until a paid member contact release.
- Available status expires automatically after 30 days unless renewed.
- Contact information is visible to a purchasing member for 72 hours only.
- Members search anonymous profiles by trade, level, project history, systems/materials, certifications, region and days available.
- Candidates maintain project-by-project experience records.
- Certificates and credentials require document uploads.
- Contractors can report inaccurate profile items and verify experience after hiring.
- ABC staff should handle only exception cases that automation cannot resolve.

## Browser prototype

Open `index.html` through a browser preview or GitHub Pages preview when enabled.

The current prototype includes:

- Public home page
- Candidate sign-up
- Candidate dashboard
- Project-by-project work experience
- Certification uploads
- Contractor worker search
- Advanced contractor search
- Anonymous candidate detail page
- Contact unlock checkout
- 72-hour contact access
- Contractor dashboard
- Member company administration
- Hiring request workflow
- Employer verification/evaluation
- Verification and correction center
- ABC administration dashboard
- Notification/workflow center
- Workforce AI concept screen

## Production architecture target

The production build should migrate the prototype to:

- Frontend: React / Next.js + TypeScript
- API: Next.js server routes or ASP.NET Core
- Database: PostgreSQL
- Authentication: secure email/password plus MFA and role-based access
- Payments: Stripe or equivalent
- Email/SMS: transactional provider with delivery logs
- File storage: private object storage for resumes and certificates
- Audit logging: immutable activity history for sensitive actions

## Roles

1. Candidate
2. Contractor Member User
3. Contractor Company Administrator
4. ABC Staff
5. ABC Administrator

## Core business rules

- Candidate public search records use anonymous candidate IDs.
- Candidate name, phone and email are never exposed in normal search results.
- Candidate must explicitly authorize contact sharing.
- Available status is valid for up to 30 days and must be renewed.
- Contact unlock pricing defaults to:
  - Standard candidate: $100
  - Foreman/Superintendent: $250
  - Executive/PM/Estimator: $500
- Paid contact information is visible for 72 hours, then locks automatically.
- Candidate project experience is stored by project, project duration, role, project type, and specific systems/materials personally worked on.
- Certificates/credentials have separate upload records.
- Employer reports should identify the specific disputed item.
- A single employer report should not automatically create a permanent negative record; material issues can temporarily hide a profile while clarification is requested.

## Next development milestones

1. Convert static prototype to React/TypeScript.
2. Implement PostgreSQL schema.
3. Add real authentication and role permissions.
4. Add candidate CRUD workflows.
5. Add contractor search and matching.
6. Add Stripe payment/contact unlock logic.
7. Add automated availability expiration and notification jobs.
8. Add document upload and verification workflows.
9. Add ABC exception dashboard and analytics.
10. Add production security testing and deployment configuration.
