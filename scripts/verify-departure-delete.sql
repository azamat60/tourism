begin;

select set_config('request.jwt.claims', jsonb_build_object(
  'sub', (select user_id from tourism_private.staff where role = 'admin' limit 1),
  'role', 'authenticated'
)::text, true);

insert into public.tourism_content(id, kind, slug, data, published) values
  ('qa:delete-admin', 'departure', 'qa-delete-admin', '{"maxPeople":6,"peopleBooked":0}', false),
  ('qa:delete-editor', 'departure', 'qa-delete-editor', '{"maxPeople":6,"peopleBooked":0}', false),
  ('qa:delete-booked', 'departure', 'qa-delete-booked', '{"maxPeople":6,"peopleBooked":0}', false),
  ('qa:delete-page', 'page', 'qa-delete-page', '{}', true);

insert into public.tourism_bookings(
  id, departure_id, travelers, form, receipt, token_hash, waiver_version, policy_snapshot
) values (
  gen_random_uuid(), 'qa:delete-booked', 1, '{}', '{}', 'qa-only', 'qa-only', '{}'
);

set local role authenticated;
do $test$
declare changed int;
begin
  assert public.tourism_staff_role() = 'admin', 'Administrator missing';
  delete from public.tourism_content where id = 'qa:delete-admin' and version = 99;
  get diagnostics changed = row_count;
  assert changed = 0, 'Stale delete removed record';
  delete from public.tourism_content where id = 'qa:delete-admin' and version = 1;
  get diagnostics changed = row_count;
  assert changed = 1, 'Administrator cannot delete departure';
  assert exists (
    select 1 from public.tourism_activity
    where record_id = 'qa:delete-admin' and action = 'delete' and actor = auth.uid()
  ), 'Deletion audit missing';
  delete from public.tourism_content where id = 'qa:delete-page';
  get diagnostics changed = row_count;
  assert changed = 0, 'Core page deleted';
  begin
    delete from public.tourism_content where id = 'qa:delete-booked';
    raise exception 'Booked departure deleted';
  exception when foreign_key_violation then null;
  end;
end;
$test$;

reset role;
update tourism_private.staff set role = 'manager'
where user_id = (current_setting('request.jwt.claims')::jsonb->>'sub')::uuid;
set local role authenticated;
do $test$
declare changed int;
begin
  delete from public.tourism_content where id = 'qa:delete-editor';
  get diagnostics changed = row_count;
  assert changed = 0, 'Manager deleted departure';
end;
$test$;

reset role;
update tourism_private.staff set role = 'editor'
where user_id = (current_setting('request.jwt.claims')::jsonb->>'sub')::uuid;
set local role authenticated;
do $test$
declare changed int;
begin
  delete from public.tourism_content where id = 'qa:delete-editor';
  get diagnostics changed = row_count;
  assert changed = 1, 'Editor cannot delete departure';
end;
$test$;

reset role;
select set_config('request.jwt.claims', jsonb_build_object('sub', gen_random_uuid(), 'role', 'authenticated')::text, true);
set local role authenticated;
do $test$
declare changed int;
begin
  delete from public.tourism_content where id = 'qa:delete-booked';
  get diagnostics changed = row_count;
  assert changed = 0, 'Non-staff user deleted departure';
end;
$test$;

reset role;
set local role anon;
do $test$
begin
  begin
    delete from public.tourism_content where id = 'qa:delete-page';
    raise exception 'Anonymous delete allowed';
  exception when insufficient_privilege then null;
  end;
end;
$test$;
reset role;
rollback;

select 'Departure deletion, version check, audit, booking protection and role restrictions passed; fixtures rolled back.' as verified;
