export default function RecentContent() {
  const recentContent = [
    {
      title: "Sunday Sermon: Faith in Action",
      type: "Video",
      outputs: 12,
      status: "Completed",
      date: "2 hours ago",
      thumbnail: "/placeholder.svg?height=60&width=60",
    },
    {
      title: "Leadership Podcast Episode 45",
      type: "Audio",
      outputs: 8,
      status: "Processing",
      date: "4 hours ago",
      thumbnail: "/placeholder.svg?height=60&width=60",
    },
    {
      title: "Keynote: Digital Transformation",
      type: "Video",
      outputs: 15,
      status: "Completed",
      date: "1 day ago",
      thumbnail: "/placeholder.svg?height=60&width=60",
    },
  ]

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Recent Content</h3>
        <button className="text-primary hover:text-primary/80 text-sm font-medium">View All</button>
      </div>
      <div className="space-y-4">
        {recentContent.map((content, index) => (
          <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-secondary">
            <img
              src={content.thumbnail || "/placeholder.svg"}
              alt={content.title}
              className="w-12 h-12 rounded-lg object-cover bg-muted"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">{content.title}</p>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>{content.type}</span>
                <span>•</span>
                <span>{content.outputs} outputs</span>
                <span>•</span>
                <span>{content.date}</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  content.status === "Completed" ? "bg-green-900/30 text-green-300" : "bg-yellow-900/30 text-yellow-300"
                }`}
              >
                {content.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
