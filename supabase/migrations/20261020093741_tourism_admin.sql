create schema if not exists tourism_private;
revoke all on schema tourism_private from public;
grant usage on schema tourism_private to anon, authenticated;

create table public.tourism_content (
  id text primary key,
  kind text not null check (kind in ('tour','departure','post','faq','page','settings')),
  slug text not null,
  data jsonb not null,
  translations jsonb not null default '{}',
  published boolean not null default false,
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(kind, slug),
  check (jsonb_typeof(translations) = 'object'),
  check (kind <> 'departure' or ((data->>'maxPeople')::int between 1 and 100 and (data->>'peopleBooked')::int between 0 and (data->>'maxPeople')::int))
);
create index tourism_content_published_idx on public.tourism_content(kind, published);
create table tourism_private.staff (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check(role in ('admin','editor','manager'))
);
create table tourism_private.invites (
  email text primary key, role text not null check(role in ('admin','editor','manager'))
);
alter table tourism_private.staff enable row level security;
alter table tourism_private.invites enable row level security;

create function tourism_private.staff_role() returns text language sql stable security definer set search_path = '' as $$
  select s.role from tourism_private.staff s join auth.users u on u.id = s.user_id
  where s.user_id = (select auth.uid()) and u.email_confirmed_at is not null
$$;
revoke all on function tourism_private.staff_role() from public;
grant execute on function tourism_private.staff_role() to authenticated;
create function public.tourism_staff_role() returns text language sql stable security invoker set search_path = '' as $$
  select tourism_private.staff_role()
$$;
revoke all on function public.tourism_staff_role() from public;
grant execute on function public.tourism_staff_role() to authenticated;

create function tourism_private.assign_staff() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into tourism_private.staff(user_id,role)
  select new.id, role from tourism_private.invites where lower(email)=lower(new.email)
  on conflict(user_id) do nothing;
  return new;
end $$;
revoke all on function tourism_private.assign_staff() from public;
create trigger tourism_assign_staff after insert or update of email_confirmed_at on auth.users
for each row execute function tourism_private.assign_staff();

create table public.tourism_inquiries (
  id uuid primary key default gen_random_uuid(),
  data jsonb not null,
  status text not null default 'new' check(status in ('new','in_progress','closed')),
  notes text not null default '',
  version int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index tourism_inquiries_created_idx on public.tourism_inquiries(created_at desc);
create table public.tourism_bookings (
  id uuid primary key,
  departure_id text not null references public.tourism_content(id),
  travelers int not null check(travelers between 1 and 100),
  form jsonb not null,
  receipt jsonb not null,
  token_hash text not null,
  waiver_version text not null,
  policy_snapshot jsonb not null,
  status text not null default 'pending' check(status in ('pending','confirmed','cancelled','completed')),
  payment_status text not null default 'unpaid' check(payment_status in ('unpaid','partial','paid')),
  notes text not null default '',
  version int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index tourism_bookings_departure_idx on public.tourism_bookings(departure_id);
create index tourism_bookings_created_idx on public.tourism_bookings(created_at desc);
create table public.tourism_activity (
  id bigint generated always as identity primary key,
  actor uuid references auth.users(id) on delete set null,
  entity text not null, record_id text not null, action text not null,
  created_at timestamptz not null default now()
);
alter table public.tourism_content enable row level security;
alter table public.tourism_inquiries enable row level security;
alter table public.tourism_bookings enable row level security;
alter table public.tourism_activity enable row level security;
revoke all on public.tourism_content, public.tourism_inquiries, public.tourism_bookings, public.tourism_activity from anon, authenticated;
grant select on public.tourism_content to anon,authenticated;
grant insert,update on public.tourism_content to authenticated;
grant select on public.tourism_inquiries, public.tourism_bookings, public.tourism_activity to authenticated;
grant update(status,notes,version,updated_at) on public.tourism_inquiries to authenticated;
grant update(status,payment_status,notes,version,updated_at) on public.tourism_bookings to authenticated;
create policy tourism_read_public on public.tourism_content for select to anon using(published);
create policy tourism_read_staff on public.tourism_content for select to authenticated using(published or (select tourism_private.staff_role()) is not null);
create policy tourism_content_insert on public.tourism_content for insert to authenticated with check((select tourism_private.staff_role()) in ('admin','editor'));
create policy tourism_content_update on public.tourism_content for update to authenticated using((select tourism_private.staff_role()) in ('admin','editor')) with check((select tourism_private.staff_role()) in ('admin','editor'));
create policy tourism_inquiries_read on public.tourism_inquiries for select to authenticated using((select tourism_private.staff_role()) in ('admin','manager'));
create policy tourism_inquiries_update on public.tourism_inquiries for update to authenticated using((select tourism_private.staff_role()) in ('admin','manager')) with check((select tourism_private.staff_role()) in ('admin','manager'));
create policy tourism_bookings_read on public.tourism_bookings for select to authenticated using((select tourism_private.staff_role()) in ('admin','manager'));
create policy tourism_bookings_update on public.tourism_bookings for update to authenticated using((select tourism_private.staff_role()) in ('admin','manager')) with check((select tourism_private.staff_role()) in ('admin','manager'));
create policy tourism_activity_read on public.tourism_activity for select to authenticated using((select tourism_private.staff_role()) is not null);

create function tourism_private.track_change() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  new.updated_at = now();
  new.version = old.version + 1;
  insert into public.tourism_activity(actor,entity,record_id,action) values(auth.uid(),tg_table_name,new.id::text,'update');
  return new;
end $$;
revoke all on function tourism_private.track_change() from public;
create trigger tourism_content_changed before update on public.tourism_content for each row execute function tourism_private.track_change();
create trigger tourism_inquiries_changed before update on public.tourism_inquiries for each row execute function tourism_private.track_change();
create trigger tourism_bookings_changed before update on public.tourism_bookings for each row execute function tourism_private.track_change();

create function tourism_private.tier(tiers jsonb, people int) returns numeric language sql immutable set search_path = '' as $$
  select nullif(value #>> '{}','')::numeric from jsonb_each(coalesce(tiers,'{}'))
  where key ~ '^[1-9][0-9]*$' order by (key::int <= people) desc,
  case when key::int <= people then -key::int else key::int end limit 1
$$;
revoke all on function tourism_private.tier(jsonb,int) from public;

create function tourism_private.submit_inquiry(p_data jsonb) returns uuid language plpgsql security definer set search_path = '' as $$
declare result uuid;
begin
  if octet_length(p_data::text)>20000 or coalesce(length(trim(p_data->>'name')),0) not between 1 and 100
    or coalesce(p_data->>'email','') !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    or length(p_data->>'email')>254 or coalesce(p_data->>'whatsappNumber','') !~ '^\+?[1-9][0-9 ()-]{6,24}$'
    or coalesce(p_data->>'date','') !~ '^\d{4}-\d{2}-\d{2}$'
    or (p_data->>'date')::date < (now() at time zone 'Asia/Bishkek')::date
    or (p_data->>'date')::date > (now() at time zone 'Asia/Bishkek')::date + 730
    or coalesce(length(p_data->>'tour'),0) not between 1 and 250
    or coalesce(length(p_data->>'message'),0)>5000 then raise exception 'Invalid inquiry'; end if;
  if (select count(*) from public.tourism_inquiries where lower(data->>'email')=lower(p_data->>'email') and created_at>now()-interval '1 hour')>=5 then
    raise exception 'Too many inquiries. Please try again later.';
  end if;
  insert into public.tourism_inquiries(data) values(p_data) returning id into result;
  return result;
end $$;
revoke all on function tourism_private.submit_inquiry(jsonb) from public;
grant execute on function tourism_private.submit_inquiry(jsonb) to anon,authenticated;
create function public.tourism_submit_inquiry(p_data jsonb) returns uuid language sql security invoker set search_path = '' as $$ select tourism_private.submit_inquiry(p_data) $$;
revoke all on function public.tourism_submit_inquiry(jsonb) from public;
grant execute on function public.tourism_submit_inquiry(jsonb) to anon,authenticated;

create function tourism_private.read_receipt(p_id uuid,p_token uuid) returns jsonb language sql stable security definer set search_path = '' as $$
  select receipt || jsonb_build_object('status',status) from public.tourism_bookings
  where id=p_id and token_hash=encode(extensions.digest(p_token::text,'sha256'),'hex')
$$;
revoke all on function tourism_private.read_receipt(uuid,uuid) from public;
grant execute on function tourism_private.read_receipt(uuid,uuid) to anon,authenticated;
create function public.tourism_receipt(p_id uuid,p_token uuid) returns jsonb language sql stable security invoker set search_path = '' as $$ select tourism_private.read_receipt(p_id,p_token) $$;
revoke all on function public.tourism_receipt(uuid,uuid) from public;
grant execute on function public.tourism_receipt(uuid,uuid) to anon,authenticated;

create function tourism_private.reserve(p_id uuid,p_token uuid,p_departure text,p_form jsonb,p_extras jsonb,p_policies jsonb,p_expected_total numeric)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
 d public.tourism_content; t public.tourism_content; legal jsonb; policy jsonb;
 person jsonb; addon jsonb; travelers int; booked int; total_people int; per_person numeric;
 extra_total numeric:=0; quantity int; subtotal numeric; deposit numeric; deposit_each numeric;
 days int; cutoff int; today date:=(now() at time zone 'Asia/Bishkek')::date; result jsonb; existing jsonb;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_id::text,0));
  existing:=tourism_private.read_receipt(p_id,p_token);
  if existing is not null then return existing; end if;
  if exists(select 1 from public.tourism_bookings where id=p_id) then raise exception 'Reservation ID conflict'; end if;
  if octet_length(p_form::text)>1500000 or jsonb_typeof(p_form->'travelers') is distinct from 'array' or jsonb_typeof(p_extras) is distinct from 'array'
    or coalesce(p_form->>'joinGroupId','')<>'' then raise exception 'Invalid reservation'; end if;
  travelers:=jsonb_array_length(p_form->'travelers');
  if travelers not between 1 and 100 then raise exception 'Invalid traveler count'; end if;
  select * into d from public.tourism_content where id=p_departure and kind='departure' and published for update;
  if not found or coalesce((d.data->>'active')::boolean,false)=false or coalesce(d.data->>'status','active')<>'active' then raise exception 'Departure unavailable'; end if;
  select * into t from public.tourism_content where kind='tour' and slug=d.data->>'tourSlug' and published for share;
  if not found or coalesce((t.data->>'active')::boolean,true)=false then raise exception 'Tour unavailable'; end if;
  booked:=(d.data->>'peopleBooked')::int;total_people:=booked+travelers;
  if total_people>(d.data->>'maxPeople')::int then raise exception 'Not enough spaces remain'; end if;
  cutoff:=coalesce(nullif((t.data->>'bookingCutoffDays')::int,0),case when booked>0 then 1 else 2 end);
  if (d.data->>'startDate')::timestamptz at time zone 'Asia/Bishkek' < (today+cutoff)::timestamp then raise exception 'Booking has closed'; end if;
  select data into legal from public.tourism_content where id='settings:checkout' and published;
  select data into policy from public.tourism_content where id='settings:site' and published;
  if legal is null or policy is null then raise exception 'Booking terms unavailable'; end if;
  for person in select value from jsonb_array_elements(p_form->'travelers') loop
    if coalesce(length(trim(person->>'firstName')),0)=0 or coalesce(length(trim(person->>'lastName')),0)=0
      or coalesce(person->>'dob','') !~ '^\d{4}-\d{2}-\d{2}$' or (person->>'dob')::date>today or (person->>'dob')::date<'1900-01-01'
      or coalesce(length(person->>'nationality'),0)<>2 or coalesce(length(person->>'addressCountry'),0)<>2
      or coalesce(length(trim(person->>'addressLine')),0)=0 or coalesce(length(trim(person->>'city')),0)=0 or coalesce(length(trim(person->>'postal')),0)=0
      or coalesce(length(trim(person->>'emergencyName')),0)=0 or coalesce(person->>'emergencyEmail','') !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
      or coalesce(length(person->>'emergencyPhone'),0)<6 or coalesce(person->>'mediaConsent','') not in ('yes','no')
      or coalesce(length(trim(person->>'initials')),0)=0 or coalesce(person->>'signature','') not like 'data:image/png;base64,%'
      or jsonb_typeof(person->'extras') is distinct from 'array' or jsonb_typeof(person->'initialed') is distinct from 'array'
      then raise exception 'Complete every traveler and waiver'; end if;
    if (person->>'dob')::date > (today-interval '18 years')::date and (coalesce(length(trim(person->>'guardianName')),0)=0 or coalesce(length(trim(person->>'guardianRelationship')),0)=0 or coalesce(person->>'guardianSignature','') not like 'data:image/png;base64,%') then raise exception 'Guardian details required'; end if;
    if exists(select 1 from jsonb_array_elements(legal->'WAIVER_CLAUSES') c where not(person->'initialed' ? (c->>'key'))) then raise exception 'Acknowledge every waiver clause'; end if;
    if exists(select 1 from jsonb_array_elements(p_form->'travelers') other where lower(trim((other->>'firstName')||' '||(other->>'lastName')))=lower(trim(person->>'emergencyName'))) then raise exception 'Emergency contact must not travel'; end if;
    if exists(select 1 from jsonb_array_elements_text(person->'extras') e where not exists(select 1 from jsonb_array_elements(coalesce(t.data->'optionalAddOns','[]')) a where a->>'name'=e and coalesce(a->>'scope','traveler')<>'group')) then raise exception 'Unknown traveler extra'; end if;
  end loop;
  person:=p_form->'travelers'->0;
  if coalesce(person->>'email','') !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' or coalesce(length(person->>'phone'),0)<6 then raise exception 'Primary contact required'; end if;
  if (select count(*) from public.tourism_bookings where lower(form->'travelers'->0->>'email')=lower(person->>'email') and created_at>now()-interval '1 hour')>=5 then raise exception 'Too many reservations'; end if;
  if jsonb_typeof(p_policies) is distinct from 'array' or exists(select 1 from generate_series(0,jsonb_array_length(policy->'paymentPolicy')+case when coalesce((t.data->>'passportNeeded')::boolean,false) then 1 else 0 end) n where not(p_policies ? n::text)) then raise exception 'Acknowledge booking policies'; end if;
  if exists(select 1 from jsonb_array_elements_text(p_extras) e where not exists(select 1 from jsonb_array_elements(coalesce(t.data->'optionalAddOns','[]')) a where a->>'name'=e and a->>'scope'='group')) then raise exception 'Unknown group extra'; end if;
  per_person:=tourism_private.tier(coalesce(d.data->'Prices',t.data->'pricesEnglish'),total_people);
  if per_person is null or per_person<=0 then raise exception 'Price unavailable. Contact us.'; end if;
  days:=coalesce((t.data->>'durationDays')::int,substring(t.data->>'duration' from '^([0-9]+)')::int,1);
  for addon in select value from jsonb_array_elements(coalesce(t.data->'optionalAddOns','[]')) loop
    if addon->>'scope'='group' then quantity:=case when p_extras ? (addon->>'name') then case when addon->>'chargeMode'='perPerson' then travelers else 1 end else 0 end;
    else select count(*) into quantity from jsonb_array_elements(p_form->'travelers') p where p->'extras' ? (addon->>'name'); end if;
    extra_total:=extra_total+quantity*(addon->>'cost')::numeric*case when addon->>'billing'='perDay' then coalesce((addon->>'days')::int,days) else 1 end;
  end loop;
  subtotal:=round(per_person*travelers+extra_total,2);
  deposit_each:=coalesce(nullif((d.data->>'customDeposit')::numeric,0),coalesce(tourism_private.tier(t.data->'defaultDeposit',total_people),50*total_people)/total_people);
  deposit:=least(subtotal,round(deposit_each*travelers,2));
  if p_expected_total is null or subtotal<>p_expected_total then raise exception 'Price changed. Reload and review your reservation.'; end if;
  result:=jsonb_build_object('id',p_id,'departureId',p_departure,'tourSlug',t.slug,'tourTitle',t.data->>'title','start',to_char((d.data->>'startDate')::timestamptz at time zone 'Asia/Bishkek','YYYY-MM-DD'),'end',to_char((d.data->>'endDate')::timestamptz at time zone 'Asia/Bishkek','YYYY-MM-DD'),'createdAt',now(),'travelers',travelers,'currency','USD','status','pending','chargeAmount',0,'quote',jsonb_build_object('perPerson',per_person,'count',travelers,'totalPeople',total_people,'base',per_person*travelers,'extras',extra_total,'subtotal',subtotal,'deposit',deposit,'remaining',greatest(0,subtotal-deposit)));
  insert into public.tourism_bookings(id,departure_id,travelers,form,receipt,token_hash,waiver_version,policy_snapshot)
    values(p_id,p_departure,travelers,p_form,result,encode(extensions.digest(p_token::text,'sha256'),'hex'),legal->>'WAIVER_VERSION',jsonb_build_object('waiver',legal,'policy',policy->'paymentPolicy','acknowledged',p_policies,'passportNeeded',t.data->'passportNeeded'));
  update public.tourism_content set data=jsonb_set(data,'{peopleBooked}',to_jsonb(total_people)) where id=d.id;
  return result;
end $$;
revoke all on function tourism_private.reserve(uuid,uuid,text,jsonb,jsonb,jsonb,numeric) from public;
grant execute on function tourism_private.reserve(uuid,uuid,text,jsonb,jsonb,jsonb,numeric) to anon,authenticated;
create function public.tourism_reserve(p_id uuid,p_token uuid,p_departure text,p_form jsonb,p_extras jsonb,p_policies jsonb,p_expected_total numeric)
returns jsonb language sql security invoker set search_path = '' as $$ select tourism_private.reserve(p_id,p_token,p_departure,p_form,p_extras,p_policies,p_expected_total) $$;
revoke all on function public.tourism_reserve(uuid,uuid,text,jsonb,jsonb,jsonb,numeric) from public;
grant execute on function public.tourism_reserve(uuid,uuid,text,jsonb,jsonb,jsonb,numeric) to anon,authenticated;

create function tourism_private.booking_status_changed() returns trigger language plpgsql security definer set search_path = '' as $$
declare delta int; current_booked int; capacity int;
begin
 if old.status=new.status then return new; end if;
 if old.status='cancelled' then raise exception 'Cancelled bookings cannot be reopened. Create a new reservation.'; end if;
 if new.status='cancelled' then
   select (data->>'peopleBooked')::int,(data->>'maxPeople')::int into current_booked,capacity from public.tourism_content where id=new.departure_id for update;
   delta:=-new.travelers;
   if current_booked+delta<0 then raise exception 'Invalid seat count'; end if;
   update public.tourism_content set data=jsonb_set(data,'{peopleBooked}',to_jsonb(current_booked+delta)) where id=new.departure_id;
 end if;
 return new;
end $$;
revoke all on function tourism_private.booking_status_changed() from public;
create trigger tourism_booking_status before update of status on public.tourism_bookings for each row execute function tourism_private.booking_status_changed();

create function tourism_private.protect_inventory() returns trigger language plpgsql security invoker set search_path = '' as $$
begin
 if old.kind='departure' and current_user in ('anon','authenticated') and ((old.data->>'peopleBooked') is distinct from (new.data->>'peopleBooked') or old.data->>'tourSlug' is distinct from new.data->>'tourSlug') then raise exception 'Booked seats and departure tour cannot be changed directly'; end if;
 if new.kind<>old.kind or new.id<>old.id then raise exception 'Record identity cannot change'; end if;
 return new;
end $$;
revoke all on function tourism_private.protect_inventory() from public;
create trigger tourism_protect_inventory before update on public.tourism_content for each row execute function tourism_private.protect_inventory();

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('tourism-media','tourism-media',true,10485760,array['image/jpeg','image/png','image/webp','application/pdf']);
create policy tourism_media_read on storage.objects for select to anon,authenticated using(bucket_id='tourism-media');
create policy tourism_media_insert on storage.objects for insert to authenticated with check(bucket_id='tourism-media' and (select tourism_private.staff_role()) in ('admin','editor'));
create policy tourism_media_update on storage.objects for update to authenticated using(bucket_id='tourism-media' and (select tourism_private.staff_role()) in ('admin','editor')) with check(bucket_id='tourism-media' and (select tourism_private.staff_role()) in ('admin','editor'));

insert into tourism_private.invites(email,role) values('aza.alt.com@gmail.com','admin') on conflict(email) do nothing;
