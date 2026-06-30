import {
  Activity,
  BarChart3,
  CheckCircle2,
  CircleArrowDown,
  CircleArrowUp,
  FolderKanban,
} from "lucide-react";

const cards = [
  {
    key: "totalProjects",
    label: "Total Projects",
    icon: FolderKanban,
  },
  {
    key: "projectsAnalyzed",
    label: "Projects Analyzed",
    icon: CheckCircle2,
  },
  {
    key: "averageScore",
    label: "Average AI Score",
    icon: BarChart3,
    suffix: "/100",
  },
  {
    key: "highestScore",
    label: "Highest Score",
    icon: CircleArrowUp,
    suffix: "/100",
  },
  {
    key: "lowestScore",
    label: "Lowest Score",
    icon: CircleArrowDown,
    suffix: "/100",
  },
  {
    key: "activeProjects",
    label: "Active Projects",
    icon: Activity,
  },
];

export default function AnalyticsCards({ overview }) {
  return (
    <section className="analytics-card-grid" aria-label="Analytics overview">
      {cards.map((card) => {
        const Icon = card.icon;
        const value = overview?.[card.key] ?? 0;

        return (
          <article className="stat-card" key={card.key}>
            <div className="stat-card__icon">
              <Icon size={20} aria-hidden="true" />
            </div>
            <div>
              <p className="stat-card__label">{card.label}</p>
              <strong className="stat-card__value">
                {value}
                {card.suffix || ""}
              </strong>
            </div>
          </article>
        );
      })}
    </section>
  );
}
