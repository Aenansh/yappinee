import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import { Toaster } from "react-hot-toast";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import OnboardingPage from "./pages/OnboardingPage";
import ChatPage from "./pages/ChatPage";
import CallPage from "./pages/CallPage";
import NotificationsPage from "./pages/NotificationsPage";
import Loading from "../components/loading.jsx";
import useAuthUser from "./hooks/auth.hook.js";
import Layout from "../components/Layout.jsx";
import { useThemeStore } from "./store/useThemeStore.js";

function App() {
  const { authUser, isLoading } = useAuthUser();
  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  const { theme } = useThemeStore();

  if (isLoading) return <Loading />;
  return (
    <>
      <div className="min-h-screen" data-theme={theme}>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated && isOnboarded ? (
                <Layout showSideBar>
                  <HomePage />
                </Layout>
              ) : (
                <Navigate to={!isAuthenticated ? "/sign-in" : "/onboarding"} />
              )
            }
          />
          <Route
            path="/sign-in"
            element={
              !isAuthenticated ? (
                <SigninPage />
              ) : (
                <Navigate to={!isOnboarded ? "/onboarding" : "/"} />
              )
            }
          />
          <Route
            path="/sign-up"
            element={
              !isAuthenticated ? (
                <SignupPage />
              ) : (
                <Navigate to={!isOnboarded ? "/onboarding" : "/"} />
              )
            }
          />
          <Route
            path="/onboarding"
            element={
              isAuthenticated ? (
                !isOnboarded ? (
                  <OnboardingPage />
                ) : (
                  <Navigate to={"/"} />
                )
              ) : (
                <Navigate to={"/sign-in"} />
              )
            }
          />
          <Route
            path="/chat/:id"
            element={
              isAuthenticated && isOnboarded ? (
                <Layout showSideBar={false}>
                  <ChatPage />
                </Layout>
              ) : (
                <Navigate to={isAuthenticated ? "/onboarding" : "/sign-in"} />
              )
            }
          />
          <Route
            path="/call"
            element={
              isAuthenticated && isOnboarded ? (
                <CallPage />
              ) : (
                <Navigate to={isAuthenticated ? "/onboarding" : "/sign-in"} />
              )
            }
          />
          <Route
            path="/notifications"
            element={
              authUser ? (
                <Layout showSideBar>
                  <NotificationsPage />
                </Layout>
              ) : (
                <Navigate to={"/sign-in"} />
              )
            }
          />
        </Routes>

        <Toaster />
      </div>
    </>
  );
}

export default App;
