export default function PerformanceInsights() {
  const insights = [
    {
      type: "success",
      message: "Your last sermon triggered 3x engagement on quote cards—try 2 more this week.",
      action: "Create Quote Cards",
    },
    {
      type: "info",
      message: "Content balance: 80% long-form, 20% visual. Diversify with Reels.",
      action: "Create Video Reels",
    },
    {
      type: "warning",
      message: "LinkedIn articles perform 40% better on Tuesdays. Schedule accordingly.",
      action: "Schedule Content",
    },
  ]

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-4">AI Performance Insights</h3>
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-l-4 ${
              insight.type === "success"
                ? "bg-green-900/20 border-green-400"
                : insight.type === "info"
                  ? "bg-blue-900/20 border-blue-400"
                  : "bg-yellow-900/20 border-yellow-400"
            }`}
          >
            <p className="text-sm text-muted-foreground mb-2">{insight.message}</p>
            <button className="text-sm font-medium text-primary hover:text-primary/80">{insight.action} →</button>
          </div>
        ))}
      </div>
    </div>
  )
}
