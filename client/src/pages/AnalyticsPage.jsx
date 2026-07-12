import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { exportAnalyticsPDF } from "../services/pdfService";
import SidebarNavigation from "../components/layout/SidebarNavigation";
import TopNavbar from "../components/layout/TopNavbar";

import AnalyticsHero from "../components/analytics/AnalyticsHero";
import ScoreCard from "../components/analytics/ScoreCard";
import ExecutiveScoreCard from "../components/analytics/ExecutiveScoreCard";
import AnalyticsSection from "../components/analytics/AnalyticsSection";

import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorMessage from "../components/ui/ErrorMessage";

import api from "../services/api";
import useStudioStore from "../store/useStudioStore";
import "../styles/analytics.css";
export default function AnalyticsPage() {
  const { projectId } = useParams();
  console.log("Analytics projectId:", projectId);
  const navigate = useNavigate();

  const { user, logout } = useStudioStore();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!projectId) {
      navigate("/dashboard");
      return;
    }

    loadAnalytics();
  }, [projectId, navigate]);

  async function loadAnalytics() {
    console.log("Loading analytics for:", projectId);
    try {
      setLoading(true);

      const { data } = await api.get(`/analytics/${projectId}`);

      setAnalytics(data.analytics);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Failed to load analytics."
      );
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="app-shell">
        <SidebarNavigation />
        <main className="main-content">
          <LoadingSpinner label="Loading Analytics..." />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-shell">
        <SidebarNavigation />
        <main className="main-content">
          <ErrorMessage
            message={error}
            onRetry={loadAnalytics}
          />
        </main>
      </div>
    );
  }
  console.log(analytics);
  return (
    <div className="app-shell">
      <SidebarNavigation />

      <main className="main-content">

        <TopNavbar
          user={user}
          onLogout={handleLogout}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <AnalyticsHero project={analytics.project} />

          <button
            className="btn btn--primary"
            onClick={() => exportAnalyticsPDF(analytics)}
          >
            📄 Export PDF
          </button>
        </div>

        <div className="analytics-score-grid">

          <ScoreCard
            title="AI Score"
            score={analytics.aiScore}
          />

          <ScoreCard
            title="Boardroom Score"
            score={analytics.boardroomScore}
          />

          <ScoreCard
            title="Final Decision"
            value={analytics.finalDecision}
          />

        </div>

        <ExecutiveScoreCard
          executives={analytics.executiveScores}
        />

        <AnalyticsSection
          title="Strengths"
          items={analytics.strengths}
        />

        <AnalyticsSection
          title="Weaknesses"
          items={analytics.weaknesses}
        />

        <AnalyticsSection
          title="Risks"
          items={analytics.risks}
        />

        <AnalyticsSection
          title="Revenue Model"
          text={analytics.revenueModel}
        />

        <AnalyticsSection
          title="Suggested MVP"
          text={analytics.suggestedMvp}
        />

      </main>
    </div>
  );
}