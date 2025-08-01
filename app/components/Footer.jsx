export default function Footer() {
  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-sm">👑</span>
              </div>
              <span className="text-xl font-bold text-white">
                ContentRealm™
              </span>
            </div>
            <p className="text-muted-foreground mb-4">
              Turn your voice into a content empire with AI-powered
              transformation suite built for speakers, coaches, pastors, and
              thought leaders.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-white">
                <span className="sr-only">Twitter</span>
                <span className="text-xl">🐦</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <span className="text-xl">💼</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-white">
                <span className="sr-only">YouTube</span>
                <span className="text-xl">📺</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Product
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-white">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-white">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-white">
                  API
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-white">
                  Integrations
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-white">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-white">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-white">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 mt-8">
          <p className="text-center text-muted-foreground text-sm">
            © 2024 ContentRealm™. All rights reserved. Part of the Realm Tools
            Suite.
          </p>
        </div>
      </div>
    </footer>
  );
}
