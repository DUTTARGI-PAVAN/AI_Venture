import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnalyticsCards from "../components/analytics/AnalyticsCards";
import AnalyticsCharts from "../components/analytics/AnalyticsCharts";
import AnalyticsOverview from "../components/analytics/AnalyticsOverview";
import InsightsPanel from "../components/analytics/InsightsPanel";
import RecommendationsPanel from "../components/analytics/RecommendationsPanel";
import SidebarNavigation from "../components/layout/SidebarNavigation";
import TopNavbar from "../components/layout/TopNavbar";
import EmptyState from "../components/ui/EmptyState";
import ErrorMessage from "../components/ui/ErrorMessage";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { fetchAnalytics } from "../services/analyticsService";
import useStudioStore from "../store/useStudioStore";

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const { user, logout } = useStudioStore();
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await fetchAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to load analytics. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const handleLogout = () => {
    logout();
    navigate("/auth", { replace: true });
  };

  const hasProjects = (analytics?.overview?.totalProjects || 0) > 0;
  const hasAnalyses = (analytics?.overview?.projectsAnalyzed || 0) > 0;

  return (
    <div className="app-shell">
      <SidebarNavigation />

      <main className="main-content">
        <div className="content-stack">
          <TopNavbar user={user} onLogout={handleLogout} />

          <section className="topbar">
            <div>
              <p className="eyebrow">Analytics</p>
              <h1 className="topbar__title">Startup portfolio intelligence</h1>
              <p className="page-intro">
                Track AI validation quality, portfolio coverage, project readiness,
                and repeated risk patterns across your venture studio.
              </p>
            </div>
          </section>

          {error ? <ErrorMessage message={error} onRetry={loadAnalytics} /> : null}

          {isLoading ? (
            <section className="panel">
              <LoadingSpinner label="Loading analytics..." />
            </section>
          ) : analytics && hasProjects ? (
            <>
              <AnalyticsCards overview={analytics.overview} />

              {!hasAnalyses ? (
                <section className="panel">
                  <EmptyState
                    title="No AI analysis yet"
                    message="Validate at least one project idea to unlock score trends, insights, and recommendations."
                    actionLabel="Go to Dashboard"
                    onAction={() => navigate("/dashboard")}
                  />
                </section>
              ) : null}

              <AnalyticsOverview
                overview={analytics.overview}
                highestProject={analytics.highlights.highestProject}
                lowestProject={analytics.highlights.lowestProject}
              />

              <AnalyticsCharts charts={analytics.charts} />

              <InsightsPanel
                insights={analytics.insights}
                recentlyAnalyzed={analytics.highlights.recentlyAnalyzed}
              />

              <RecommendationsPanel recommendations={analytics.recommendations} />
            </>
          ) : (
            <section className="panel">
              <EmptyState
                title="No project analytics yet"
                message="Create your first project to begin building analytics for your startup portfolio."
                actionLabel="Go to Dashboard"
                onAction={() => navigate("/dashboard")}
              />
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
