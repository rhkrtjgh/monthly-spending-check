import config from "../../granite.config.ts";
import { useAuth } from "../hooks/useAuth";
import "./OnboardingScreen.css";

const HERO_IMAGE_URL = `${import.meta.env.BASE_URL}onboarding-hero.png`;
const BRAND_COLOR = config.brand.primaryColor;

function TossLogoIcon() {
  return (
    <img
      className="onboarding__icon"
      src="https://static.toss.im/logos/png/4x/logo-toss-symbol-white.png"
      alt=""
      width={20}
      height={20}
    />
  );
}

function UserIcon() {
  return (
    <svg
      className="onboarding__icon"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
    >
      <circle cx="10" cy="7" r="3.25" stroke="#6B7684" strokeWidth="1.5" />
      <path
        d="M4.75 16.25C5.45 13.55 7.55 12 10 12C12.45 12 14.55 13.55 15.25 16.25"
        stroke="#6B7684"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function OnboardingScreen() {
  const { loginWithToss, continueAsGuest, isLoading, error, clearError } =
    useAuth();

  return (
    <div className="onboarding">
      <div className="onboarding__hero-wrap">
        <img
          className="onboarding__hero"
          src={HERO_IMAGE_URL}
          alt="매달 나가는 고정지출 한눈에 파악하기"
        />

        <div className="onboarding__overlay">
          {error ? (
            <p
              role="alert"
              className="onboarding__error"
              onClick={clearError}
            >
              {error}
            </p>
          ) : null}

          <div className="onboarding__actions">
            <button
              type="button"
              className="onboarding__primary"
              style={{ backgroundColor: BRAND_COLOR }}
              onClick={() => void loginWithToss()}
              disabled={isLoading}
            >
              <TossLogoIcon />
              토스로 바로 시작하기
            </button>

            <button
              type="button"
              className="onboarding__secondary"
              onClick={continueAsGuest}
              disabled={isLoading}
            >
              <UserIcon />
              비로그인으로 둘러보기
            </button>
          </div>

          <p className="onboarding__footer">
            비로그인으로도 언제든 이용할 수 있어요
          </p>
        </div>
      </div>
    </div>
  );
}
