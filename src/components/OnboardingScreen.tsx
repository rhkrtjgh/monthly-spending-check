import config from "../../granite.config.ts";
import "./OnboardingScreen.css";

const HERO_IMAGE_URL = `${import.meta.env.BASE_URL}onboarding-hero.png`;
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
    <div
      className={`onboarding${
        showStartButton ? "" : " onboarding--splash"
      }`}
    >
      <div className="onboarding__hero-crop">
        <img
          className="onboarding__hero"
          src={HERO_IMAGE_URL}
          alt="월지출 계산기, 똑똑한 월지출 관리"
        />
      </div>

      {showStartButton ? (
        <div className="onboarding__footer">
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
  );
}
