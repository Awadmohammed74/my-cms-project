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

function App() {
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
