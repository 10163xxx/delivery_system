create table if not exists demo_notes (
  id uuid primary key,
  title varchar(120) not null,
  body text not null,
  status varchar(32) not null check (status in ('draft', 'published')),
  created_at timestamptz not null
);

comment on table demo_notes is 'JDBC + PostgreSQL sample table';
comment on column demo_notes.id is 'Business primary key';
comment on column demo_notes.title is 'Note title';
comment on column demo_notes.body is 'Note body';
comment on column demo_notes.status is 'Note status';
comment on column demo_notes.created_at is 'Creation timestamp';
