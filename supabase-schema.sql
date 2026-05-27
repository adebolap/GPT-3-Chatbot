create table if not exists conversations (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  model text,
  url text not null default '',
  title text,
  persona_name text,
  started_at bigint not null,
  synced_at timestamptz default now(),
  unique (user_id, url, started_at)
);

create index if not exists conversations_user_idx on conversations (user_id, started_at desc);

create table if not exists sync_tokens (
  user_id text primary key,
  token text not null unique,
  created_at timestamptz default now()
);

create table if not exists waitlist_emails (
  email text primary key,
  created_at timestamptz default now()
);
