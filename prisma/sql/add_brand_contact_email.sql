-- Supabase SQL Editor 등에서 한 번 실행 (배포 DB에 brandContactEmail 컬럼이 없을 때)
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "brandContactEmail" TEXT;
