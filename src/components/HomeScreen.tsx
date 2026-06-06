import { Button, Top } from "@toss/tds-mobile";

import { useAuth } from "../hooks/useAuth";

export function HomeScreen() {
  const { authMode, user, isTossLoggedIn, loginWithToss, logout, isLoading } =
    useAuth();

  const isLoggedIn = authMode === "logged_in" && user !== null;

  return (
    <>
      <Top
        title={<Top.TitleParagraph size={22}>월지출계산기</Top.TitleParagraph>}
        subtitleBottom={
          <Top.SubtitleParagraph size={17}>
            {isLoggedIn
              ? "토스 로그인으로 이용 중이에요"
              : "비로그인 모드로 이용 중이에요"}
          </Top.SubtitleParagraph>
        }
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          padding: "24px",
        }}
      >
        <div
          style={{
            padding: 16,
            borderRadius: 12,
            backgroundColor: "#F9FAFB",
            lineHeight: 1.6,
          }}
        >
          <p style={{ margin: "0 0 8px", color: "#4E5968" }}>로그인 상태</p>
          <p style={{ margin: 0, fontWeight: 600 }}>
            {isLoggedIn ? "토스 로그인" : "비로그인"}
          </p>
          {isLoggedIn ? (
            <>
              <p style={{ margin: "12px 0 0", color: "#4E5968" }}>
                userKey: {user.userKey}
              </p>
              {user.birthYear ? (
                <p style={{ margin: "4px 0 0", color: "#4E5968" }}>
                  출생년도: {user.birthYear}
                </p>
              ) : null}
              {user.gender ? (
                <p style={{ margin: "4px 0 0", color: "#4E5968" }}>
                  성별: {user.gender}
                </p>
              ) : null}
            </>
          ) : null}
          <p style={{ margin: "12px 0 0", color: "#8B95A1", fontSize: 14 }}>
            토스 연동 여부:{" "}
            {isTossLoggedIn === null
              ? "확인 불가"
              : isTossLoggedIn
                ? "연동됨"
                : "미연동"}
          </p>
        </div>

        {!isLoggedIn ? (
          <Button
            size="large"
            display="block"
            onClick={() => void loginWithToss()}
            disabled={isLoading}
          >
            토스 로그인하기
          </Button>
        ) : (
          <Button
            size="large"
            display="block"
            variant="weak"
            onClick={() => void logout()}
            disabled={isLoading}
          >
            로그아웃
          </Button>
        )}
      </div>
    </>
  );
}
