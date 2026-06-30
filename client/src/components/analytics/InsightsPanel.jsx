import { Lightbulb } from "lucide-react";

export default function InsightsPanel({ insights = [], recentlyAnalyzed = [] }) {
  return (
    <section className="analytics-side-grid">
      <article className="panel">
        <div className="panel__header">
          <div>
            <p className="eyebrow">AI Insights</p>
            <h2 className="panel__title">Portfolio signals</h2>
          </div>
        </div>
        <div className="analytics-list">
          {insights.length ? (
            insights.map((insight) => (
              <div className="analytics-list__item" key={`${insight.title}-${insight.value}`}>
                <Lightbulb size={18} aria-hidden="true" />
                <div>
                  <strong>{insight.title}</strong>
                  <span>{insight.value}</span>
                  <p>{insight.detail}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="analytics-muted">Validate projects to unlock AI insights.</p>
          )}
        </div>
      </article>

      <article className="panel">
        <div className="panel__header">
          <div>
            <p className="eyebrow">Recent Activity</p>
            <h2 className="panel__title">Recently analyzed</h2>
          </div>
        </div>
        <div className="analytics-list">
          {recentlyAnalyzed.length ? (
            recentlyAnalyzed.map((project) => (
              <div className="recent-analysis" key={project._id}>
                <div>
                  <strong>{project.title}</strong>
                  <span>{project.industry} · {project.stage}</span>
                </div>
                <b>{project.aiScore}</b>
              </div>
            ))
          ) : (
            <p className="analytics-muted">No projects have been analyzed yet.</p>
          )}
        </div>
      </article>
    </section>
  );
}
