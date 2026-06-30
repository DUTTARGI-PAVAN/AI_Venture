import { CheckCircle2 } from "lucide-react";

export default function RecommendationsPanel({ recommendations = [] }) {
  return (
    <section className="panel">
      <div className="panel__header">
        <div>
          <p className="eyebrow">Recommendations</p>
          <h2 className="panel__title">Next best moves</h2>
          <p className="panel__meta">Actions generated from stored AI validation reports.</p>
        </div>
      </div>
      <div className="recommendation-grid">
        {recommendations.map((recommendation) => (
          <article className="recommendation-card" key={recommendation}>
            <CheckCircle2 size={19} aria-hidden="true" />
            <p>{recommendation}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
