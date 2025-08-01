import LoginForm from "../../components/LoginForm";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center hero-gradient py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold text-lg">👑</span>
            </div>
            <span className="text-3xl font-bold text-white">ContentRealm™</span>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Welcome Back
          </h2>
          <p className="text-muted-foreground">
            Sign in to your content kingdom
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
