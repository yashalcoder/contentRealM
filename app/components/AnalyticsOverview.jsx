export default function AnalyticsOverview() {
  const overviewStats = [
    {
      title: "Total Content Generated",
      value: "2,847",
      change: "+12%",
      changeType: "positive",
      icon: "📝",
      description: "Pieces created this month",
    },
    {
      title: "Engagement Rate",
      value: "94.2%",
      change: "+5.3%",
      changeType: "positive",
      icon: "📈",
      description: "Average across all platforms",
    },
    {
      title: "Time Saved",
      value: "156 hrs",
      change: "+8%",
      changeType: "positive",
      icon: "⏰",
      description: "Compared to manual creation",
    },
    {
      title: "Revenue Impact",
      value: "$24,500",
      change: "+18%",
      changeType: "positive",
      icon: "💰",
      description: "Attributed to content",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {overviewStats.map((stat, index) => (
        <div key={index} className="card hover:border-primary transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl text-primary">{stat.icon}</div>
            <span
              className={`text-sm font-medium px-2 py-1 rounded-full ${
                stat.changeType === "positive" ? "bg-green-900/20 text-green-400" : "bg-red-900/20 text-red-400"
              }`}
            >
              {stat.change}
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
            <p className="text-xs text-muted-foreground/80">{stat.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
