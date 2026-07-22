import { BrowserRouter, Routes, Route } from "react-router";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import HomePage from "@/pages/HomePage";
import ArticleDetailPage from "@/pages/ArticleDetailPage";
import NewsPage from "@/pages/NewsPage";
import ArticlesPage from "@/pages/ArticlesPage";
import SearchPage from "@/pages/SearchPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/news/:slug" element={<ArticleDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
