export default function QuickActions() {
  const actions = [
    {
      title: "Upload Video",
      description: "Transform your video into multiple content formats",
      icon: "🎥",
      color: "bg-purple-600",
    },
    {
      title: "Upload Audio",
      description: "Convert podcast or audio into written content",
      icon: "🎙️",
      color: "bg-green-600",
    },
    {
      title: "Upload Document",
      description: "Transform PDFs and transcripts into social content",
      icon: "📄",
      color: "bg-blue-600",
    },
    {
      title: "Record Now",
      description: "Start recording directly in the platform",
      icon: "🔴",
      color: "bg-red-600",
    },
  ]

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className="w-full flex items-center p-3 rounded-lg border border-border hover:border-primary hover:bg-secondary transition-colors duration-200"
          >
            <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-white mr-3`}>
              <span className="text-lg">{action.icon}</span>
            </div>
            <div className="text-left">
              <p className="font-medium text-white">{action.title}</p>
              <p className="text-sm text-muted-foreground">{action.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
