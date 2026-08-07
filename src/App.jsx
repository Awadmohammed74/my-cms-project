import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import AddArticle from "./pages/AddArticle";
import AllArticles from "./pages/AllArticles";
import Settings from "./pages/Settings";
import Categories from "./pages/Categories";
import NotFound from "./pages/NotFound";
import EditArticle from "./pages/EditArticle";
import SingleArticle from "./pages/SingleArticle";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import SplashScreen from "./components/SplashScreen";
import { useAuth } from "./context/AuthContext";
import { useApp } from "./context/AppContext";

const SPLASH_MIN_MS = 1200;
const SPLASH_FADE_MS = 500;

function App() {
  // Global loading gate — combines auth initialization with
  // initial Firestore data loading (articles, stats, categories).
  // A single SplashScreen is shown until BOTH are ready.
  const { loading: authLoading } = useAuth();
  const { isAppReady } = useApp();

  const dataReady = !authLoading && isAppReady;

  // Local splash visibility state — allows a smooth fade-out
  // animation even after data has finished loading.
  const [splashMounted, setSplashMounted] = useState(true);
  const [splashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    if (!dataReady) return;

    // Once data is ready, keep the splash visible for a minimum
    // duration, then trigger the fade-out before unmounting.
    const showTimer = setTimeout(() => setSplashVisible(false), SPLASH_MIN_MS);
    const unmountTimer = setTimeout(
      () => setSplashMounted(false),
      SPLASH_MIN_MS + SPLASH_FADE_MS,
    );

    return () => {
      clearTimeout(showTimer);
      clearTimeout(unmountTimer);
    };
  }, [dataReady]);

  if (splashMounted) {
    return <SplashScreen visible={splashVisible} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route index element={<Dashboard />} />

            <Route path="articles">
              <Route index element={<AllArticles />} />
              <Route path="add" element={<AddArticle />} />
              <Route path="edit-article/:id" element={<EditArticle />} />
              <Route path="view/:id" element={<SingleArticle />} />
            </Route>

            <Route path="settings" element={<Settings />} />
            <Route path="categories" element={<Categories />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
