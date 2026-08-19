-- ABC NorCal Workforce Exchange - initial PostgreSQL schema

create extension if not exists pgcrypto;

create type user_role as enum ('candidate','contractor_user','company_admin','abc_staff','abc_admin');
create type candidate_status as enum ('available','employed','inactive','under_review');
create type skill_level as enum ('apprentice','journeyman','foreman','superintendent','project_manager','estimator','executive');
create type verification_status as enum ('unverified','pending','verified','needs_correction','rejected');
create type recruiting_stage as enum ('saved','contacted','interviewing','offer_made','hired','not_selected');

create table users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text,
  role user_role not null,
  phone text,
  mfa_enabled boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  abc_member_number text unique,
  membership_active boolean not null default false,
  membership_expires_at timestamptz,
  cslb_number text,
  dir_registration text,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  postal_code text,
  phone text,
  website text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table company_users (
  company_id uuid not null references companies(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  title text,
  permissions jsonb not null default '{}'::jsonb,
  is_company_admin boolean not null default false,
  primary key (company_id,user_id)
);

create table candidates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references users(id) on delete cascade,
  public_candidate_number text not null unique,
  full_name text not null,
  city text,
  state text,
  postal_code text,
  primary_trade text not null,
  secondary_trade text,
  level skill_level not null,
  total_construction_years numeric(5,2),
  trade_years numeric(5,2),
  region text,
  travel_radius_miles integer,
  status candidate_status not null default 'inactive',
  availability_started_at timestamptz,
  availability_expires_at timestamptz,
  automatic_contact_release boolean not null default false,
  profile_complete_percent integer not null default 0 check (profile_complete_percent between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_candidates_search on candidates(primary_trade,level,status,region);
create index idx_candidates_available_until on candidates(availability_expires_at) where status='available';

create table apprenticeship_records (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references candidates(id) on delete cascade,
  provider text,
  trade text,
  term_months integer,
  start_date date,
  completion_date date,
  completion_status text,
  current_period text,
  verification_status verification_status not null default 'unverified',
  created_at timestamptz not null default now()
);

create table experience_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

insert into experience_categories(name) values
('Commercial'),('Residential'),('Public Works'),('Industrial'),('Medical'),('Schools'),('Utilities'),('Tenant Improvement'),('Service')
on conflict do nothing;

create table candidate_projects (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references candidates(id) on delete cascade,
  experience_category_id uuid references experience_categories(id),
  project_name text not null,
  project_type text,
  city text,
  state text,
  owner_name text,
  general_contractor text,
  candidate_employer text,
  role_title text,
  start_date date,
  end_date date,
  months_on_project numeric(6,2),
  project_size_description text,
  responsibilities text,
  verification_status verification_status not null default 'unverified',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table skills (
  id uuid primary key default gen_random_uuid(),
  trade text,
  category text,
  name text not null,
  unique(trade,name)
);

create table candidate_project_skills (
  candidate_project_id uuid not null references candidate_projects(id) on delete cascade,
  skill_id uuid not null references skills(id) on delete restrict,
  notes text,
  primary key(candidate_project_id,skill_id)
);

create table credentials (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  trade text,
  expires boolean not null default false
);

create table candidate_credentials (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references candidates(id) on delete cascade,
  credential_id uuid not null references credentials(id) on delete restrict,
  credential_number text,
  issued_at date,
  expires_at date,
  file_storage_key text,
  file_name text,
  verification_status verification_status not null default 'unverified',
  verified_at timestamptz,
  verified_by uuid references users(id),
  unique(candidate_id,credential_id,credential_number)
);

create table hiring_requests (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  created_by uuid not null references users(id),
  position_title text not null,
  trade text not null,
  level skill_level,
  number_needed integer not null default 1,
  project_name text,
  project_location text,
  start_date date,
  end_date date,
  continuous_hiring boolean not null default false,
  pay_min numeric(12,2),
  pay_max numeric(12,2),
  requirements jsonb not null default '{}'::jsonb,
  is_open boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table saved_searches (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  name text not null,
  filters jsonb not null,
  notifications_enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create table candidate_contact_unlocks (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references candidates(id),
  company_id uuid not null references companies(id),
  purchased_by uuid not null references users(id),
  amount_cents integer not null,
  payment_provider text,
  payment_reference text,
  unlocked_at timestamptz not null default now(),
  expires_at timestamptz not null,
  refunded_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_unlock_company_expiry on candidate_contact_unlocks(company_id,expires_at);

create table recruiting_pipeline (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  candidate_id uuid not null references candidates(id),
  hiring_request_id uuid references hiring_requests(id) on delete set null,
  stage recruiting_stage not null default 'saved',
  notes text,
  updated_by uuid references users(id),
  updated_at timestamptz not null default now(),
  unique(company_id,candidate_id,hiring_request_id)
);

create table employer_verifications (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references candidates(id),
  company_id uuid not null references companies(id),
  submitted_by uuid not null references users(id),
  hired boolean,
  employment_start date,
  employment_end date,
  position_title text,
  would_hire_again text,
  private_comments text,
  observed_skills jsonb not null default '{}'::jsonb,
  ratings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table profile_reports (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references candidates(id),
  reported_by_company_id uuid references companies(id),
  reported_by_user_id uuid references users(id),
  item_type text not null,
  item_id uuid,
  reason text not null,
  severity text not null default 'normal',
  status text not null default 'open',
  candidate_response text,
  resolution text,
  resolved_by uuid references users(id),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  type text not null,
  channel text not null,
  subject text,
  body text not null,
  status text not null default 'queued',
  scheduled_at timestamptz,
  sent_at timestamptz,
  opened_at timestamptz,
  created_at timestamptz not null default now()
);

create table audit_log (
  id bigserial primary key,
  actor_user_id uuid references users(id),
  company_id uuid references companies(id),
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  ip_address inet,
  created_at timestamptz not null default now()
);

-- Business-rule helper: candidate availability expires 30 days after activation.
create or replace function activate_candidate(candidate_uuid uuid)
returns void language plpgsql as $$
begin
  update candidates
  set status='available',
      availability_started_at=now(),
      availability_expires_at=now()+interval '30 days',
      updated_at=now()
  where id=candidate_uuid;
end $$;

-- Business-rule helper: 72-hour paid contact window.
create or replace function contact_access_active(unlock_uuid uuid)
returns boolean language sql stable as $$
  select exists(
    select 1 from candidate_contact_unlocks
    where id=unlock_uuid and refunded_at is null and now() < expires_at
  );
$$;
