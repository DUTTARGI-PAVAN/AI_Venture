
export default function AnalyticsHero({ project }) {
  return (
    <section className="analytics-hero panel">

      <p className="eyebrow">PROJECT ANALYTICS</p>

      <h1>{project.title}</h1>

      <p className="analytics-description">
        {project.description}
      </p>

      <div className="analytics-tags">

        <span>{project.industry}</span>

        <span>{project.stage}</span>

      </div>

    </section>
  );
}