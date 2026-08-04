import { SignUp } from '@clerk/tanstack-react-start'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/sign-up')({
  component: SignUpPage,
})

function SignUpPage() {
  return (
    <div className="w-full min-h-[75vh] flex flex-col items-center justify-center py-6">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <Link to="/" className="inline-flex items-center justify-center gap-2.5 group mb-2">
          <img
            src="/logo.webp"
            alt="Reachly Logo"
            className="w-10 h-10 rounded-xl shadow-sm group-hover:scale-105 transition-transform object-contain"
          />
          <span className="font-extrabold text-2xl tracking-tight text-[#1C1C1E] leading-none">
            Reach<span className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] bg-clip-text text-transparent">ly</span>
          </span>
        </Link>
        <p className="text-xs text-[#8E8E93] max-w-xs font-medium">
          Buat Akun Baru & Mulai Kelola Kampanye KOL Anda
        </p>
      </div>

      {/* Perfectly Centered Clerk SignUp Component */}
      <div className="w-full flex justify-center items-center">
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          forceRedirectUrl="/kol-directory"
          appearance={{
            variables: {
              colorPrimary: '#7C3AED',
              colorBackground: '#FFFFFF',
              borderRadius: '1.25rem',
            },
            elements: {
              rootBox: 'mx-auto flex justify-center items-center w-full',
              cardBox: 'mx-auto shadow-2xl border border-[#EEEEF0] rounded-3xl p-6 sm:p-8 bg-white/95 backdrop-blur-xl w-full max-w-md',
              card: 'shadow-none border-0 p-0 bg-transparent w-full',
              headerTitle: 'text-[#1C1C1E] font-extrabold text-xl tracking-tight text-center',
              headerSubtitle: 'text-[#8E8E93] text-xs text-center mt-1 font-medium',
              socialButtonsBlockButton:
                'border border-[#EEEEF0] hover:border-[#7C3AED]/40 hover:bg-purple-50/50 rounded-2xl transition-all font-semibold text-xs py-2.5 shadow-2xs text-[#1C1C1E]',
              dividerLine: 'bg-[#EEEEF0]',
              dividerText: 'text-[#8E8E93] text-[10px] font-bold uppercase tracking-wider bg-white px-3',
              formFieldLabel: 'text-[#1C1C1E] text-xs font-bold mb-1.5',
              formFieldInput:
                'rounded-xl border border-[#EEEEF0] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 text-xs py-2.5 px-3.5 bg-[#FBFBFC] text-[#1C1C1E] font-medium transition-all shadow-2xs',
              formButtonPrimary:
                'bg-gradient-to-r from-[#EC4899] via-[#8B5CF6] to-[#7C3AED] hover:opacity-95 text-white font-extrabold text-xs py-3 rounded-full !border-none !border-0 !outline-none !ring-0 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all tracking-wider transform hover:scale-[1.01]',
              footerActionLink: 'text-[#7C3AED] hover:text-[#6D28D9] font-bold hover:underline',
              footerActionText: 'text-[#8E8E93] text-xs font-medium',
              footer: 'bg-transparent border-t border-[#EEEEF0]/60 pt-4 mt-2',
            },
          }}
        />
      </div>
    </div>
  )
}
