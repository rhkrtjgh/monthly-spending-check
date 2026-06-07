import { DashboardScreen } from "./components/DashboardScreen";
import { ExpenseCategorySpriteSheet } from "./components/expense/ExpenseCategorySpriteSheet";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { AuthLoadingScreen } from "./components/AuthLoadingScreen";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { entryScreen } = useAuth();

  return (
    <>
      <ExpenseCategorySpriteSheet />
      {entryScreen === "loading" ? (
        <AuthLoadingScreen />
      ) : entryScreen === "onboarding" ? (
        <OnboardingScreen />
      ) : (
        <DashboardScreen />
      )}
    </>
  );
}

export default App;
