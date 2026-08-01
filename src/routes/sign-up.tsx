import { SignUp } from '@clerk/tanstack-react-start'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sign-up')({
  component: SignUpPage,
})

function SignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-8">
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        forceRedirectUrl="/kol-directory"
        appearance={{
          elements: {
            card: 'shadow-lg border border-[#EEEEF0] rounded-2xl p-6 bg-white',
            formButtonPrimary:
              'bg-[#7C3AED] hover:bg-[#6D28D9] text-sm font-medium transition-all shadow-sm',
            footerActionLink: 'text-[#7C3AED] hover:text-[#6D28D9] font-medium',
          },
        }}
      />
    </div>
  )
}
