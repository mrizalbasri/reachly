import { PieChart } from 'lucide-react'
import { ScrollReveal } from '../ui/scroll-reveal'

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-24 bg-[#FBFBFC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <ScrollReveal variant="fade-up">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1C1C1E] tracking-tight mb-3">
              Segala Hal yang Anda Butuhkan untuk Kerja Sama KOL
            </h2>
            <p className="text-xs sm:text-sm text-[#8E8E93]">
              Satu sistem praktis untuk mencatat, mengontrol budget, dan mengevaluasi hasil endorsement Anda.
            </p>
          </div>
        </ScrollReveal>

        {/* Top 3 Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Card 1: Database KOL Pribadi */}
          <ScrollReveal variant="slide-left" delay={150}>
            <div className="h-full p-6 rounded-3xl bg-white border border-[#EEEEF0] shadow-sm hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1.5 transition-all duration-300 text-center flex flex-col justify-between group">
              {/* UI Diagram Mockup */}
              <div className="h-44 rounded-2xl bg-[#FBFBFC] border border-[#EEEEF0] p-4 flex flex-col items-center justify-center mb-6 relative overflow-hidden group-hover:border-purple-200 transition-all">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#8E8E93] mb-2">Database KOL Pribadi</div>
                <div className="relative w-20 h-20 rounded-full border-8 border-purple-500 border-t-pink-500 border-l-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <PieChart className="w-6 h-6 text-[#7C3AED]" />
                </div>
                <div className="flex gap-2 text-[9px] text-[#8E8E93] mt-2">
                  <span>● Beauty</span>
                  <span>● Lifestyle</span>
                  <span>● Tech</span>
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1C1C1E] mb-2">Database KOL Terorganisir</h3>
                <p className="text-xs text-[#8E8E93] leading-relaxed">
                  Simpan kontak KOL, username, rate card IDR, hingga catatan histori kerja sama Anda dalam satu direktori rapi.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2: Kalkulasi ROI */}
          <ScrollReveal variant="fade-up" delay={300}>
            <div className="h-full p-6 rounded-3xl bg-white border border-[#EEEEF0] shadow-sm hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1.5 transition-all duration-300 text-center flex flex-col justify-between group">
              {/* UI Diagram Mockup */}
              <div className="h-44 rounded-2xl bg-[#FBFBFC] border border-[#EEEEF0] p-4 flex flex-col items-center justify-end mb-6 relative group-hover:border-purple-200 transition-all">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#8E8E93] mb-3 self-start">Kalkulasi ROI Endorsement</div>
                <div className="w-full h-24 flex items-end justify-between gap-1.5 px-2">
                  {[35, 55, 40, 80, 60, 95, 75].map((val, idx) => (
                    <div key={idx} style={{ height: `${val}%` }} className="flex-1 bg-[#7C3AED]/80 rounded-t-sm group-hover:bg-[#7C3AED] transition-all duration-300" />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1C1C1E] mb-2">Kalkulasi ROI &amp; Efisiensi Instan</h3>
                <p className="text-xs text-[#8E8E93] leading-relaxed">
                  Otomatis hitung metrik CPM (biaya per 1.000 views) dan CPE (biaya per engagement) untuk tahu KOL mana yang paling efisien.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 3: Control Budget */}
          <ScrollReveal variant="slide-right" delay={450}>
            <div className="h-full p-6 rounded-3xl bg-white border border-[#EEEEF0] shadow-sm hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1.5 transition-all duration-300 text-center flex flex-col justify-between group">
              {/* UI Diagram Mockup */}
              <div className="h-44 rounded-2xl bg-[#FBFBFC] border border-[#EEEEF0] p-4 flex flex-col items-center justify-center mb-6 group-hover:border-purple-200 transition-all">
                <div className="grid grid-cols-2 gap-3 w-full">
                  <div className="p-2.5 rounded-xl bg-white border border-[#EEEEF0] text-center group-hover:scale-105 transition-transform">
                    <div className="text-[9px] font-semibold text-[#8E8E93]">KOL Ditargetkan</div>
                    <div className="text-sm font-bold text-[#1C1C1E]">12</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#EEEEF0] text-center group-hover:scale-105 transition-transform">
                    <div className="text-[9px] font-semibold text-[#8E8E93]">Deal Selesai</div>
                    <div className="text-sm font-bold text-[#1C1C1E]">8</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#EEEEF0] text-center group-hover:scale-105 transition-transform">
                    <div className="text-[9px] font-semibold text-[#8E8E93]">Total Terpakai</div>
                    <div className="text-xs font-bold text-[#1C1C1E]">Rp 15M</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#EEEEF0] text-center group-hover:scale-105 transition-transform">
                    <div className="text-[9px] font-semibold text-[#8E8E93]">Sisa Budget</div>
                    <div className="text-xs font-bold text-emerald-600">Rp 5M</div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1C1C1E] mb-2">Kontrol Budget Real-time</h3>
                <p className="text-xs text-[#8E8E93] leading-relaxed">
                  Atur total budget campaign dan alokasikan ke tiap KOL secara presisi agar tidak terjadi pembengkakan biaya.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Bottom 2 Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 4: Pipeline Management */}
          <ScrollReveal variant="slide-left" delay={200}>
            <div className="h-full p-6 rounded-3xl bg-white border border-[#EEEEF0] shadow-sm hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1.5 transition-all duration-300 text-center flex flex-col justify-between group">
              {/* UI Diagram Mockup (Wave Chart with Stage Nodes) */}
              <div className="h-44 rounded-2xl bg-[#FBFBFC] border border-[#EEEEF0] p-4 flex flex-col items-center justify-between mb-6 relative overflow-hidden group-hover:border-purple-200 transition-all">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#8E8E93]">Alur Negosiasi Kanban</div>
                
                <div className="w-full flex items-center justify-center py-1">
                  <svg className="w-full h-20 text-[#7C3AED]" viewBox="0 0 300 70">
                    <defs>
                      <linearGradient id="kanbanWaveGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Gradient Area Fill */}
                    <path
                      d="M 20 48 C 50 25, 60 32, 75 32 C 95 32, 105 44, 125 44 C 145 44, 155 20, 175 20 C 195 20, 205 15, 225 15 C 245 15, 265 28, 280 40 L 280 65 L 20 65 Z"
                      fill="url(#kanbanWaveGradient)"
                    />

                    {/* Main Smooth Curve Line */}
                    <path
                      d="M 20 48 C 50 25, 60 32, 75 32 C 95 32, 105 44, 125 44 C 145 44, 155 20, 175 20 C 195 20, 205 15, 225 15 C 245 15, 265 28, 280 40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />

                    {/* Stage Nodes (6 Glowing Circles) */}
                    <circle cx="20" cy="48" r="3.5" fill="#7C3AED" />
                    <circle cx="75" cy="32" r="3.5" fill="#7C3AED" />
                    <circle cx="125" cy="44" r="3.5" fill="#7C3AED" />
                    <circle cx="175" cy="20" r="3.5" fill="#EC4899" />
                    <circle cx="225" cy="15" r="3.5" fill="#EC4899" />
                    <circle cx="280" cy="40" r="3.5" fill="#10B981" />
                  </svg>
                </div>

                <div className="flex justify-between w-full text-[9px] text-[#8E8E93] pt-1.5 border-t border-[#EEEEF0] px-1 font-medium">
                  <span>Prospek</span>
                  <span>Outreach</span>
                  <span>Nego</span>
                  <span>Deal</span>
                  <span>Posting</span>
                  <span>Selesai</span>
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1C1C1E] mb-2">Papan Negosiasi Kanban</h3>
                <p className="text-xs text-[#8E8E93] leading-relaxed">
                  Pantau proses negosiasi tiap KOL dari prospek awal hingga posting selesai secara visual tanpa ada yang terlewat.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 5: Catatan Personal */}
          <ScrollReveal variant="slide-right" delay={350}>
            <div className="h-full p-6 rounded-3xl bg-white border border-[#EEEEF0] shadow-sm hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1.5 transition-all duration-300 text-center flex flex-col justify-between group">
              {/* UI Diagram Mockup */}
              <div className="h-44 rounded-2xl bg-[#FBFBFC] border border-[#EEEEF0] p-4 flex items-center justify-center mb-6 relative group-hover:border-purple-200 transition-all">
                <div className="relative w-32 h-32 flex items-center justify-center animate-float">
                  <img
                    src="/logo.webp"
                    alt="Reachly Logo"
                    className="w-10 h-10 rounded-full object-contain z-10 shadow-lg group-hover:scale-110 transition-transform"
                  />
                  <div className="absolute top-1 left-2 w-7 h-7 rounded-full bg-purple-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-purple-700">K1</div>
                  <div className="absolute top-1 right-2 w-7 h-7 rounded-full bg-pink-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-pink-700">K2</div>
                  <div className="absolute bottom-1 left-2 w-7 h-7 rounded-full bg-blue-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-700">K3</div>
                  <div className="absolute bottom-1 right-2 w-7 h-7 rounded-full bg-emerald-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-emerald-700">K4</div>
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1C1C1E] mb-2">Catatan Negosiasi Personal</h3>
                <p className="text-xs text-[#8E8E93] leading-relaxed">
                  Simpan catatan penting hasil diskus, syarat endorsement, dan histori perubahan status per KOL secara aman.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

