export default function ScoreGauge({ score = 0, label = "AI Score" }) {
  const normalizedScore = Math.min(100, Math.max(0, Number(score) || 0));

  return (
    <div className="score-gauge">
      <div
        className="score-gauge__ring"
        style={{ "--score": `${normalizedScore * 3.6}deg` }}
        aria-label={`${label}: ${normalizedScore} out of 100`}
      >
        <span>{normalizedScore}</span>
      </div>
      <p>{label}</p>
    </div>
  );
}
