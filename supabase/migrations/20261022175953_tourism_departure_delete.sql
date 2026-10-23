grant delete on public.tourism_content to authenticated;

create policy tourism_departure_delete on public.tourism_content
for delete to authenticated
using (
  kind = 'departure'
  and (select tourism_private.staff_role()) in ('admin', 'editor')
);

create function tourism_private.track_content_delete()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.tourism_activity(actor, entity, record_id, action)
  values (auth.uid(), tg_table_name, old.id, 'delete');
  return old;
end;
$$;
revoke all on function tourism_private.track_content_delete() from public;

create trigger tourism_content_deleted after delete on public.tourism_content
for each row execute function tourism_private.track_content_delete();
