export default function ContentTypes() {
  const contentOutputs = [
    {
      category: "Video Content",
      icon: "🎥",
      items: ["Instagram Reels (5-15 clips)", "TikTok Shorts", "YouTube Shorts", "LinkedIn Video", "Facebook Video"],
    },
    {
      category: "Written Content",
      icon: "📝",
      items: [
        "Blog Article (SEO optimized)",
        "LinkedIn Article",
        "Email Newsletter",
        "Social Captions",
        "Twitter Threads",
      ],
    },
    {
      category: "Visual Content",
      icon: "📸",
      items: ["Quote Cards (5-10)", "Instagram Carousels", "LinkedIn Graphics", "Story Templates", "Audiograms"],
    },
    {
      category: "Scripts & Promos",
      icon: "🎙️",
      items: ["YouTube Video Script", "Podcast Teaser", "Slide Deck Copy", "Promo Email", "CTA Scripts"],
    },
  ]

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-4">What You'll Get</h3>
      <p className="text-sm text-muted-foreground mb-6">
        From one upload, we'll automatically generate all these content formats:
      </p>

      <div className="space-y-6">
        {contentOutputs.map((category, index) => (
          <div key={index}>
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-lg text-primary">{category.icon}</span>
              <h4 className="font-medium text-white">{category.category}</h4>
            </div>
            <ul className="space-y-1 ml-6">
              {category.items.map((item, itemIndex) => (
                <li key={itemIndex} className="text-sm text-muted-foreground flex items-center">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
        <p className="text-sm text-primary-foreground">
          <strong>Time Saved:</strong> What normally takes 8-12 hours of manual work will be completed in minutes with
          AI.
        </p>
      </div>
    </div>
  )
}
