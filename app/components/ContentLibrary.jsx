export default function ContentLibrary() {
  const contentItems = [
    {
      id: 1,
      title: "Sunday Sermon: Faith in Action",
      type: "Video",
      date: "2024-01-15",
      outputs: 12,
      status: "Completed",
      thumbnail: "/placeholder.svg?height=100&width=100",
      formats: ["Reels", "Quote Cards", "Blog Post", "Social Captions"],
    },
    {
      id: 2,
      title: "Leadership Podcast Episode 45",
      type: "Audio",
      date: "2024-01-14",
      outputs: 8,
      status: "Processing",
      thumbnail: "/placeholder.svg?height=100&width=100",
      formats: ["Article", "Twitter Thread", "LinkedIn Post"],
    },
    {
      id: 3,
      title: "Keynote: Digital Transformation",
      type: "Video",
      date: "2024-01-13",
      outputs: 15,
      status: "Completed",
      thumbnail: "/placeholder.svg?height=100&width=100",
      formats: ["YouTube Shorts", "Instagram Reels", "Blog Article", "Email Newsletter"],
    },
    {
      id: 4,
      title: "Morning Devotional Series",
      type: "Audio",
      date: "2024-01-12",
      outputs: 10,
      status: "Completed",
      thumbnail: "/placeholder.svg?height=100&width=100",
      formats: ["Quote Cards", "Instagram Stories", "Twitter Posts"],
    },
    {
      id: 5,
      title: "Business Strategy Workshop",
      type: "Video",
      date: "2024-01-11",
      outputs: 18,
      status: "Completed",
      thumbnail: "/placeholder.svg?height=100&width=100",
      formats: ["LinkedIn Articles", "YouTube Shorts", "Email Series", "Slide Decks"],
    },
    {
      id: 6,
      title: "Weekly Team Meeting Notes",
      type: "Document",
      date: "2024-01-10",
      outputs: 6,
      status: "Completed",
      thumbnail: "/placeholder.svg?height=100&width=100",
      formats: ["Meeting Summary", "Action Items", "Follow-up Emails"],
    },
  ]

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contentItems.map((item) => (
          <div key={item.id} className="card hover:border-primary transition-colors">
            <div className="flex items-start space-x-4">
              <img
                src={item.thumbnail || "/placeholder.svg"}
                alt={item.title}
                className="w-16 h-16 rounded-lg object-cover bg-input"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white truncate">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.type} • {item.date}
                </p>
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.status === "Completed"
                        ? "bg-green-900/30 text-green-300"
                        : "bg-yellow-900/30 text-yellow-300"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">{item.outputs} content pieces generated:</p>
              <div className="flex flex-wrap gap-1">
                {item.formats.map((format, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-secondary text-muted-foreground border border-border"
                  >
                    {format}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <button className="flex-1 btn-primary text-sm py-2">View Content</button>
              <button className="px-3 py-2 text-muted-foreground hover:text-white border border-border rounded-lg hover:border-ring">
                ⋯
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
