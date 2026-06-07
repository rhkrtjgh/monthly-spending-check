import type { UserProfile } from "../../types/auth";
import { supabase } from "../../supabase/client";

function toBirthday(birthYear: number | null): string | null {
  if (birthYear === null) {
    return null;
  }
  return `${birthYear}0101`;
}

export async function upsertCustomer(profile: UserProfile) {
  const { error } = await supabase.from("TS_MNA_CUS_INFO").upsert(
    {
      userkey: profile.userKey,
      gender: profile.gender,
      birthday: toBirthday(profile.birthYear),
      upd_date: new Date().toISOString(),
    },
    { onConflict: "userkey" },
  );

  if (error) {
    throw new Error(`사용자 정보 저장 실패: ${error.message}`);
  }
}
