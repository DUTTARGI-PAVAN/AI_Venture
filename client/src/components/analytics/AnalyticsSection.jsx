export default function AnalyticsSection({
  title,
  items,
  text,
}) {
  return (
    <section className="panel analytics-section">

      <h2>{title}</h2>

      {items ? (

        <ul>

          {items.map((item, index) => (

            <li key={index}>
              {item}
            </li>

          ))}

        </ul>

      ) : (

        <p>{text}</p>

      )}

    </section>
  );
}