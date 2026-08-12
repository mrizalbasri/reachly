import { Link } from '@tanstack/react-router'
import { useAuth, UserButton } from '@clerk/tanstack-react-start'
import { Button } from '../ui/button'

export function LandingNavbar() {
  const { isSignedIn, isLoaded } = useAuth()

  const navLinks = [
    { name: 'Beranda', href: '#hero' },
    { name: 'Fitur', href: '#features' },
    { name: 'Keunggulan', href: '#why-us' },
    { name: 'Kalkulator', href: '#calculator' },
    { name: 'Testimoni', href: '#testimonials' },
  ]

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-[#EEEEF0] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src="/logo.webp"
            alt="Reachly Logo"
            className="w-8 h-8 rounded-xl object-contain shadow-xs transition-transform group-hover:scale-105"
          />
          <span className="font-extrabold text-lg text-[#1C1C1E] tracking-tight">
            Reachly<span className="text-[#7C3AED]">.</span>
          </span>
        </Link>

        {/* Rich Interactive Nav Links with Hover Pill Pill Effect */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-slate-50/80 border border-slate-100/80 text-xs font-semibold text-[#8E8E93]">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-3.5 py-1.5 rounded-full transition-all duration-200 hover:bg-white hover:text-[#7C3AED] hover:shadow-xs active:scale-95"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2.5">
          {isLoaded && isSignedIn ? (
            <>
              <Link to="/dashboard">
                <Button size="sm" className="rounded-full text-xs font-bold px-5 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-md shadow-purple-500/20 active:scale-95 transition-all">
                  Dashboard
                </Button>
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link to="/sign-in">
                <Button variant="ghost" size="sm" className="text-xs font-bold text-[#1C1C1E] hover:bg-purple-50 rounded-full px-4">
                  Masuk
                </Button>
              </Link>
              <Link to="/sign-up">
                <Button size="sm" className="rounded-full text-xs font-bold px-5 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-md shadow-purple-500/20 active:scale-95 transition-all">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
