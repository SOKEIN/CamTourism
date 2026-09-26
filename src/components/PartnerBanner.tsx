import React from 'react'

interface PartnerBannerProps {
  onOpenPartner: () => void
  lang: 'kh' | 'en'
}

export const PartnerBanner: React.FC<PartnerBannerProps> = ({ onOpenPartner, lang }) => {
  return (
    <section className="py-12 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-950 via-teal-950 to-slate-900 text-white p-8 md:p-12 shadow-2xl border border-teal-900/40">
          {/* Subtle Ambient Lights */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 -mb-10 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold px-3.5 py-1.5 rounded-full mb-4">
                <span>📢 {lang === 'kh' ? 'សម្រាប់ម្ចាស់រមណីយដ្ឋាន & សណ្ឋាគារ' : 'For Resort & Hotel Owners'}</span>
              </div>

              {/* Title */}
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight mb-3"
                style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
              >
                {lang === 'kh'
                  ? 'ចង់ឱ្យរមណីយដ្ឋានរបស់អ្នក បង្ហាញលើ CamTourism?'
                  : 'Want to Feature Your Resort on CamTourism?'}
              </h2>

              {/* Description */}
              <p
                className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6"
                style={{
                  fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif',
                  lineHeight: lang === 'kh' ? 1.9 : 1.6,
                }}
              >
                {lang === 'kh'
                  ? 'ចូលរួមសហការផ្សព្វផ្សាយអាជីវកម្មទេសចរណ៍របស់អ្នកជាមួយយើង ដើម្បីទទួលបានភ្ញៀវទេសចររាប់ម៉ឺននាក់ ទទួលបាន Badge ពេញនិយមផ្លូវការ និងការរំលេចទីតាំងលើផែនទី។'
                  : 'Partner with Cambodia’s premier tourism discovery platform. Connect with tens of thousands of travelers and get officially verified with priority placement.'}
              </p>

              {/* Feature Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">✓</span>
                  <span>{lang === 'kh' ? 'ទាក់ទាញភ្ញៀវផ្ទាល់' : 'Direct Booking Inquiries'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">✓</span>
                  <span>{lang === 'kh' ? 'Badge ពេញនិយម' : 'Verified Gold Badge'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200 col-span-2 sm:col-span-1">
                  <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold">✓</span>
                  <span>{lang === 'kh' ? 'ផ្សព្វផ្សាយគ្រប់ខេត្ត' : '25 Provinces Coverage'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto flex-shrink-0">
              <button
                onClick={onOpenPartner}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-black rounded-2xl shadow-xl shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 text-center flex items-center justify-center gap-2"
                style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
              >
                <span>🚀</span>
                <span>{lang === 'kh' ? 'ចុះឈ្មោះដាក់ផ្សាយរមណីយដ្ឋាន' : 'List Your Resort Now'}</span>
              </button>

              <a
                href="https://t.me/CamTourismAdmin"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-2xl transition-all text-center flex items-center justify-center gap-2 text-sm"
                style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z" />
                </svg>
                <span>{lang === 'kh' ? 'ពិគ្រោះយោបល់តាម Telegram' : 'Consult via Telegram'}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
