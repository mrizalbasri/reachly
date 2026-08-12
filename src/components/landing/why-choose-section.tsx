import { ScrollReveal } from '../ui/scroll-reveal'

export function WhyChooseSection() {
  return (
    <section id="why-us" className="py-16 md:py-24 bg-white border-t border-[#EEEEF0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <ScrollReveal variant="fade-up">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1C1C1E] tracking-tight">
              Mengapa Menggunakan Reachly?
            </h2>
            <p className="text-xs sm:text-sm text-[#8E8E93] mt-2">
              Alasan mengapa pemasar &amp; pemilik produk beralih dari pencatatan manual ke sistem Reachly.
            </p>
          </div>
        </ScrollReveal>

        {/* 4 Cards surrounding Central Mockup */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          {/* Card 1 */}
          <ScrollReveal variant="slide-left" delay={150}>
            <div className="p-6 rounded-3xl bg-[#FBFBFC] border border-[#EEEEF0] text-center space-y-2 hover:shadow-lg hover:border-purple-200 hover:-translate-y-1 transition-all">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-[#7C3AED] font-bold text-xs flex items-center justify-center mx-auto mb-3">
                01
              </div>
              <h4 className="text-sm font-bold text-[#1C1C1E]">Mudah &amp; Langsung Pakai</h4>
              <p className="text-xs text-[#8E8E93] leading-relaxed">
                Tampilan bersih dan simpel, dapat digunakan tanpa perlu keahlian teknis.
              </p>
            </div>
          </ScrollReveal>

          {/* Center Laptop Preview (Spans 2 columns on desktop) */}
          <ScrollReveal variant="scale-in" delay={300} className="md:col-span-2">
            <div className="relative p-4 rounded-3xl bg-gradient-to-b from-purple-50 to-pink-50 border border-purple-100 flex flex-col items-center justify-center animate-float">
              {/* Laptop Mockup Box */}
              <div className="w-full max-w-md rounded-2xl bg-white border border-[#EEEEF0] shadow-2xl p-4 text-left space-y-3 hover:scale-[1.02] transition-transform duration-300">
                <div className="flex items-center justify-between border-b border-[#EEEEF0] pb-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="text-[10px] font-semibold text-[#8E8E93] ml-2">reachly.app</span>
                  </div>
                  <span className="text-[9px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">
                    Ruang Kerja Personal
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-purple-100 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-pink-100 rounded w-1/2 animate-pulse" />
                  <div className="h-20 bg-[#FBFBFC] rounded-xl border border-[#EEEEF0] flex items-center justify-center text-xs text-[#8E8E93]">
                    Database &amp; Pipeline KOL Siap Digunakan
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2 */}
          <ScrollReveal variant="slide-right" delay={450}>
            <div className="p-6 rounded-3xl bg-[#FBFBFC] border border-[#EEEEF0] text-center space-y-2 hover:shadow-lg hover:border-purple-200 hover:-translate-y-1 transition-all">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-[#7C3AED] font-bold text-xs flex items-center justify-center mx-auto mb-3">
                02
              </div>
              <h4 className="text-sm font-bold text-[#1C1C1E]">Bebas File Berantakan</h4>
              <p className="text-xs text-[#8E8E93] leading-relaxed">
                Tinggalkan catatan spreadsheet yang hilang atau tercecer di aplikasi chat.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Bottom 2 Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <ScrollReveal variant="slide-left" delay={200}>
            <div className="p-6 rounded-3xl bg-[#FBFBFC] border border-[#EEEEF0] text-center space-y-2 hover:shadow-lg hover:border-pink-200 hover:-translate-y-1 transition-all">
              <div className="w-8 h-8 rounded-full bg-pink-100 text-[#EC4899] font-bold text-xs flex items-center justify-center mx-auto mb-3">
                03
              </div>
              <h4 className="text-sm font-bold text-[#1C1C1E]">Data 100% Privat</h4>
              <p className="text-xs text-[#8E8E93] leading-relaxed">
                Semua angka rate card dan catatan nego hanya dapat diakses oleh akun Anda sendiri.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="slide-right" delay={350}>
            <div className="p-6 rounded-3xl bg-[#FBFBFC] border border-[#EEEEF0] text-center space-y-2 hover:shadow-lg hover:border-pink-200 hover:-translate-y-1 transition-all">
              <div className="w-8 h-8 rounded-full bg-pink-100 text-[#EC4899] font-bold text-xs flex items-center justify-center mx-auto mb-3">
                04
              </div>
              <h4 className="text-sm font-bold text-[#1C1C1E]">Hemat Waktu &amp; Biaya</h4>
              <p className="text-xs text-[#8E8E93] leading-relaxed">
                Ketahui performa efisiensi KOL sebelum melakukan transfer endorsement.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

