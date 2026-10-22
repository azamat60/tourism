create policy tourism_staff_private on tourism_private.staff for all to anon,authenticated using(false) with check(false);
create policy tourism_invites_private on tourism_private.invites for all to anon,authenticated using(false) with check(false);
alter table public.tourism_content add constraint tourism_core_published check(kind not in ('page','settings') or published);
