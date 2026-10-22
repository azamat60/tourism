create or replace function tourism_private.reserve(p_id uuid,p_token uuid,p_departure text,p_form jsonb,p_extras jsonb,p_policies jsonb,p_expected_total numeric)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
 d public.tourism_content; t public.tourism_content; legal jsonb; policy jsonb; legal_version int; policy_version int;
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
  select data,version into legal,legal_version from public.tourism_content where id='settings:checkout' and published for share;
  select data,version into policy,policy_version from public.tourism_content where id='settings:site' and published for share;
  if legal is null or policy is null then raise exception 'Booking terms unavailable'; end if;
  if coalesce((p_form->'termsVersion'->>'waiver')::int,0)<>legal_version or coalesce((p_form->'termsVersion'->>'site')::int,0)<>policy_version then raise exception 'Booking terms changed. Reload the page and review the current agreements.'; end if;
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
