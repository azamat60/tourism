begin;
insert into public.tourism_content(id,kind,slug,data,published)
select 'qa:tour','tour','qa-tour',data||'{"id":"qa-tour","slug":"qa-tour","title":"QA only","active":true,"pricesEnglish":{"1":100,"2":90},"defaultDeposit":{"1":20},"optionalAddOns":[],"passportNeeded":false}'::jsonb,true
from public.tourism_content where kind='tour' limit 1;
insert into public.tourism_content(id,kind,slug,data,published) values('qa:departure','departure','qa-departure',jsonb_build_object('id','qa:departure','tourSlug','qa-tour','tourName','QA only','active',true,'status','active','peopleBooked',0,'maxPeople',1,'startDate',to_char(now()+interval '30 days','YYYY-MM-DD')||'T00:00:00+06:00','endDate',to_char(now()+interval '32 days','YYYY-MM-DD')||'T23:59:00+06:00'),true);
set local role anon;
do $test$
declare
 form jsonb; receipt jsonb; policies jsonb:='["0","1","2","3"]'; token uuid:='10000000-0000-4000-8000-000000000001'; booking uuid:='20000000-0000-4000-8000-000000000001';
begin
 select jsonb_build_object('travelers',jsonb_build_array(jsonb_build_object('firstName','Test','lastName','Traveler','email','qa@example.invalid','phone','2025550195','phoneCountry','US','dob','1990-01-01','nationality','US','addressCountry','US','addressLine','Test Street','city','Test City','postal','10001','emergencyName','Other Contact','emergencyEmail','other@example.invalid','emergencyPhone','2025550123','emergencyPhoneCountry','US','initials','TT','initialed',(select jsonb_agg(c->>'key') from public.tourism_content x,jsonb_array_elements(x.data->'WAIVER_CLAUSES') c where x.id='settings:checkout'),'mediaConsent','no','signature','data:image/png;base64,dGVzdA==','extras','[]'::jsonb)),'termsVersion',jsonb_build_object('waiver',(select version from public.tourism_content where id='settings:checkout'),'site',(select version from public.tourism_content where id='settings:site')),'joinGroupId','','specialRequests','','howHeard','','howHeardOther','') into form;
 begin
  perform public.tourism_reserve(booking,token,'qa:departure',form,'[]',policies,1);
  raise exception 'TEST FAILED: client price trusted';
 exception when raise_exception then if sqlerrm not like 'Price changed%' then raise; end if; end;
 begin
  perform public.tourism_reserve(booking,token,'qa:departure',form,'[]',null,100);
  raise exception 'TEST FAILED: missing policies accepted';
 exception when raise_exception then if sqlerrm not like 'Acknowledge booking policies%' then raise; end if; end;
 begin
  perform public.tourism_reserve(booking,token,'qa:departure',jsonb_set(form,'{termsVersion,waiver}','0'),'[]',policies,100);
  raise exception 'TEST FAILED: stale waiver version accepted';
 exception when raise_exception then if sqlerrm not like 'Booking terms changed%' then raise; end if; end;
 receipt:=public.tourism_reserve(booking,token,'qa:departure',form,'[]',policies,100);
 assert (receipt->'quote'->>'subtotal')::numeric=100,'Server price mismatch';
 assert (receipt->'quote'->>'deposit')::numeric=20,'Server deposit mismatch';
 assert receipt->>'status'='pending','Wrong status';
 assert not(receipt ? 'form'),'Private traveler data leaked';
 assert public.tourism_reserve(booking,token,'qa:departure',form,'[]',policies,100)=receipt,'Idempotency failed';
 assert public.tourism_receipt(booking,'30000000-0000-4000-8000-000000000001') is null,'Wrong token exposed receipt';
 assert public.tourism_receipt(booking,token) is not null,'Receipt missing';
 begin
  perform public.tourism_reserve('20000000-0000-4000-8000-000000000002',token,'qa:departure',form,'[]',policies,100);
  raise exception 'TEST FAILED: overbooking accepted';
 exception when raise_exception then if sqlerrm not like 'Not enough spaces%' then raise; end if; end;
 begin
  perform count(*) from public.tourism_bookings;
  raise exception 'TEST FAILED: anon read private bookings';
 exception when insufficient_privilege then null; end;
 begin
  insert into public.tourism_content(id,kind,slug,data,published) values('qa:bad','post','qa-bad','{}',true);
  raise exception 'TEST FAILED: anon edited content';
 exception when insufficient_privilege then null; end;
end $test$;
reset role;
update public.tourism_bookings set status='cancelled' where id='20000000-0000-4000-8000-000000000001';
do $test$ begin
 assert (select (data->>'peopleBooked')::int from public.tourism_content where id='qa:departure')=0,'Cancellation did not release seat';
 begin
  update public.tourism_bookings set status='confirmed' where id='20000000-0000-4000-8000-000000000001';
  raise exception 'TEST FAILED: cancelled booking reopened';
 exception when raise_exception then if sqlerrm not like 'Cancelled bookings cannot be reopened%' then raise; end if; end;
end $test$;
set local request.jwt.claims='{"sub":"40000000-0000-4000-8000-000000000001","role":"authenticated","app_metadata":{"role":"admin"},"user_metadata":{"role":"admin"}}';
set local role authenticated;
do $test$ begin
 assert public.tourism_staff_role() is null,'Forged metadata granted staff';
 assert (select count(*) from public.tourism_bookings)=0,'Nonstaff read private bookings';
 begin
  insert into public.tourism_content(id,kind,slug,data,published) values('qa:bad','post','qa-bad','{}',true);
  raise exception 'TEST FAILED: nonstaff edited content';
 exception when insufficient_privilege then null; end;
end $test$;
reset role;
select 'Price validation, waiver enforcement, booking, idempotency, capacity, cancellation, receipts and RLS passed; transaction rolled back.' as verified;
rollback;
