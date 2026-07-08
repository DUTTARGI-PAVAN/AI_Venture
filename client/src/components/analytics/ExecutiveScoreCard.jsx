
export default function ExecutiveScoreCard({
  executives,
}) {
  return (
    <section className="panel analytics-section">

      <h2>Executive Scores</h2>

      {executives.map((agent) => (

        <div
          key={agent.role}
          className="executive-row"
        >

          <span>{agent.role}</span>

          <div className="executive-progress">

            <div
              className="executive-fill"
              style={{
                width: `${agent.score}%`,
              }}
            />

          </div>

          <strong>{agent.score}</strong>

        </div>

      ))}

    </section>
  );
}