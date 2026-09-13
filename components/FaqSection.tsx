'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

const FAQ_ITEMS = [
  {
    question: 'Bagaimana prosedur pendaftaran dan pembayaran DP di MQH?',
    answer:
      'Pendaftaran dapat dilakukan secara online melalui website ini atau datang langsung ke kantor cabang MQH terdekat. Calon jamaah cukup memilih jadwal keberangkatan, melengkapi data diri, dan menyetorkan DP (Down Payment) sebesar Rp 5.000.000 per jamaah untuk mengamankan kuota seat dan proses visa. Pelunasan biaya dapat dicicil dan diselesaikan selambat-lambatnya 30 hari sebelum tanggal keberangkatan.',
  },
  {
    question: 'Dokumen apa saja yang wajib dipersiapkan oleh calon jamaah?',
    answer:
      'Dokumen yang dipersiapkan meliputi: (1) Paspor asli dengan masa berlaku minimal 7 bulan sebelum tanggal keberangkatan dengan susunan nama minimal 2 kata, (2) Pasfoto berwarna ukuran 4x6 latar belakang putih (fokus wajah 80%), (3) Fotokopi KTP dan Kartu Keluarga (KK), (4) Fotokopi Buku Nikah (bagi suami-istri) atau Akta Lahir (bagi anak), dan (5) Buku sertifikat vaksin meningitis sesuai regulasi Kemenag dan otoritas Arab Saudi.',
  },
  {
    question: 'Apakah tersedia fasilitas khusus bagi jamaah lansia atau berkebutuhan khusus?',
    answer:
      'Ya, MQH Tour & Travel memiliki program ramah lansia. Kami menyediakan fasilitas pendampingan khusus, penyediaan kursi roda (wheelchair assistance) di bandara serta saat pelaksanaan tawaf dan sa\'i di Tanah Suci. Pemilihan hotel paket MQH juga diprioritaskan di Ring 1 (jarak sangat dekat ke pelataran Masjidil Haram dan Masjid Nabawi) agar memudahkan mobilitas jamaah.',
  },
  {
    question: 'Kapan dan di mana pelaksanaan bimbingan manasik umroh diadakan?',
    answer:
      'Bimbingan manasik diselenggarakan 1–2 minggu sebelum tanggal keberangkatan, bertempat di hotel atau gedung pertemuan resmi mitra MQH. Materi dibimbing langsung oleh ustadz/muthawwif bersertifikat Kemenag sesuai sunnah Rasulullah SAW, mencakup fiqih ibadah praktis, simulasi tawaf/sa\'i, briefing teknis bandara, serta pembagian perlengkapan ibadah (koper, kain ihram/mukena, seragam, dan buku panduan).',
  },
  {
    question: 'Bagaimana kebijakan pembatalan (refund) jika jamaah berhalangan hadir?',
    answer:
      'Ketentuan pembatalan mengacu pada regulasi resmi Kementerian Agama RI dan asosiasi penyelenggara umroh. Pengembalian dana (refund) akan diproses setelah dikurangi biaya administrasi dan biaya tiket/visa/hotel yang telah terbit atau bersifat non-refundable dari pihak maskapai dan vendor di Arab Saudi. Seluruh rincian biaya dipaparkan secara transparan dan amanah.',
  },
]

export default function FaqSection({ className = '' }: { className?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx))
  }

  // Schema.org FAQPage structured data untuk Google Rich Snippets
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <section className={`w-full py-12 md:py-16 ${className}`} aria-labelledby="faq-heading">
      {/* FAQ Schema Script for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/15 text-secondary-hover text-[12px] font-semibold mb-3 border border-secondary/30">
            <HelpCircle className="size-3.5" />
            <span>Tanya Jawab Seputar Ibadah</span>
          </div>
          <h2 id="faq-heading" className="font-serif text-2xl md:text-3xl font-bold text-primary mb-3">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
            Informasi penting seputar pendaftaran, dokumen, fasilitas ibadah, dan bimbingan manasik bersama MQH Tour &amp; Travel.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                className="rounded-xl border border-border/70 bg-card overflow-hidden transition-all duration-200 shadow-sm hover:border-secondary/40"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-semibold text-[14px] md:text-[15px] text-foreground hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  id={`faq-question-${idx}`}
                >
                  <span className="leading-snug">{item.question}</span>
                  <ChevronDown
                    className={`size-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-secondary-hover' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div
                    id={`faq-answer-${idx}`}
                    role="region"
                    aria-labelledby={`faq-question-${idx}`}
                    className="px-5 pb-4 pt-1 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed border-t border-border/40 bg-muted/20"
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
