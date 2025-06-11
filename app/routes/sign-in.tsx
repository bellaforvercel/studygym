import { SignIn } from "@clerk/react-router";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <SignIn 
        signUpUrl="/sign-up"
        forceRedirectUrl="/dashboard"
        fallbackRedirectUrl="/dashboard"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg",
          }
        }}
      />
    </div>
  );
}