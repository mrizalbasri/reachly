import { Link } from '@tanstack/react-router'

export function LandingFooter() {
  return (
    <footer className="bg-white border-t border-[#EEEEF0] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <img
            src="/logo.webp"
            alt="Reachly Logo"
            className="w-7 h-7 rounded-lg object-contain shadow-xs"
          />
          <span className="font-extrabold text-base text-[#1C1C1E] tracking-tight">
            Reachly<span className="text-[#7C3AED]">.</span>
          </span>
        </div>

        <div className="text-xs text-[#8E8E93] text-center md:text-left">
          &copy; 2026 Reachly. Platform Manajemen Influencer &amp; KOL Marketing.
        </div>

        <div className="flex items-center gap-6 text-xs text-[#8E8E93] font-medium">
          <Link to="/dashboard" className="hover:text-[#7C3AED] transition-colors">
            Dashboard
          </Link>
          <Link to="/kol-directory" className="hover:text-[#7C3AED] transition-colors">
            Direktori
          </Link>
          <Link to="/pipeline" className="hover:text-[#7C3AED] transition-colors">
            Pipeline
          </Link>
          <Link to="/analytics" className="hover:text-[#7C3AED] transition-colors">
            Analytics
          </Link>
        </div>
      </div>
    </footer>
  )
}
