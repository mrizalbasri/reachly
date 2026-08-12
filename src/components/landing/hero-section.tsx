import { Link } from '@tanstack/react-router'
import { ArrowRight, CheckCircle2, DollarSign, TrendingUp } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { ScrollReveal } from '../ui/scroll-reveal'

export function HeroSection() {
  return (
    <section id="hero" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-[#FAFAFC]">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-r from-purple-200/35 via-pink-200/35 to-blue-100/25 rounded-full blur-[160px] pointer-events-none -z-10 animate-pulse-glow" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        {/* TOP HERO HEADER AREA */}
        <div className="text-center max-w-3xl mx-auto space-y-5 mb-12">
          
          {/* Main Display Headline */}
          <ScrollReveal variant="fade-up" delay={50} duration={900}>
            <h1 className="text-4xl sm:text-6xl lg:text-6xl font-black text-[#1C1C1E] tracking-tight leading-[1.1]">
              Kelola Endorsement KOL <br />
              <span className="bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#5B6EF5] bg-clip-text text-transparent">
                Lebih Terstruktur.
              </span>
            </h1>
          </ScrollReveal>

          {/* Subtitle */}
          <ScrollReveal variant="fade-up" delay={200} duration={900}>
            <p className="text-sm sm:text-base text-[#8E8E93] max-w-2xl mx-auto font-normal leading-relaxed">
              Catat kontak KOL, atur alokasi budget, pantau alur negosiasi, dan hitung ROI otomatis — semua tersimpan privat di akun Anda.
            </p>
          </ScrollReveal>

          {/* Action CTAs */}
          <ScrollReveal variant="fade-up" delay={350} duration={900}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Link to="/dashboard">
                <Button size="lg" className="w-full sm:w-auto rounded-full px-8 py-3.5 text-xs font-extrabold bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-xl shadow-purple-500/25 transition-all hover:scale-105 active:scale-95 animate-shimmer">
                  Mulai Sekarang
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/sign-in">
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 py-3.5 text-xs font-extrabold border-[#EEEEF0] bg-white text-[#1C1C1E] hover:bg-[#FBFBFC] shadow-xs hover:scale-105 active:scale-95 transition-all">
                  Daftar Akun Gratis
                </Button>
              </Link>
            </div>
          </ScrollReveal>

          {/* Micro Trust Points */}
          <ScrollReveal variant="fade-up" delay={450} duration={900}>
            <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-[#8E8E93] font-medium pt-2">
              <div className="flex items-center gap-1.5 transition-transform hover:scale-105">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>100% Data Privat</span>
              </div>
              <div className="flex items-center gap-1.5 transition-transform hover:scale-105">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Bebas File Tercecer</span>
              </div>
              <div className="flex items-center gap-1.5 transition-transform hover:scale-105">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Kalkulasi CPM &amp; CPE Otomatis</span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* BENTO GRID SHOWCASE */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          
          {/* BENTO CARD 1: Budget & ROI Real-time (4 Cols) */}
          <ScrollReveal variant="slide-left" delay={300} duration={950} className="md:col-span-4 flex">
            <div className="w-full rounded-3xl bg-white border border-[#EEEEF0] p-6 shadow-xl shadow-purple-900/5 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 animate-float">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#EEEEF0] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center font-bold">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1C1C1E]">Budget &amp; Efisiensi</div>
                      <div className="text-[10px] text-[#8E8E93]">Alokasi Real-time</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-600 border-emerald-200">
                    Aman
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] uppercase font-bold text-[#8E8E93]">Total Budget Campaign</div>
                  <div className="text-2xl font-black text-[#1C1C1E]">Rp 50.000.000</div>
                  <div className="w-full h-2 rounded-full bg-purple-100 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899] w-[70%] transition-all duration-1000" />
                  </div>
                  <div className="flex justify-between text-[10px] text-[#8E8E93] font-medium pt-1">
                    <span>Terpakai: Rp 35.000.000</span>
                    <span className="text-emerald-600 font-bold">Sisa: Rp 15M</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#EEEEF0] mt-4 flex items-center justify-between text-xs">
                <span className="text-[#8E8E93]">Rata-Rata CPE</span>
                <span className="font-extrabold text-[#7C3AED] flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Rp 450
                </span>
              </div>
            </div>
          </ScrollReveal>

          {/* BENTO CARD 2: Pipeline Kanban Board (5 Cols - Centerpiece) */}
          <ScrollReveal variant="scale-in" delay={450} duration={950} className="md:col-span-5 flex">
            <div className="w-full rounded-3xl bg-gradient-to-b from-white to-[#FBFBFC] border border-purple-100 p-6 shadow-xl shadow-purple-900/5 space-y-4 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-[#EEEEF0]">
                <div>
                  <div className="text-xs font-bold text-[#1C1C1E]">Papan Negosiasi Kanban</div>
                  <div className="text-[10px] text-[#8E8E93]">Lacak Alur Prospek Hingga Deal</div>
                </div>
                <div className="flex items-center gap-1 text-[10px] bg-purple-50 text-[#7C3AED] px-2.5 py-1 rounded-full font-bold">
                  8 KOL Deal
                </div>
              </div>

              {/* Simulated Kanban Columns */}
              <div className="grid grid-cols-3 gap-2 text-[10px]">
                {/* Col 1 */}
                <div className="p-2.5 rounded-xl bg-white border border-[#EEEEF0] space-y-1.5 hover:shadow-md hover:border-purple-200 transition-all">
                  <div className="font-bold text-[#8E8E93] flex justify-between">
                    <span>Prospek</span>
                    <span className="text-purple-600">2</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#FAFAFC] border border-[#EEEEF0] font-semibold text-[#1C1C1E]">
                    @tasyafarasya
                  </div>
                </div>

                {/* Col 2 */}
                <div className="p-2.5 rounded-xl bg-white border border-[#EEEEF0] space-y-1.5 hover:shadow-md hover:border-amber-200 transition-all">
                  <div className="font-bold text-amber-600 flex justify-between">
                    <span>Nego</span>
                    <span>3</span>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-50/50 border border-amber-100 font-semibold text-[#1C1C1E]">
                    @jeromepolin
                  </div>
                </div>

                {/* Col 3 */}
                <div className="p-2.5 rounded-xl bg-white border border-[#EEEEF0] space-y-1.5 hover:shadow-md hover:border-emerald-200 transition-all">
                  <div className="font-bold text-emerald-600 flex justify-between">
                    <span>Deal</span>
                    <span>3</span>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50/50 border border-emerald-100 font-semibold text-[#1C1C1E]">
                    @rachelvennya
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-[#EEEEF0] flex items-center justify-between text-[11px]">
                <span className="text-[#8E8E93]">Catatan Negosiasi</span>
                <span className="font-bold text-[#1C1C1E]">Tersimpan Otomatis</span>
              </div>
            </div>
          </ScrollReveal>

          {/* BENTO CARD 3: Direktori & Rate Card KOL (3 Cols) */}
          <ScrollReveal variant="slide-right" delay={600} duration={950} className="md:col-span-3 flex">
            <div className="w-full rounded-3xl bg-white border border-[#EEEEF0] p-6 shadow-xl shadow-purple-900/5 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 animate-float-delayed">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-[#EEEEF0]">
                  <div className="text-xs font-bold text-[#1C1C1E]">Database KOL</div>
                  <Badge variant="outline" className="text-[10px] bg-purple-50 text-[#7C3AED]">
                    Privat
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-[#FBFBFC] border border-[#EEEEF0] flex items-center justify-between text-xs hover:border-purple-300 hover:scale-[1.02] transition-all">
                    <div className="font-bold text-[#1C1C1E]">@rachelvennya</div>
                    <div className="text-[10px] font-bold text-[#7C3AED]">Rp 15M</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#FBFBFC] border border-[#EEEEF0] flex items-center justify-between text-xs hover:border-purple-300 hover:scale-[1.02] transition-all">
                    <div className="font-bold text-[#1C1C1E]">@jeromepolin</div>
                    <div className="text-[10px] font-bold text-[#7C3AED]">Rp 25M</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#FBFBFC] border border-[#EEEEF0] flex items-center justify-between text-xs hover:border-purple-300 hover:scale-[1.02] transition-all">
                    <div className="font-bold text-[#1C1C1E]">@tasyafarasya</div>
                    <div className="text-[10px] font-bold text-[#7C3AED]">Rp 10M</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#EEEEF0] text-center">
                <span className="text-[10px] text-[#8E8E93]">100% Bebas Akses Pihak Luar</span>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  )
}

