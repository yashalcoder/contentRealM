import "./globals.css";

export const metadata = {
  title: "ContentRealm™ - Turn Your Voice Into A Content Empire",
  description:
    "AI-powered content transformation suite for speakers, coaches, pastors, and thought leaders",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">{children}</body>
    </html>
  );
}
