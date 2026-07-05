import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import SidebarNavigation from "../components/layout/SidebarNavigation";
import TopNavbar from "../components/layout/TopNavbar";

import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorMessage from "../components/ui/ErrorMessage";

import AgentCard from "../components/boardroom/AgentCard";
import ConsensusCard from "../components/boardroom/ConsensusCard";
import DecisionBadge from "../components/boardroom/DecisionBadge";

import { getBoardroom, runBoardroom } from "../services/boardroomService";
import useStudioStore from "../store/useStudioStore";
import "../styles/boardroom.css";

export default function BoardroomPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const { user, logout } = useStudioStore();

  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const [boardroom, setBoardroom] = useState(null);

  const loadBoardroom = async () => {
    try {
      setLoading(true);

      const data = await getBoardroom(projectId);

      setBoardroom(data.boardroom);
    } catch {
      setBoardroom(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBoardroom();
  }, [projectId]);

  const handleGenerate = async () => {
    try {
      setRunning(true);
      setError("");

      const data = await runBoardroom(projectId);

      setBoardroom(data.boardroom);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to generate boardroom discussion."
      );
    } finally {
      setRunning(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="app-shell">
        <SidebarNavigation />
        <main className="main-content">
          <LoadingSpinner label="Loading Boardroom..." />
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <SidebarNavigation />

      <main className="main-content">

        <TopNavbar
          user={user}
          onLogout={handleLogout}
        />

        <section className="topbar boardroom-topbar">

          <div>

  <p className="eyebrow">
    AI Executive Meeting
  </p>

  <h1 className="topbar__title">
    🧠 AI Boardroom
  </h1>

  <p className="page-intro">
    Five AI executives independently evaluated your startup,
    discussed its strengths and risks, and reached a collective
    investment recommendation.
  </p>

</div>

          {!boardroom && (

            <button
              className="btn btn--primary"
              onClick={handleGenerate}
              disabled={running}
            >
              {running
                ? "Running Boardroom..."
                : "Run AI Boardroom"}
            </button>

          )}

        </section>

        {error && (
          <ErrorMessage
            message={error}
            onRetry={handleGenerate}
          />
        )}

        {boardroom && (

          <>

            <DecisionBadge
              decision={boardroom.finalDecision}
              score={boardroom.averageScore}
            />

            <section className="boardroom-grid">

              {boardroom.agents.map((agent) => (

                <AgentCard
                  key={agent.role}
                  agent={agent}
                />

              ))}

            </section>

            <ConsensusCard
              consensus={boardroom.consensus}
            />

          </>

        )}

      </main>

    </div>
  );
}