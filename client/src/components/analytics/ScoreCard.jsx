import "../../styles/analytics.css";
export default function ScoreCard({
  title,
  score,
  value,
}) {
  return (
    <div className="panel analytics-score-card">

      <p>{title}</p>

      <h2>
        {score !== undefined
          ? `${score}/100`
          : value}
      </h2>

    </div>
  );
}