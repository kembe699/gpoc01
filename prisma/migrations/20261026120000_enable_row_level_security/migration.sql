-- Supabase publishes every table in the public schema through its REST API
-- (PostgREST), reachable with the project's public "anon" key. This app never
-- uses that API — it talks to Postgres through Prisma — so Row Level Security
-- is switched on with no policies: the REST API sees nothing. Prisma connects
-- as the tables' owner, which RLS does not restrict, so the app is unaffected.
-- (Harmless on plain Postgres, where nothing else reads these tables.)
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PasswordResetToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LoginAttempt" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Screening" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;
