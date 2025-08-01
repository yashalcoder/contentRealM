export default function ContentPerformance() {
  const performanceData = [
    {
      format: "Video Reels",
      generated: 145,
      engagement: "96.2%",
      topPlatform: "Instagram",
      trend: "up",
    },
    {
      format: "Quote Cards",
      generated: 89,
      engagement: "92.8%",
      topPlatform: "LinkedIn",
      trend: "up",
    },
    {
      format: "Blog Articles",
      generated: 23,
      engagement: "88.5%",
      topPlatform: "Website",
      trend: "stable",
    },
    {
      format: "Social Captions",
      generated: 234,
      engagement: "85.3%",
      topPlatform: "Twitter",
      trend: "down",
    },
    {
      format: "Email Content",
      generated: 45,
      engagement: "94.7%",
      topPlatform: "Newsletter",
      trend: "up",
    },
  ]

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-6">Content Performance by Format</h3>
      <div className="space-y-4">
        {performanceData.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-white">{item.format}</h4>
                <span
                  className={`text-sm ${
                    item.trend === "up"
                      ? "text-green-400"
                      : item.trend === "down"
                        ? "text-red-400"
                        : "text-muted-foreground"
                  }`}
                >
                  {item.trend === "up" ? "↗️" : item.trend === "down" ? "↘️" : "➡️"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Generated</p>
                  <p className="text-white font-medium">{item.generated}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Engagement</p>
                  <p className="text-white font-medium">{item.engagement}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Top Platform</p>
                  <p className="text-white font-medium">{item.topPlatform}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
