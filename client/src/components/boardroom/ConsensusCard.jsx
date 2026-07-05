export default function ConsensusCard({ consensus }) {
  return (
    <section className="panel consensus-card">
      <h2>🏛 Final Executive Discussion</h2>

      <div className="consensus-body">
        <pre>{consensus}</pre>
      </div>
    </section>
  );
}