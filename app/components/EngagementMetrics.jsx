export default function EngagementMetrics() {
  const platformMetrics = [
    {
      platform: "Instagram",
      icon: "📷",
      followers: "12.5K",
      engagement: "8.2%",
      contentPieces: 89,
      topFormat: "Reels",
    },
    {
      platform: "LinkedIn",
      icon: "💼",
      followers: "8.9K",
      engagement: "12.4%",
      contentPieces: 67,
      topFormat: "Articles",
    },
    {
      platform: "YouTube",
      icon: "📺",
      followers: "15.2K",
      engagement: "6.8%",
      contentPieces: 34,
      topFormat: "Shorts",
    },
    {
      platform: "Twitter",
      icon: "🐦",
      followers: "6.7K",
      engagement: "4.9%",
      contentPieces: 156,
      topFormat: "Threads",
    },
  ]

  const weeklyData = [
    { day: "Mon", engagement: 85 },
    { day: "Tue", engagement: 92 },
    { day: "Wed", engagement: 78 },
    { day: "Thu", engagement: 96 },
    { day: "Fri", engagement: 88 },
    { day: "Sat", engagement: 94 },
    { day: "Sun", engagement: 91 },
  ]

  return (
    <div className="space-y-6">
      {/* Platform Metrics */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-6">Platform Performance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {platformMetrics.map((platform, index) => (
            <div key={index} className="p-4 bg-secondary rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xl text-primary">{platform.icon}</span>
                  <h4 className="font-medium text-white">{platform.platform}</h4>
                </div>
                <span className="text-sm text-muted-foreground">{platform.contentPieces} pieces</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Followers</p>
                  <p className="text-white font-medium">{platform.followers}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Engagement</p>
                  <p className="text-green-400 font-medium">{platform.engagement}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Top Format: <span className="text-primary">{platform.topFormat}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Engagement Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-6">Weekly Engagement Trend</h3>
        <div className="flex items-end justify-between h-32 space-x-2">
          {weeklyData.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-primary rounded-t-sm transition-all duration-300 hover:bg-primary/80"
                style={{ height: `${day.engagement}%` }}
              ></div>
              <div className="mt-2 text-center">
                <p className="text-xs text-muted-foreground">{day.day}</p>
                <p className="text-xs text-white font-medium">{day.engagement}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
