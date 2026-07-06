
revoke execute on function public.has_active_subscription(uuid, text) from public, anon;
revoke execute on function public.increment_daily_usage(uuid) from public, anon, authenticated;
grant execute on function public.increment_daily_usage(uuid) to service_role;
