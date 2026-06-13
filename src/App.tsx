import { useEffect, useState } from "react";

import { DashboardScreen } from "./components/DashboardScreen";
import { ExpenseCategorySpriteSheet } from "./components/expense/ExpenseCategorySpriteSheet";
import { OnboardingScreen } from "./components/OnboardingScreen";
import {
  isOnboardingCompleted,
  setOnboardingCompleted,
} from "./lib/storage/localStorage";

const SPLASH_DURATION_MS = 1000;

type AppPhase = "splash" | "dashboard";

function App() {
  const isNewUser = !isOnboardingCompleted();
  const [phase, setPhase] = useState<AppPhase>("splash");

  useEffect(() => {
    if (isNewUser) {
      return;
    }

    const timer = window.setTimeout(() => {
      setPhase("dashboard");
    }, SPLASH_DURATION_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isNewUser]);

  const handleStart = () => {
    setOnboardingCompleted();
    setPhase("dashboard");
  };

  return (
    <div className="app-shell">
      <ExpenseCategorySpriteSheet />
      <div className="app-screen">
        {phase === "splash" ? (
          <OnboardingScreen
            showStartButton={isNewUser}
            onStart={handleStart}
          />
        ) : (
          <DashboardScreen />
        )}
      </div>
    </div>
  );
}

export default App;
