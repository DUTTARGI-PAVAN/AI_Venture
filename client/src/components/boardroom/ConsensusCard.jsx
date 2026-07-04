export default function ConsensusCard({ consensus }) {
  return (
    <section className="panel consensus-card">

      <div className="panel__header">

        <div>

          <p className="eyebrow">
            BOARD CONSENSUS
          </p>

          <h2 className="panel__title">
            Final Executive Discussion
          </h2>

        </div>

      </div>

      <div className="consensus-body">

        <pre>{consensus}</pre>

      </div>

    </section>
  );
}