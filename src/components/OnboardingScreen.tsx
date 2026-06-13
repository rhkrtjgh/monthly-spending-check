import config from "../../granite.config.ts";
import "./OnboardingScreen.css";

const SPLASH_IMAGE_URL = `${import.meta.env.BASE_URL}onboarding-splash.png`;
const BRAND_COLOR = config.brand.primaryColor;

interface OnboardingScreenProps {
  showStartButton: boolean;
  onStart: () => void;
}

export function OnboardingScreen({
  showStartButton,
  onStart,
}: OnboardingScreenProps) {
  return (
    <div className="onboarding">
      <div className="onboarding__hero-wrap">
        <img
          className="onboarding__hero"
          src={SPLASH_IMAGE_URL}
          alt="매달 나가는 고정지출 한눈에 파악하기"
        />

        {showStartButton ? (
          <div className="onboarding__overlay">
            <button
              type="button"
              className="onboarding__start"
              style={{ backgroundColor: BRAND_COLOR }}
              onClick={onStart}
            >
              시작하기
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
