-- Supabase SQL Editor에서 실행하세요.
-- 기존 정책이 있으면 먼저 제거합니다.

DROP POLICY IF EXISTS "anon_select_exp" ON "TS_MNA_EXP_INFO";
DROP POLICY IF EXISTS "anon_insert_exp" ON "TS_MNA_EXP_INFO";
DROP POLICY IF EXISTS "anon_update_exp" ON "TS_MNA_EXP_INFO";
DROP POLICY IF EXISTS "anon_delete_exp" ON "TS_MNA_EXP_INFO";
DROP POLICY IF EXISTS "anon_select_cus" ON "TS_MNA_CUS_INFO";
DROP POLICY IF EXISTS "anon_insert_cus" ON "TS_MNA_CUS_INFO";
DROP POLICY IF EXISTS "anon_update_cus" ON "TS_MNA_CUS_INFO";
DROP POLICY IF EXISTS "authenticated_select_own_cus" ON "TS_MNA_CUS_INFO";
DROP POLICY IF EXISTS "authenticated_insert_own_cus" ON "TS_MNA_CUS_INFO";
DROP POLICY IF EXISTS "authenticated_update_own_cus" ON "TS_MNA_CUS_INFO";

-- TS_MNA_EXP_INFO: 개발용 — Publishable key(anon) 허용
CREATE POLICY "anon_select_exp"
  ON "TS_MNA_EXP_INFO" FOR SELECT TO anon USING (true);

CREATE POLICY "anon_insert_exp"
  ON "TS_MNA_EXP_INFO" FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_update_exp"
  ON "TS_MNA_EXP_INFO" FOR UPDATE TO anon USING (true);

CREATE POLICY "anon_delete_exp"
  ON "TS_MNA_EXP_INFO" FOR DELETE TO anon USING (true);

-- TS_MNA_CUS_INFO: JWT userkey와 일치하는 본인 행만 접근 (authenticated 역할)
CREATE POLICY "authenticated_select_own_cus"
  ON "TS_MNA_CUS_INFO" FOR SELECT TO authenticated
  USING (userkey = (auth.jwt() ->> 'userkey')::bigint);

CREATE POLICY "authenticated_insert_own_cus"
  ON "TS_MNA_CUS_INFO" FOR INSERT TO authenticated
  WITH CHECK (userkey = (auth.jwt() ->> 'userkey')::bigint);

CREATE POLICY "authenticated_update_own_cus"
  ON "TS_MNA_CUS_INFO" FOR UPDATE TO authenticated
  USING (userkey = (auth.jwt() ->> 'userkey')::bigint)
  WITH CHECK (userkey = (auth.jwt() ->> 'userkey')::bigint);
