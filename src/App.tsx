import { AuthLoadingScreen } from "./components/AuthLoadingScreen";
import { HomeScreen } from "./components/HomeScreen";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { entryScreen } = useAuth();

  if (entryScreen === "loading") {
    return <AuthLoadingScreen />;
  }

  if (entryScreen === "onboarding") {
    return <OnboardingScreen />;
  }

  return <HomeScreen />;
}

export default App;
