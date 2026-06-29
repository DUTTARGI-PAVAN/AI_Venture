import { BarChart3, BriefcaseBusiness, Rocket, TrendingUp } from "lucide-react";

function countByStage(projects, stage) {
  return projects.filter((project) => project.stage === stage).length;
}

export default function DashboardStats({ projects }) {
  const stats = [
    {
      label: "Total Projects",
      value: projects.length,
      icon: BriefcaseBusiness,
    },
    {
      label: "Idea Stage",
      value: countByStage(projects, "Idea"),
      icon: Rocket,
    },
    {
      label: "MVP or Growth",
      value:
        countByStage(projects, "MVP") + countByStage(projects, "Growth"),
      icon: TrendingUp,
    },
    {
      label: "Scale Stage",
      value: countByStage(projects, "Scale"),
      icon: BarChart3,
    },
  ];

  return (
    <section className="stats-grid" aria-label="Dashboard statistics">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <article className="stat-card" key={stat.label}>
            <div className="stat-card__icon">
              <Icon size={20} aria-hidden="true" />
            </div>
            <div>
              <p className="stat-card__label">{stat.label}</p>
              <strong className="stat-card__value">{stat.value}</strong>
            </div>
          </article>
        );
      })}
    </section>
  );
}
