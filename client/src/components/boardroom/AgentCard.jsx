import {
  Briefcase,
  Cpu,
  DollarSign,
  Megaphone,
  Landmark,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";

import ScoreMeter from "./ScoreMeter";

const roleConfig = {
  CEO: {
    color: "#2563eb",
    icon: Briefcase,
  },
  CTO: {
    color: "#7c3aed",
    icon: Cpu,
  },
  CFO: {
    color: "#16a34a",
    icon: DollarSign,
  },
  CMO: {
    color: "#ea580c",
    icon: Megaphone,
  },
  Investor: {
    color: "#dc2626",
    icon: Landmark,
  },
};

export default function AgentCard({ agent }) {
  const config = roleConfig[agent.role];

const color = config?.color || "#2563eb";

const Icon = config?.icon || Briefcase;

  return (
    <article className="panel boardroom-card">

      <div className="boardroom-card__header">

        <div
  className="boardroom-avatar"
  style={{ background: color }}
>
  <Icon size={20} color="white" />
</div>

        <div>

          <h2>{agent.role}</h2>

          <span className="boardroom-role">
            AI Executive
          </span>

        </div>

        <ScoreMeter score={agent.score} />

      </div>

      <div className="boardroom-section boardroom-strengths">

        <h3>💬 Opinion</h3>

        <p>{agent.opinion}</p>

      </div>

      <div className="boardroom-section boardroom-strengths">

        <h3>
  <CheckCircle2 size={16}/>
  Strengths
</h3>

        <ul>

          {agent.strengths.map((item, index) => (

            <li key={index}>
              {item}
            </li>

          ))}

        </ul>

      </div>

      <div className="boardroom-section boardroom-concerns">

        <h3>
  <AlertTriangle size={16}/>
  Concerns
</h3>

        <ul>

          {agent.concerns.map((item, index) => (

            <li key={index}>
              {item}
            </li>

          ))}

        </ul>

      </div>

      <div className="boardroom-section boardroom-recommendations">

        <h3>
  <Lightbulb size={16}/>
  Recommendations
</h3>

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