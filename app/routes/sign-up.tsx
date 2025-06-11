import { SignUp } from "@clerk/react-router";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="w-full max-w-md">
        <SignUp 
          signInUrl="/sign-in"
          forceRedirectUrl="/dashboard"
          fallbackRedirectUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-lg border-0",
              headerTitle: "text-2xl font-bold",
              headerSubtitle: "text-gray-600",
              socialButtonsBlockButton: "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700",
              socialButtonsBlockButtonText: "font-medium",
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
              footerActionLink: "text-blue-600 hover:text-blue-700",
            }
          }}
        />
      </div>
    </div>
  );
}