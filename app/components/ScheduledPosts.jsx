export default function ScheduledPosts() {
  const scheduledPosts = [
    {
      id: 1,
      title: "Morning Motivation Reel",
      platform: "Instagram",
      type: "Video Reel",
      scheduledTime: "Today, 9:00 AM",
      status: "scheduled",
      thumbnail: "/placeholder.svg?height=40&width=40",
      icon: "📷",
    },
    {
      id: 2,
      title: "Leadership Tips Article",
      platform: "LinkedIn",
      type: "Article",
      scheduledTime: "Today, 2:00 PM",
      status: "scheduled",
      thumbnail: "/placeholder.svg?height=40&width=40",
      icon: "💼",
    },
    {
      id: 3,
      title: "Quick Win Strategy",
      platform: "YouTube",
      type: "Short",
      scheduledTime: "Tomorrow, 10:00 AM",
      status: "draft",
      thumbnail: "/placeholder.svg?height=40&width=40",
      icon: "📺",
    },
    {
      id: 4,
      title: "Industry Insights Thread",
      platform: "Twitter",
      type: "Thread",
      scheduledTime: "Tomorrow, 11:00 AM",
      status: "scheduled",
      thumbnail: "/placeholder.svg?height=40&width=40",
      icon: "🐦",
    },
    {
      id: 5,
      title: "Weekly Newsletter",
      platform: "Email",
      type: "Newsletter",
      scheduledTime: "Friday, 8:00 AM",
      status: "scheduled",
      thumbnail: "/placeholder.svg?height=40&width=40",
      icon: "📧",
    },
  ]

  const upcomingPosts = scheduledPosts.filter((post) => post.status === "scheduled")
  const draftPosts = scheduledPosts.filter((post) => post.status === "draft")

  return (
    <div className="space-y-6">
      {/* Upcoming Posts */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Upcoming Posts</h3>
          <span className="text-sm text-muted-foreground">{upcomingPosts.length} scheduled</span>
        </div>
        <div className="space-y-3">
          {upcomingPosts.map((post) => (
            <div key={post.id} className="flex items-center space-x-3 p-3 bg-secondary rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-input rounded-lg flex items-center justify-center">
                  <span className="text-lg text-primary">{post.icon}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{post.title}</p>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>{post.platform}</span>
                  <span>•</span>
                  <span>{post.type}</span>
                </div>
                <p className="text-xs text-green-400 mt-1">{post.scheduledTime}</p>
              </div>
              <div className="flex-shrink-0">
                <button className="p-1 text-muted-foreground hover:text-white">
                  <span className="text-sm">⋯</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Draft Posts */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Drafts</h3>
          <span className="text-sm text-muted-foreground">{draftPosts.length} drafts</span>
        </div>
        <div className="space-y-3">
          {draftPosts.map((post) => (
            <div key={post.id} className="flex items-center space-x-3 p-3 bg-secondary rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-input rounded-lg flex items-center justify-center">
                  <span className="text-lg text-primary">{post.icon}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{post.title}</p>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>{post.platform}</span>
                  <span>•</span>
                  <span>{post.type}</span>
                </div>
                <p className="text-xs text-yellow-400 mt-1">Ready to schedule</p>
              </div>
              <div className="flex-shrink-0 flex space-x-1">
                <button className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded font-medium hover:bg-primary/80">
                  Schedule
                </button>
                <button className="p-1 text-muted-foreground hover:text-white">
                  <span className="text-sm">⋯</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <button className="w-full btn-primary text-sm py-2">📅 Schedule New Post</button>
          <button className="w-full btn-secondary text-sm py-2">📝 Create Content Series</button>
          <button className="w-full bg-secondary hover:bg-secondary/80 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            📊 View Analytics
          </button>
        </div>
      </div>
    </div>
  )
}
