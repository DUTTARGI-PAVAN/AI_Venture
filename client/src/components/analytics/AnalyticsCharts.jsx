import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const chartColors = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#0f766e"];

function EmptyChart({ label }) {
  return <div className="chart-empty">{label}</div>;
}

export default function AnalyticsCharts({ charts }) {
  const hasScoreDistribution = charts.scoreDistribution.some((item) => item.value > 0);
  const hasStatusData = charts.projectsByStatus.length > 0;
  const hasIndustryData = charts.projectsByIndustry.length > 0;
  const hasTrendData = charts.scoreTrend.length > 0;

  return (
    <section className="analytics-chart-grid">
      <article className="panel analytics-chart-panel">
        <div className="panel__header">
          <div>
            <p className="eyebrow">Scores</p>
            <h2 className="panel__title">AI score distribution</h2>
          </div>
        </div>
        <div className="analytics-chart">
          {hasScoreDistribution ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={charts.scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart label="No analyzed projects yet" />
          )}
        </div>
      </article>

      <article className="panel analytics-chart-panel">
        <div className="panel__header">
          <div>
            <p className="eyebrow">Portfolio</p>
            <h2 className="panel__title">Projects by status</h2>
          </div>
        </div>
        <div className="analytics-chart">
          {hasStatusData ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={charts.projectsByStatus}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={92}
                  paddingAngle={3}
                >
                  {charts.projectsByStatus.map((entry, index) => (
                    <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart label="No projects yet" />
          )}
        </div>
      </article>

      <article className="panel analytics-chart-panel">
        <div className="panel__header">
          <div>
            <p className="eyebrow">Industry</p>
            <h2 className="panel__title">Projects by industry</h2>
          </div>
        </div>
        <div className="analytics-chart">
          {hasIndustryData ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={charts.projectsByIndustry} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={110} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart label="No industry data yet" />
          )}
        </div>
      </article>

      <article className="panel analytics-chart-panel">
        <div className="panel__header">
          <div>
            <p className="eyebrow">Trend</p>
            <h2 className="panel__title">Average score trend</h2>
          </div>
        </div>
        <div className="analytics-chart">
          {hasTrendData ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={charts.scoreTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="averageScore"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart label="No trend data yet" />
          )}
        </div>
      </article>
    </section>
  );
}
