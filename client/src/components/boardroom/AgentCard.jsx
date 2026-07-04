import ScoreMeter from "./ScoreMeter";

const roleColors = {
  CEO: "#2563eb",
  CTO: "#8b5cf6",
  CFO: "#16a34a",
  CMO: "#ea580c",
  Investor: "#dc2626",
};

export default function AgentCard({ agent }) {
  const color = roleColors[agent.role] || "#2563eb";

  return (
    <article className="panel boardroom-card">

      <div className="boardroom-card__header">

        <div
          className="boardroom-avatar"
          style={{ background: color }}
        >
          {agent.role.charAt(0)}
        </div>

        <div>

          <h2>{agent.role}</h2>

          <span className="boardroom-role">
            AI Executive
          </span>

        </div>

        <ScoreMeter score={agent.score} />

      </div>

      <div className="boardroom-section">

        <h3>Opinion</h3>

        <p>{agent.opinion}</p>

      </div>

      <div className="boardroom-section">

        <h3>Strengths</h3>

        <ul>

          {agent.strengths.map((item, index) => (

            <li key={index}>
              {item}
            </li>

          ))}

        </ul>

      </div>

      <div className="boardroom-section">

        <h3>Concerns</h3>

        <ul>

          {agent.concerns.map((item, index) => (

            <li key={index}>
              {item}
            </li>

          ))}

        </ul>

      </div>

      <div className="boardroom-section">

        <h3>Recommendations</h3>

        <ul>

          {agent.recommendations.map((item, index) => (

            <li key={index}>
              {item}
            </li>

          ))}

        </ul>

      </div>

    </article>
  );
}