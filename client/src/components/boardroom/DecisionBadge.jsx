export default function DecisionBadge({
  decision,
  score,
}) {

  const colors = {
    Proceed: "decision-success",
    Pivot: "decision-warning",
    Reject: "decision-danger",
  };

  return (
    <section className={`decision-card ${colors[decision]}`}>

      <div>

        <p className="eyebrow">
          FINAL DECISION
        </p>

        <h1>{decision}</h1>

        <p>
          Average Board Score
        </p>

      </div>

      <div className="decision-score">

        {score}/10

      </div>

    </section>
  );
}