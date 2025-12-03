-- Delete all users from auth.users (Supabase authentication)
DELETE FROM auth.users;

-- Also clean up profiles table if it exists
DELETE FROM profiles;
