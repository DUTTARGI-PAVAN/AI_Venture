import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Brain, RefreshCw, Sparkles } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import SidebarNavigation from "../components/layout/SidebarNavigation";
import TopNavbar from "../components/layout/TopNavbar";
import EmptyState from "../components/ui/EmptyState";
import ErrorMessage from "../components/ui/ErrorMessage";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { getLatestAnalysis, validateIdea } from "../services/analysisApi";
import api from "../services/api";
import useStudioStore from "../store/useStudioStore";

function formatDate(value) {
  if (!value) return "Not available";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function ProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    user,
    logout,
    selectedProject,
    analysesByProject,
    setProjectAnalysis,
    setSelectedProject,
  } = useStudioStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysisError, setAnalysisError] = useState("");

  const analysis = analysesByProject[id] || selectedProject?.latestAnalysis;

  const loadProject = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const { data } = await api.get(`/projects/${id}`);
      setSelectedProject(data.project);

      if (data.project?.latestAnalysis) {
        setProjectAnalysis(id, data.project.latestAnalysis);
      }
    } catch (err) {
      setSelectedProject(null);
      setError(
        err?.response?.data?.message ||
          "Unable to load project details. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [id, setProjectAnalysis, setSelectedProject]);

  const loadCachedAnalysis = useCallback(async () => {
    if (analysesByProject[id]) return;

    try {
      const cachedAnalysis = await getLatestAnalysis(id);

      if (cachedAnalysis) {
        setProjectAnalysis(id, cachedAnalysis);
      }
    } catch (err) {
      setAnalysisError(
        err?.response?.data?.message ||
          "Unable to load the previous AI analysis."
      );
    }
  }, [analysesByProject, id, setProjectAnalysis]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadProject();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadProject]);

  useEffect(() => {
    if (!isLoading && selectedProject) {
      loadCachedAnalysis();
    }
  }, [isLoading, loadCachedAnalysis, selectedProject]);

  const handleValidateIdea = async (forceRegenerate = false) => {
    setIsAnalysisLoading(true);
    setAnalysisError("");

    try {
      const generatedAnalysis = await validateIdea(id, forceRegenerate);
      setProjectAnalysis(id, generatedAnalysis);
    } catch (err) {
      setAnalysisError(
        err?.response?.data?.message ||
          "Unable to generate the AI validation report. Please make sure Ollama is running."
      );
    } finally {
      setIsAnalysisLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/auth", { replace: true });
  };

  return (
    <div className="app-shell">
      <SidebarNavigation />

      <main className="main-content">
        <div className="content-stack">
          <TopNavbar user={user} onLogout={handleLogout} />

          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={18} aria-hidden="true" />
            Back to Dashboard
          </button>

          {error ? <ErrorMessage message={error} onRetry={loadProject} /> : null}

          {isLoading ? (
            <section className="panel">
              <LoadingSpinner label="Loading project details..." />
            </section>
          ) : selectedProject ? (
            <>
              <section className="detail-grid">
                <article className="detail-card">
                  <p className="eyebrow">Project Details</p>
                  <h2>{selectedProject.title || "Untitled Project"}</h2>
                  <p>
                    {selectedProject.description ||
                      "No description has been added for this project yet."}
                  </p>
                </article>

                <aside className="detail-card">
                  <h3>Workspace Info</h3>
                  <dl className="detail-list">
                    <div>
                      <dt>Industry</dt>
                      <dd>{selectedProject.industry || "Not specified"}</dd>
                    </div>
                    <div>
                      <dt>Stage</dt>
                      <dd>{selectedProject.stage || "Idea"}</dd>
                    </div>
                    <div>
                      <dt>Created</dt>
                      <dd>{formatDate(selectedProject.createdAt)}</dd>
                    </div>
                    <div>
                      <dt>Updated</dt>
                      <dd>{formatDate(selectedProject.updatedAt)}</dd>
                    </div>
                  </dl>
                </aside>
              </section>

              <section className="panel">
                <div className="panel__header">
                  <div>
                    <p className="eyebrow">AI Idea Validation</p>
                    <h2 className="panel__title">Startup validation report</h2>
                    <p className="panel__meta">
                      {analysis
                        ? `Generated ${formatDate(analysis.createdAt)}`
                        : "Analyze the project idea with your local Ollama model."}
                    </p>
                  </div>

                  <div className="topbar__actions">
                    {analysis ? (
                      <button
                        type="button"
                        className="btn btn--secondary"
                        disabled={isAnalysisLoading}
                        onClick={() => handleValidateIdea(true)}
                      >
                        <RefreshCw size={18} aria-hidden="true" />
                        Regenerate
                      </button>
                    ) : null}

                    <button
  className="btn btn--primary"
  onClick={() => navigate(`/copilot/${id}`)}
>
  🤖 AI Copilot
</button>

                    <button
                      type="button"
                      className="btn btn--primary"
                      disabled={isAnalysisLoading}
                      onClick={() => handleValidateIdea(false)}
                    >
                      <Sparkles size={18} aria-hidden="true" />
                      Validate Idea
                    </button>
                  </div>
                </div>

                

                {analysisError ? (
                  <div className="analysis-report__message">
                    <ErrorMessage
                      message={analysisError}
                      onRetry={() => handleValidateIdea(false)}
                    />
                  </div>
                ) : null}

                {isAnalysisLoading ? (
                  <LoadingSpinner label="Generating AI validation report..." />
                ) : analysis ? (
                  <div className="analysis-report">
                    <div className="analysis-score">
                      <Brain size={24} aria-hidden="true" />
                      <div>
                        <span>{analysis.aiScore}</span>
                        <p>AI Score</p>
                      </div>
                    </div>

                    <AnalysisSection
                      title="Startup Summary"
                      content={analysis.startupSummary}
                    />
                    <AnalysisSection
                      title="Problem Statement"
                      content={analysis.problemStatement}
                    />
                    <AnalysisSection
                      title="Target Audience"
                      content={analysis.targetAudience}
                    />
                    <AnalysisSection
                      title="Market Opportunity"
                      content={analysis.marketOpportunity}
                    />
                    <AnalysisSection
                      title="Competitor Analysis"
                      content={analysis.competitorAnalysis}
                    />
                    <AnalysisList title="Strengths" items={analysis.strengths} />
                    <AnalysisList
                      title="Weaknesses"
                      items={analysis.weaknesses}
                    />
                    <AnalysisList title="Risks" items={analysis.risks} />
                    <AnalysisSection
                      title="Suggested MVP"
                      content={analysis.suggestedMvp}
                    />
                    <AnalysisSection
                      title="Revenue Model"
                      content={analysis.revenueModel}
                    />
                  </div>
                ) : (
                  <EmptyState
                    title="No AI validation yet"
                    message="Generate a structured startup validation report for this project."
                    actionLabel="Validate Idea"
                    onAction={() => handleValidateIdea(false)}
                  />
                )}
              </section>
            </>
          ) : (
            <section className="panel">
              <EmptyState
                title="Project not found"
                message="The project may have been deleted or you may not have access to it."
                actionLabel="Back to Dashboard"
                onAction={() => navigate("/dashboard")}
              />
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

function AnalysisSection({ title, content }) {
  return (
    <article className="analysis-section">
      <h3>{title}</h3>
      <p>{content || "Not available"}</p>
    </article>
  );
}

function AnalysisList({ title, items = [] }) {
  return (
    <article className="analysis-section">
      <h3>{title}</h3>
      {items.length ? (
        <ul>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>Not available</p>
      )}
    </article>
  );
}
