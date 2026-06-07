import { supabase } from "./client";

export async function setSupabaseAccessToken(token: string | null) {
  if (!token) {
    await supabase.auth.signOut();
    return;
  }

  const { error } = await supabase.auth.setSession({
    access_token: token,
    refresh_token: token,
  });

  if (error) {
    throw new Error(`Supabase 인증 설정 실패: ${error.message}`);
  }
}
