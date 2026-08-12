import { useState } from 'react'
import { Calculator } from 'lucide-react'
import { Card } from '../ui/card'
import { Input } from '../ui/input'
import { formatIDR } from '../../utils/formatters'
import { ScrollReveal } from '../ui/scroll-reveal'

export function CalculatorSection() {
  const [budget, setBudget] = useState('10000000')
  const [views, setViews] = useState('250000')
  const [engagement, setEngagement] = useState('15000')

  const budgetNum = parseFloat(budget) || 0
  const viewsNum = parseFloat(views) || 0
  const engagementNum = parseFloat(engagement) || 0

  const cpm = viewsNum > 0 ? ((budgetNum / viewsNum) * 1000).toFixed(0) : '0'
  const cpe = engagementNum > 0 ? (budgetNum / engagementNum).toFixed(0) : '0'

  return (
    <section id="calculator" className="py-16 md:py-24 bg-[#FBFBFC] border-y border-[#EEEEF0]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <ScrollReveal variant="fade-up">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#7C3AED] text-xs font-semibold mb-3 animate-float">
              <Calculator className="w-3.5 h-3.5" />
              Simulasi ROI Efisiensi
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C1C1E] tracking-tight">
              Hitung Estimasi CPM &amp; CPE Campaign Anda Instan
            </h2>
            <p className="text-xs sm:text-sm text-[#8E8E93] mt-2">
              Coba kalkulator sederhana Reachly di bawah ini untuk mengukur efisiensi biaya kerja sama KOL.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="scale-in" delay={200}>
          <Card className="p-6 sm:p-8 bg-white border border-[#EEEEF0] shadow-xl shadow-purple-900/5 hover:border-purple-200 transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Input Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1C1C1E] mb-1.5">
                    Total Budget KOL (IDR)
                  </label>
                  <Input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="Contoh: 10000000"
                    className="focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1C1E] mb-1.5">
                    Estimasi Total Views / Impresi
                  </label>
                  <Input
                    type="number"
                    value={views}
                    onChange={(e) => setViews(e.target.value)}
                    placeholder="Contoh: 250000"
                    className="focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1C1E] mb-1.5">
                    Estimasi Total Engagement (Likes + Comments)
                  </label>
                  <Input
                    type="number"
                    value={engagement}
                    onChange={(e) => setEngagement(e.target.value)}
                    placeholder="Contoh: 15000"
                    className="focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Live Calculation Cards */}
              <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-purple-50/70 to-pink-50/30 border border-purple-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#7C3AED]">Hasil Estimasi Metrik</h4>

                <div className="flex justify-between items-center p-3.5 rounded-xl bg-white border border-[#EEEEF0] hover:scale-[1.02] transition-transform">
                  <div>
                    <div className="text-xs text-[#8E8E93]">CPM (Cost Per 1,000 Views)</div>
                    <div className="text-lg font-bold text-[#1C1C1E] transition-all">{formatIDR(cpm)}</div>
                  </div>
                  <div className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    Standard
                  </div>
                </div>

                <div className="flex justify-between items-center p-3.5 rounded-xl bg-white border border-[#EEEEF0] hover:scale-[1.02] transition-transform">
                  <div>
                    <div className="text-xs text-[#8E8E93]">CPE (Cost Per Engagement)</div>
                    <div className="text-lg font-bold text-[#1C1C1E] transition-all">{formatIDR(cpe)}</div>
                  </div>
                  <div className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                    Efisiensi
                  </div>
                </div>

                <p className="text-[11px] text-[#8E8E93] italic">
                  *Reachly secara otomatis mengkalkulasi metrik di atas untuk tiap campaign &amp; KOL di sistem secara terpusat.
                </p>
              </div>
            </div>
          </Card>
        </ScrollReveal>
      </div>
    </section>
  )
}

