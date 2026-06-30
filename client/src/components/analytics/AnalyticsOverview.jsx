import ScoreGauge from "./ScoreGauge";

export default function AnalyticsOverview({ overview, highestProject, lowestProject }) {
  return (
    <section className="analytics-overview">
      <article className="panel analytics-overview__main">
        <div className="panel__header">
          <div>
            <p className="eyebrow">Portfolio Readiness</p>
            <h2 className="panel__title">AI score overview</h2>
            <p className="panel__meta">
              {overview.projectsAnalyzed} of {overview.totalProjects} projects analyzed
            </p>
          </div>
          <ScoreGauge score={overview.averageScore} label="Average" />
        </div>

        <div className="analytics-progress">
          <div>
            <span>Analysis coverage</span>
            <strong>{overview.analyzedPercentage}%</strong>
          </div>
          <div className="analytics-progress__track">
            <span style={{ width: `${overview.analyzedPercentage}%` }} />
          </div>
        </div>
      </article>

      <article className="panel analytics-highlight">
        <div>
          <p className="eyebrow">Highest Scoring Project</p>
          <h3>{highestProject?.title || "Not available"}</h3>
          <p>{highestProject ? `${highestProject.industry} · ${highestProject.stage}` : "Validate projects to reveal a leader."}</p>
        </div>
        <ScoreGauge score={highestProject?.aiScore || 0} label="Highest" />
      </article>

      <article className="panel analytics-highlight">
        <div>
          <p className="eyebrow">Lowest Scoring Project</p>
          <h3>{lowestProject?.title || "Not available"}</h3>
          <p>{lowestProject ? `${lowestProject.industry} · ${lowestProject.stage}` : "Validate projects to reveal risk areas."}</p>
        </div>
        <ScoreGauge score={lowestProject?.aiScore || 0} label="Lowest" />
      </article>
    </section>
  );
}
