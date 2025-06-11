import { SignIn } from "@clerk/react-router";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </div>
        
        <div className="mt-8">
          <SignIn 
            signUpUrl="/sign-up"
            forceRedirectUrl="/dashboard"
            fallbackRedirectUrl="/dashboard"
            routing="path"
            path="/sign-in"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-lg border-0 w-full",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 transition-colors",
                socialButtonsBlockButtonText: "font-medium",
                formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white transition-colors w-full",
                footerActionLink: "text-blue-600 hover:text-blue-700",
                formFieldInput: "block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500",
                formFieldLabel: "block text-sm font-medium text-gray-700",
              },
              layout: {
                socialButtonsPlacement: "top",
                socialButtonsVariant: "blockButton",
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}