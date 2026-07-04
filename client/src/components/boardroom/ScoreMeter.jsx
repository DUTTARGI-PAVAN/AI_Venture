export default function ScoreMeter({ score }) {

  const value = Math.min(
    10,
    Math.max(0, Number(score) || 0)
  );

  const percentage = value * 10;

  let color = "#ef4444";

  if (percentage >= 80) color = "#22c55e";
  else if (percentage >= 60) color = "#f59e0b";

  return (
    <div className="score-meter">

      <div
        className="score-meter__circle"
        style={{
          background: `conic-gradient(${color} ${percentage}%, #e5e7eb ${percentage}% 100%)`,
        }}
      >

        <div className="score-meter__inner">
          {value}
        </div>

      </div>

    </div>
  );
}