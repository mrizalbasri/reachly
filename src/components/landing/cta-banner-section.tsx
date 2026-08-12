import { Link } from '@tanstack/react-router'
import { Button } from '../ui/button'
import { ArrowRight, ShieldCheck, Zap, PieChart, Layers } from 'lucide-react'
import { Badge } from '../ui/badge'
import { ScrollReveal } from '../ui/scroll-reveal'

export function CtaBannerSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal variant="scale-in">
          <div className="relative rounded-3xl bg-gradient-to-br from-purple-50 via-pink-50/40 to-purple-100 border border-purple-200/60 p-8 sm:p-14 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10 shadow-xl shadow-purple-900/5 hover:border-purple-300 transition-all duration-300">
            {/* Background Decorative Ambient Glows */}
            <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-purple-300/30 blur-3xl pointer-events-none animate-pulse-glow" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-pink-300/30 blur-3xl pointer-events-none animate-pulse-glow" />

            {/* Left Text & CTA */}
            <div className="max-w-xl space-y-4 text-center md:text-left z-10">
              <h2 className="text-3xl sm:text-5xl font-black text-[#1C1C1E] tracking-tight leading-tight">
                Mulai Rapikan Data KOL <br />
                <span className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] bg-clip-text text-transparent">
                  Sekarang Juga.
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-[#8E8E93] leading-relaxed">
                Bebas biaya pendaftaran. Mulai kelola kerja sama influencer produk Anda dengan lebih terstruktur dan privat.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
                <Link to="/dashboard">
                  <Button size="lg" className="rounded-full px-8 py-3.5 text-xs font-bold bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-lg shadow-purple-500/25 transition-all hover:scale-105 active:scale-95 animate-shimmer">
                    Mulai Coba Gratis
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Side: Sleek Glassmorphic Value Callout Card */}
            <div className="relative z-10 shrink-0 w-full max-w-sm">
              <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-white/80 p-6 shadow-2xl shadow-purple-900/10 space-y-4 hover:scale-[1.02] transition-transform duration-300">
                <div className="flex items-center justify-between pb-3 border-b border-[#EEEEF0]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#7C3AED]" />
                    <span className="text-xs font-bold text-[#1C1C1E]">Ruang Kerja Privat</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-600 border-emerald-200">
                    100% Akses Gratis
                  </Badge>
                </div>

                {/* 3 Value Features */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-[#FBFBFC] border border-[#EEEEF0] hover:border-purple-200 transition-all">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center font-bold shrink-0 mt-0.5">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1C1C1E]">Siap dalam 30 Detik</div>
                      <div className="text-[10px] text-[#8E8E93]">Langsung catat database KOL pertama Anda</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-[#FBFBFC] border border-[#EEEEF0] hover:border-purple-200 transition-all">
                    <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold shrink-0 mt-0.5">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1C1C1E]">Alokasi Budget Presisi</div>
                      <div className="text-[10px] text-[#8E8E93]">Pantau sisa budget campaign real-time</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-[#FBFBFC] border border-[#EEEEF0] hover:border-purple-200 transition-all">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0 mt-0.5">
                      <PieChart className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1C1C1E]">Kalkulasi ROI Otomatis</div>
                      <div className="text-[10px] text-[#8E8E93]">Ketahui CPM &amp; CPE tanpa rumus Excel</div>
                    </div>
                  </div>
                </div>

                {/* Bottom Tag */}
                <div className="pt-2 text-center border-t border-[#EEEEF0]">
                  <span className="text-[10px] text-[#8E8E93]">Tanpa Biaya Tersembunyi • 100% Akses Fitur</span>
                </div>
              </div>
            </div>

          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

