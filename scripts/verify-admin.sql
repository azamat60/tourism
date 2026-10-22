begin;
select set_config('request.jwt.claims',jsonb_build_object('sub',(select user_id from tourism_private.staff where role='admin' limit 1),'role','authenticated')::text,true);
set local role authenticated;
do $test$
declare saved_version int; changed int;
begin
 assert public.tourism_staff_role()='admin','Confirmed administrator not recognized';
 insert into public.tourism_content(id,kind,slug,data,published) values('qa:admin-test','faq','qa-admin-test','{"question":"QA only","answer":"Original"}',false);
 update public.tourism_content set data='{"question":"QA only","answer":"Changed"}' where id='qa:admin-test' and version=1 returning version into saved_version;
 assert saved_version=2,'Content version not incremented';
 update public.tourism_content set data='{}' where id='qa:admin-test' and version=1;
 get diagnostics changed=row_count;
 assert changed=0,'Stale edit overwrote content';
 assert exists(select 1 from public.tourism_activity where record_id='qa:admin-test' and actor=auth.uid()),'Audit actor missing';
 perform count(*) from public.tourism_inquiries;
 perform count(*) from public.tourism_bookings;
end $test$;
reset role;
select 'Administrator recognition, draft CRUD, optimistic version checks, audit actor and private record access passed; transaction rolled back.' as verified;
rollback;
