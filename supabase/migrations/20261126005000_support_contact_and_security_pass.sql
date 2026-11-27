-- Applied through Supabase on Nov 26, 2026. Kept here as a record.
alter table public.support_requests add column if not exists contact text;
alter table public.support_requests add constraint support_requests_contact_len check (contact is null or char_length(contact) <= 200) not valid;
alter table public.support_requests add constraint support_requests_message_len check (char_length(message) <= 4000) not valid;
alter table public.support_requests add constraint support_requests_topic_len check (topic is null or char_length(topic) <= 120) not valid;
-- Trigger function: nobody should call it directly
revoke execute on function public.handle_new_user() from public, anon, authenticated;
-- Account deletion: signed-in people only
revoke execute on function public.delete_user() from public, anon;
grant execute on function public.delete_user() to authenticated;
-- The sign-up trigger runs as the auth service, so it keeps its own permission
grant execute on function public.handle_new_user() to supabase_auth_admin;
