import { SignUp } from "@clerk/react-router";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <SignUp 
        signInUrl="/sign-in"
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