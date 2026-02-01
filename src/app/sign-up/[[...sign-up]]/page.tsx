import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#F5F7FA]">
      <SignUp 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-white shadow-xl",
            headerTitle: "text-[#1A1A2E]",
            headerSubtitle: "text-[#6B7280]",
            socialButtonsBlockButton: "border-gray-300 hover:bg-gray-50",
            formButtonPrimary: "bg-[#0066FF] hover:bg-[#0052CC]",
            footerActionLink: "text-[#0066FF] hover:text-[#0052CC]",
          },
        }}
        afterSignUpUrl="/onboarding"
      />
    </main>
  );
}
