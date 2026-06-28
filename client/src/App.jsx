import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import ProjectPage from "./pages/ProjectPage";
import BoardroomPage from "./pages/BoardroomPage";
import AnalyticsPage from "./pages/AnalyticsPage";

import useStudioStore from "./store/useStudioStore";
import { useEffect } from "react";
import api from "./services/api";

function ProtectedRoute({ children }) {
  const token = useStudioStore((state) => state.token);

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

export default function App() {
  const { token, setUser } = useStudioStore();

useEffect(() => {
  const loadUser = async () => {
    if (!token) return;

    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
    } catch {
      localStorage.removeItem("token");
    }
  };

  loadUser();
}, []);
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/auth" element={<AuthPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProjectPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/boardroom"
          element={
            <ProtectedRoute>
              <BoardroomPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}