import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Supaya saat buka web awal (/) langsung dilempar ke /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Halaman Login */}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
