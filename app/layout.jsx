import "./globals.css";
import SessionProvider from "./components/SessionProvider";

export const metadata = {
  title: "ContentRealm™ - Turn Your Voice Into A Content Empire",
  description:
    "AI-powered content transformation suite for speakers, coaches, pastors, and thought leaders",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
