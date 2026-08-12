import { Quote } from 'lucide-react'
import { ScrollReveal } from '../ui/scroll-reveal'

export function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Rian Prasetya',
      role: 'Influencer Marketing Specialist',
      avatar: 'RP',
      color: 'bg-purple-100 text-purple-700',
      text: 'Reachly sangat membantu saya merapikan daftar rate card KOL pribadi. Sekarang kalau mau cari kandidat endorsement tinggal filter dalam hitungan detik!',
    },
    {
      name: 'Amanda Nicole',
      role: 'Owner Skincare Local Brand',
      avatar: 'AN',
      color: 'bg-pink-100 text-pink-700',
      text: 'Dulu budget endorsement suka jebol karena kurang terkontrol. Pakai Reachly, saya bisa memantau alokasi uang dan sisa budget secara presisi.',
    },
    {
      name: 'Budi Santoso',
      role: 'Digital Marketer',
      avatar: 'BS',
      color: 'bg-blue-100 text-blue-700',
      text: 'Fitur kalkulasi otomatis CPM dan CPE sangat membantu saya menentukan apakah sebuah tawaran rate card KOL itu worth it atau terlalu mahal.',
    },
    {
      name: 'Clara Sylvania',
      role: 'Content & Brand Lead',
      avatar: 'CS',
      color: 'bg-emerald-100 text-emerald-700',
      text: 'Akhirnya saya bisa tinggalkan file Excel yang menumpuk. Papan Kanban-nya membuat proses nego dengan KOL jadi jelas mana yang sudah deal dan posting.',
    },
  ]

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-[#FBFBFC] border-t border-[#EEEEF0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <ScrollReveal variant="fade-up">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1C1C1E] tracking-tight">
              Pengalaman Pengguna Reachly
            </h2>
            <p className="text-xs sm:text-sm text-[#8E8E93] mt-2">
              Pengalaman pemasar dan pemilik usaha dalam mengelola kerja sama KOL secara teratur.
            </p>
          </div>
        </ScrollReveal>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((item, idx) => (
            <ScrollReveal key={idx} variant="fade-up" delay={idx * 150 + 100}>
              <div className="h-full p-6 rounded-3xl bg-white border border-[#EEEEF0] shadow-sm hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1.5 hover:border-purple-200 transition-all duration-300 flex flex-col justify-between group">
                <div className="space-y-4">
                  <Quote className="w-6 h-6 text-purple-300 fill-purple-100 group-hover:text-purple-500 transition-colors" />
                  <p className="text-xs text-[#8E8E93] leading-relaxed italic">
                    "{item.text}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-6 border-t border-[#EEEEF0] mt-6">
                  <div className={`w-9 h-9 rounded-full ${item.color} flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-110 transition-transform`}>
                    {item.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1C1C1E]">{item.name}</h4>
                    <p className="text-[10px] text-[#8E8E93]">{item.role}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

