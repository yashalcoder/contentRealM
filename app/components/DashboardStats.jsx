export default function DashboardStats() {
  const stats = [
    {
      name: "Content Pieces Created",
      value: "2,847",
      change: "+12%",
      changeType: "positive",
      icon: "📝",
    },
    {
      name: "Time Saved",
      value: "156 hrs",
      change: "+8%",
      changeType: "positive",
      icon: "⏰",
    },
    {
      name: "Engagement Score",
      value: "94.2%",
      change: "+5%",
      changeType: "positive",
      icon: "📈",
    },
    {
      name: "Active Projects",
      value: "23",
      change: "+3",
      changeType: "positive",
      icon: "🎯",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.name} className="card hover:border-primary transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
            <div className="text-3xl text-primary">{stat.icon}</div>
          </div>
          <div className="mt-4 flex items-center">
            <span
              className={`text-sm font-medium ${stat.changeType === "positive" ? "text-green-400" : "text-red-400"}`}
            >
              {stat.change}
            </span>
            <span className="text-sm text-muted-foreground ml-2">from last month</span>
          </div>
        </div>
      ))}
    </div>
  )
}
