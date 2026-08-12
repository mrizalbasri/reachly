import { ShieldCheck } from 'lucide-react'
import { ScrollReveal } from '../ui/scroll-reveal'

export function DashboardShowcase() {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-white to-[#FBFBFC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal variant="scale-in">
          {/* Main Dashboard Card Container */}
          <div className="relative rounded-3xl border border-[#EEEEF0] bg-white/80 backdrop-blur-xl p-4 sm:p-8 shadow-2xl shadow-purple-900/10 overflow-hidden hover:border-purple-200 transition-all duration-500">
            {/* Top Browser Dots & Address Bar */}
            <div className="flex items-center justify-between pb-5 mb-6 border-b border-[#EEEEF0]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <div className="ml-3 px-3 py-1 rounded-full bg-[#FBFBFC] border border-[#EEEEF0] text-[11px] font-semibold text-[#8E8E93]">
                  reachly.app/dashboard
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-[#1C1C1E]">Ruang Kerja Privat</span>
              </div>
            </div>

            {/* Top 4 Personal Metric Widgets */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-[#FBFBFC] border border-[#EEEEF0] hover:border-purple-300 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                <div className="text-[11px] font-semibold text-[#8E8E93] mb-1">Target KOL</div>
                <div className="text-2xl font-black text-[#1C1C1E]">12 Person</div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-1">Niche Beauty &amp; Fashion</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FBFBFC] border border-[#EEEEF0] hover:border-purple-300 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                <div className="text-[11px] font-semibold text-[#8E8E93] mb-1">Budget Campaign</div>
                <div className="text-2xl font-black text-[#1C1C1E]">Rp 15.000.000</div>
                <div className="text-[10px] text-purple-600 font-semibold mt-1">Alokasi Bulan Ini</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FBFBFC] border border-[#EEEEF0] hover:border-purple-300 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                <div className="text-[11px] font-semibold text-[#8E8E93] mb-1">KOL Deal Posting</div>
                <div className="text-2xl font-black text-[#1C1C1E]">8 KOL</div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-1">Konten Live</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FBFBFC] border border-[#EEEEF0] hover:border-purple-300 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                <div className="text-[11px] font-semibold text-[#8E8E93] mb-1">Rata-Rata CPE</div>
                <div className="text-2xl font-black text-[#1C1C1E]">Rp 450</div>
                <div className="text-[10px] text-pink-600 font-semibold mt-1">Per Engagement</div>
              </div>
            </div>

            {/* Main Visual Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Monthly Campaign Performance Chart Preview */}
              <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-white border border-[#EEEEF0] shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-sm font-bold text-[#1C1C1E]">Grafik Hasil Endorsement Saya</h4>
                    <p className="text-xs text-[#8E8E93]">Perkembangan impresi &amp; interaksi dari waktu ke waktu</p>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1 font-semibold text-[#7C3AED]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]" /> Views
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-pink-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-pink-400" /> Engagement
                    </span>
                  </div>
                </div>

                {/* Simulated Bar Chart */}
                <div className="h-44 sm:h-52 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-[#EEEEF0]">
                  {[
                    { month: 'Jan', val: 30, valPrev: 15 },
                    { month: 'Feb', val: 50, valPrev: 25 },
                    { month: 'Mar', val: 40, valPrev: 20 },
                    { month: 'Apr', val: 70, valPrev: 35 },
                    { month: 'Mei', val: 60, valPrev: 30 },
                    { month: 'Jun', val: 90, valPrev: 45 },
                    { month: 'Jul', val: 65, valPrev: 40 },
                    { month: 'Agu', val: 85, valPrev: 50 },
                    { month: 'Sep', val: 95, valPrev: 55 },
                    { month: 'Okt', val: 70, valPrev: 35 },
                    { month: 'Nov', val: 88, valPrev: 48 },
                    { month: 'Des', val: 80, valPrev: 40 },
                  ].map((bar, i) => (
                    <div key={i} className="flex-1 flex items-end justify-center gap-1 h-full group cursor-pointer">
                      <div
                        style={{ height: `${bar.valPrev}%` }}
                        className="w-full max-w-[12px] bg-pink-200 rounded-t-md transition-all duration-300 group-hover:bg-pink-300"
                      />
                      <div
                        style={{ height: `${bar.val}%` }}
                        className="w-full max-w-[12px] bg-[#7C3AED] rounded-t-md transition-all duration-300 group-hover:bg-[#6D28D9] group-hover:scale-y-105 origin-bottom"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-[#8E8E93] pt-2 px-2">
                  <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>Mei</span><span>Jun</span>
                  <span>Jul</span><span>Agu</span><span>Sep</span><span>Okt</span><span>Nov</span><span>Des</span>
                </div>
              </div>

              {/* Side Widgets */}
              <div className="space-y-4">
                {/* Distribution Widget */}
                <div className="p-5 rounded-2xl bg-white border border-[#EEEEF0] shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-[#1C1C1E]">Platform Favorit KOL</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-[#1C1C1E] mb-1">
                        <span>Instagram Reel</span>
                        <span>60%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-purple-100 overflow-hidden">
                        <div className="h-full bg-purple-600 rounded-full w-[60%] transition-all duration-1000" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-[#1C1C1E] mb-1">
                        <span>TikTok Video</span>
                        <span>30%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-pink-100 overflow-hidden">
                        <div className="h-full bg-pink-500 rounded-full w-[30%] transition-all duration-1000" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-[#1C1C1E] mb-1">
                        <span>YouTube Short</span>
                        <span>10%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-blue-100 overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full w-[10%] transition-all duration-1000" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personal Tip Box */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 text-[#1C1C1E] hover:shadow-md transition-all">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#7C3AED] mb-1">Catatan Personal</div>
                  <div className="text-xs font-semibold mb-2">Semua Data Bebas Dari Spreadsheet</div>
                  <p className="text-[11px] text-[#8E8E93] leading-relaxed">
                    Tambah data KOL baru, simpan nomor kontak, dan catat hasil negosiasi langsung di dashboard pribadi Anda.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

