import React, { useState } from 'react'
import { PROVINCES } from '../data/cambodiaData'

export interface PartnerInquiry {
  id: string
  resortName: string
  ownerName: string
  province: string
  category: string
  phone: string
  telegram: string
  packageType: 'basic' | 'featured' | 'vip'
  facebookOrMapUrl?: string
  description?: string
  status: 'new' | 'contacted' | 'approved'
  submittedAt: string
}

interface PartnerModalProps {
  isOpen: boolean
  onClose: () => void
  lang: 'kh' | 'en'
}

export const PartnerModal: React.FC<PartnerModalProps> = ({ isOpen, onClose, lang }) => {
  const [activeTab, setActiveTab] = useState<'packages' | 'form' | 'contact'>('form')
  const [resortName, setResortName] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [province, setProvince] = useState(PROVINCES[0]?.kh || 'សៀមរាប')
  const [category, setCategory] = useState('resort')
  const [phone, setPhone] = useState('')
  const [telegram, setTelegram] = useState('')
  const [packageType, setPackageType] = useState<'basic' | 'featured' | 'vip'>('featured')
  const [facebookOrMapUrl, setFacebookOrMapUrl] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  if (!isOpen) return null

  const categories = [
    { id: 'resort', kh: 'រមណីយដ្ឋាន & កន្លែងកម្សាន្ត', en: 'Resort & Recreation' },
    { id: 'hotel', kh: 'សណ្ឋាគារ & ផ្ទះសំណាក់ (Homestay)', en: 'Hotel & Homestay' },
    { id: 'eco', kh: 'អេកូទេសចរណ៍ & ធម្មជាតិ', en: 'Eco Tourism & Nature' },
    { id: 'food', kh: 'ភោជនីយដ្ឋាន & ហាងកាហ្វេ', en: 'Restaurant & Cafe' },
    { id: 'tour', kh: 'សេវាកម្មទស្សនកិច្ច & កីឡាទឹក/ភ្នំ', en: 'Tour Guide & Adventure' },
  ]

  const packages = [
    {
      id: 'basic',
      name_kh: 'កញ្ចប់មូលដ្ឋាន (Basic)',
      name_en: 'Basic Listing',
      price: '$15 / ខែ',
      price_en: '$15 / month',
      badge: 'សន្សំសំចៃ',
      badge_en: 'Starter',
      color: 'border-slate-200 bg-white text-slate-800',
      tagColor: 'bg-slate-100 text-slate-700',
      features_kh: [
        'បង្ហាញក្នុងបញ្ជីខេត្ត និងប្រភេទទេសចរណ៍',
        'ព័ត៌មានលម្អិត រូបភាព និងទីតាំង Google Maps',
        'បង្ហាញលេខទូរស័ព្ទ និងតំណភ្ជាប់ Telegram',
        'អាប់ដេតព័ត៌មានបាន ២ ដងក្នុងមួយខែ',
      ],
      features_en: [
        'Listed in Province & Category pages',
        'Full details, photo gallery & Google Maps pin',
        'Direct phone & Telegram contact links',
        'Up to 2 content updates per month',
      ],
    },
    {
      id: 'featured',
      name_kh: 'កញ្ចប់ពេញនិយម (Featured Gold)',
      name_en: 'Featured Gold',
      price: '$35 / ខែ',
      price_en: '$35 / month',
      badge: 'ពេញនិយមបំផុត ★',
      badge_en: 'Most Popular ★',
      color: 'border-amber-400 bg-gradient-to-b from-amber-50/60 to-white text-slate-900 ring-2 ring-amber-400 shadow-xl',
      tagColor: 'bg-amber-500 text-slate-950 font-extrabold',
      features_kh: [
        'រួមបញ្ចូលលក្ខណៈសម្បត្តិទាំងអស់នៃកញ្ចប់ Basic',
        'ទទួលបាន Badge "ពេញនិយម / Featured" លេចធ្លោ',
        'បង្ហាញនៅជួរលើគេ (Top Ranking) ក្នុងខេត្ត',
        'រំលេចក្នុងប្រអប់ស្វែងរក (Search Suggestions)',
        'សរសេរពិពណ៌នាទាក់ទាញបន្ថែមដោយក្រុមការងារ',
      ],
      features_en: [
        'Includes everything in Basic Listing',
        'Official "Featured / Popular" Gold Badge',
        'Ranked at top of province results',
        'Highlighted in instant search suggestions',
        'Professional copy touch-up by our editors',
      ],
    },
    {
      id: 'vip',
      name_kh: 'កញ្ចប់ VIP Spotlight (ទំព័រដើម)',
      name_en: 'VIP Home Spotlight',
      price: '$75 / ខែ',
      price_en: '$75 / month',
      badge: 'លំដាប់ VIP 👑',
      badge_en: 'VIP Tier 👑',
      color: 'border-teal-500 bg-gradient-to-b from-teal-50/60 to-white text-slate-900 ring-1 ring-teal-400 shadow-lg',
      tagColor: 'bg-teal-600 text-white font-bold',
      features_kh: [
        'រួមបញ្ចូលលក្ខណៈសម្បត្តិទាំងអស់នៃ Featured',
        'បង្ហាញលើផ្ទាំងធំទំព័រដើម (Homepage Hero Spotlight)',
        'ផ្សព្វផ្សាយលើ Facebook Page & Telegram ផ្លូវការ',
        'ជួយរៀបចំរូបថត និងពិគ្រោះយុទ្ធសាស្ត្រទាក់ទាញភ្ញៀវ',
        'ជំនួយការផ្ទាល់ ២៤/៧ ពីក្រុមការងារ CamTourism',
      ],
      features_en: [
        'Includes all Featured Gold benefits',
        'Homepage Hero Spotlight Banner showcase',
        'Social media push on official FB & Telegram',
        'Photo optimization & traveler attraction review',
        '24/7 dedicated support representative',
      ],
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!resortName.trim()) {
      setErrorMsg(lang === 'kh' ? 'សូមបញ្ចូលឈ្មោះរមណីយដ្ឋាន ឬអាជីវកម្ម!' : 'Please enter resort or business name!')
      return
    }
    if (!ownerName.trim()) {
      setErrorMsg(lang === 'kh' ? 'សូមបញ្ចូលឈ្មោះអ្នកទាក់ទង!' : 'Please enter contact person name!')
      return
    }
    if (!phone.trim() && !telegram.trim()) {
      setErrorMsg(
        lang === 'kh'
          ? 'សូមបញ្ចូលយ៉ាងហោចណាស់លេខទូរស័ព្ទ ឬ Telegram!'
          : 'Please provide at least a phone number or Telegram handle!'
      )
      return
    }

    const newInquiry: PartnerInquiry = {
      id: 'INQ-' + Date.now().toString(36).toUpperCase(),
      resortName: resortName.trim(),
      ownerName: ownerName.trim(),
      province,
      category,
      phone: phone.trim(),
      telegram: telegram.trim(),
      packageType,
      facebookOrMapUrl: facebookOrMapUrl.trim(),
      description: description.trim(),
      status: 'new',
      submittedAt: new Date().toISOString(),
    }

    try {
      const existing = localStorage.getItem('camtourism_partner_inquiries')
      const list = existing ? JSON.parse(existing) : []
      list.unshift(newInquiry)
      localStorage.setItem('camtourism_partner_inquiries', JSON.stringify(list))
    } catch {
      // fallback
    }

    setIsSubmitted(true)
  }

  const telegramShareText = encodeURIComponent(
    `ជម្រាបសួរក្រុមការងារ CamTourism! ខ្ញុំបាទ/នាងខ្ញុំចង់ចុះឈ្មោះដាក់ផ្សាយរមណីយដ្ឋាន៖\n` +
      `- ឈ្មោះរមណីយដ្ឋាន: ${resortName || 'N/A'}\n` +
      `- អ្នកទំនាក់ទំនង: ${ownerName || 'N/A'}\n` +
      `- ខេត្ត: ${province}\n` +
      `- លេខទូរស័ព្ទ: ${phone || 'N/A'}\n` +
      `- Telegram: ${telegram || 'N/A'}\n` +
      `- កញ្ចប់ចាប់អារម្មណ៍: ${packageType.toUpperCase()}\n` +
      `- ទីតាំង/ផែនទី: ${facebookOrMapUrl || 'N/A'}`
  )

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-100 animate-in zoom-in-95 duration-200">
        {/* Header Hero Banner */}
        <div className="relative bg-gradient-to-r from-slate-950 via-teal-950 to-slate-900 text-white p-6 sm:p-8 flex-shrink-0 overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-60 h-60 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 -mb-10 w-60 h-60 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            title="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold px-3 py-1 rounded-full mb-3">
              <span>🤝 {lang === 'kh' ? 'សហការផ្សព្វផ្សាយផ្លូវការ' : 'Official Partnership & Advertising'}</span>
            </div>
            <h2
              className="text-2xl sm:text-3xl font-black text-white leading-tight mb-2"
              style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
            >
              {lang === 'kh'
                ? 'ដាក់ផ្សាយរមណីយដ្ឋាន & អាជីវកម្មរបស់អ្នក'
                : 'Promote Your Resort & Tourism Business'}
            </h2>
            <p
              className="text-slate-300 text-xs sm:text-sm leading-relaxed"
              style={{
                fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif',
                lineHeight: lang === 'kh' ? 1.8 : 1.5,
              }}
            >
              {lang === 'kh'
                ? 'ផ្សព្វផ្សាយរមណីយដ្ឋាន សណ្ឋាគារ ឬកន្លែងកម្សាន្តរបស់អ្នកទៅកាន់ភ្ញៀវទេសចរជាតិ និងអន្តរជាតិរាប់ម៉ឺននាក់តាមរយៈគេហទំព័រទេសចរណ៍ CamTourism។'
                : 'Connect with tens of thousands of active travelers looking for top resorts, hotels, and authentic experiences across Cambodia.'}
            </p>

            {/* Quick Stats Highlights */}
            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/10">
              <div>
                <span className="block text-amber-400 font-extrabold text-sm sm:text-base">២៥ ខេត្ត-ក្រុង</span>
                <span className="text-[11px] text-slate-400">គ្របដណ្តប់ទូទាំងប្រទេស</span>
              </div>
              <div>
                <span className="block text-teal-300 font-extrabold text-sm sm:text-base">100K+ ភ្ញៀវ</span>
                <span className="text-[11px] text-slate-400">ទេសចរប្រចាំខែ</span>
              </div>
              <div>
                <span className="block text-emerald-400 font-extrabold text-sm sm:text-base">ផ្ទៀងផ្ទាត់ផ្លូវការ</span>
                <span className="text-[11px] text-slate-400">Badge ពេញនិយម</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/10 overflow-x-auto">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'form'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'bg-white/10 text-white/90 hover:bg-white/20'
              }`}
              style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
            >
              <span>📝 {lang === 'kh' ? 'ទម្រង់ចុះឈ្មោះដាក់ពាក្យ' : 'Application Form'}</span>
            </button>
            <button
              onClick={() => setActiveTab('packages')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'packages'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'bg-white/10 text-white/90 hover:bg-white/20'
              }`}
              style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
            >
              <span>⭐ {lang === 'kh' ? 'កញ្ចប់តម្លៃសេវាកម្ម' : 'Pricing Packages'}</span>
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'contact'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'bg-white/10 text-white/90 hover:bg-white/20'
              }`}
              style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
            >
              <span>💬 {lang === 'kh' ? 'ទំនាក់ទំនងបន្ទាន់' : 'Direct Contact'}</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-slate-50">
          {/* TAB 1: FORM */}
          {activeTab === 'form' && (
            <div>
              {isSubmitted ? (
                <div className="bg-white rounded-2xl p-8 border border-emerald-100 shadow-sm text-center max-w-lg mx-auto animate-in zoom-in-95">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                    ✓
                  </div>
                  <h3
                    className="text-xl font-bold text-slate-900 mb-2"
                    style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
                  >
                    {lang === 'kh' ? 'សំណើត្រូវបានបញ្ជូនជោគជ័យ!' : 'Inquiry Submitted Successfully!'}
                  </h3>
                  <p
                    className="text-slate-600 text-sm leading-relaxed mb-6"
                    style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
                  >
                    {lang === 'kh'
                      ? 'អរគុណសម្រាប់ការចាប់អារម្មណ៍ដាក់ផ្សាយជាមួយ CamTourism! ក្រុមការងាររបស់យើងនឹងទាក់ទងទៅកាន់លេខទូរស័ព្ទ ឬ Telegram របស់លោកអ្នកក្នុងរយៈពេល ២៤ ម៉ោង។'
                      : 'Thank you for your interest! Our team will contact your phone or Telegram within 24 hours.'}
                  </p>

                  <div className="space-y-3">
                    <a
                      href={`https://t.me/CamTourismAdmin?text=${telegramShareText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#229ED9] hover:bg-[#1E88C7] text-white font-bold rounded-xl shadow-md transition-transform hover:scale-105"
                      style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z" />
                      </svg>
                      <span>{lang === 'kh' ? 'ផ្ញើសារបញ្ជាក់តាម Telegram ភ្លាមៗ' : 'Fast-Track via Telegram'}</span>
                    </a>

                    <button
                      onClick={() => {
                        setIsSubmitted(false)
                        setResortName('')
                        setPhone('')
                        setTelegram('')
                      }}
                      className="text-xs text-slate-500 hover:text-slate-800 underline block mx-auto pt-2"
                    >
                      {lang === 'kh' ? 'ដាក់ពាក្យរមណីយដ្ឋានផ្សេងទៀត' : 'Submit Another Resort'}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errorMsg && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                      <span>⚠️</span>
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Section 1: Resort & Owner Info */}
                  <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <h4
                      className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2"
                      style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
                    >
                      <span>📍</span>
                      <span>{lang === 'kh' ? 'ព័ត៌មានរមណីយដ្ឋាន & ម្ចាស់ទីតាំង' : 'Resort & Contact Details'}</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          {lang === 'kh' ? 'ឈ្មោះរមណីយដ្ឋាន / អាជីវកម្ម *' : 'Resort / Business Name *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={resortName}
                          onChange={e => setResortName(e.target.value)}
                          placeholder={lang === 'kh' ? 'ឧ. រមណីយដ្ឋានធម្មជាតិបូកគោ ឬ សណ្ឋាគារអង្គរ...' : 'e.g. Bokor Paradise Resort...'}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          {lang === 'kh' ? 'ឈ្មោះម្ចាស់ ឬអ្នកតំណាង *' : 'Owner / Representative Name *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={ownerName}
                          onChange={e => setOwnerName(e.target.value)}
                          placeholder={lang === 'kh' ? 'ឧ. សុខ ចិន្តា' : 'e.g. John Doe'}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          {lang === 'kh' ? 'ខេត្ត / រាជធានី *' : 'Province / Capital *'}
                        </label>
                        <select
                          value={province}
                          onChange={e => setProvince(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all bg-white"
                        >
                          {PROVINCES.map((p, idx) => (
                            <option key={idx} value={lang === 'kh' ? p.kh : p.en}>
                              {lang === 'kh' ? `${p.kh} (${p.en})` : `${p.en} (${p.kh})`}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          {lang === 'kh' ? 'ប្រភេទអាជីវកម្ម *' : 'Business Category *'}
                        </label>
                        <select
                          value={category}
                          onChange={e => setCategory(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all bg-white"
                        >
                          {categories.map(c => (
                            <option key={c.id} value={c.id}>
                              {lang === 'kh' ? c.kh : c.en}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Contact Numbers */}
                  <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <h4
                      className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2"
                      style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
                    >
                      <span>📞</span>
                      <span>{lang === 'kh' ? 'ទំនាក់ទំនងសម្រាប់ភ្ញៀវ & ការទូទាត់' : 'Contact Channels'}</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          {lang === 'kh' ? 'លេខទូរស័ព្ទទំនាក់ទំនង *' : 'Phone Number *'}
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          placeholder="012 345 678 / 096 123 4567"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          {lang === 'kh' ? 'ឈ្មោះ Telegram ឬលេខ Telegram' : 'Telegram Handle or Number'}
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-semibold">@</span>
                          <input
                            type="text"
                            value={telegram}
                            onChange={e => setTelegram(e.target.value.replace(/^@/, ''))}
                            placeholder="username ឬ 012345678"
                            className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {lang === 'kh' ? 'តំណភ្ជាប់ Google Maps ឬ Facebook Page' : 'Google Maps Link or Facebook Page'}
                      </label>
                      <input
                        type="url"
                        value={facebookOrMapUrl}
                        onChange={e => setFacebookOrMapUrl(e.target.value)}
                        placeholder="https://maps.app.goo.gl/... ឬ https://facebook.com/..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Section 3: Package Selection */}
                  <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <h4
                      className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between"
                      style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
                    >
                      <span className="flex items-center gap-2">
                        <span>💎</span>
                        <span>{lang === 'kh' ? 'ជ្រើសរើសកញ្ចប់ផ្សព្វផ្សាយ' : 'Select Advertising Package'}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveTab('packages')}
                        className="text-xs text-amber-600 hover:text-amber-700 font-bold underline"
                      >
                        {lang === 'kh' ? 'មើលលក្ខខណ្ឌលម្អិត' : 'Compare Packages'}
                      </button>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {packages.map(pkg => (
                        <label
                          key={pkg.id}
                          className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            packageType === pkg.id
                              ? 'border-amber-500 bg-amber-50/50 shadow-md ring-1 ring-amber-500'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pkg.tagColor}`}>
                              {lang === 'kh' ? pkg.badge : pkg.badge_en}
                            </span>
                            <input
                              type="radio"
                              name="package"
                              value={pkg.id}
                              checked={packageType === pkg.id}
                              onChange={() => setPackageType(pkg.id as any)}
                              className="w-4 h-4 text-amber-500 focus:ring-amber-500"
                            />
                          </div>
                          <span
                            className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight"
                            style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
                          >
                            {lang === 'kh' ? pkg.name_kh : pkg.name_en}
                          </span>
                          <span className="text-amber-600 font-black text-sm mt-1">
                            {lang === 'kh' ? pkg.price : pkg.price_en}
                          </span>
                        </label>
                      ))}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {lang === 'kh' ? 'ព័ត៌មានបន្ថែម ឬចំណុចពិសេសនៃរមណីយដ្ឋាន' : 'Additional Notes / Highlights'}
                      </label>
                      <textarea
                        rows={3}
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder={
                          lang === 'kh'
                            ? 'ឧ. មានទឹកធ្លាក់ធម្មជាតិ អាហារខ្មែរឆ្ងាញ់ បន្ទប់ស្នាក់នៅបែបឈើ និងកន្លែងបោះតង់...'
                            : 'e.g. Natural waterfall, authentic food, wooden bungalows, camping facilities...'
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all resize-none"
                      />
                    </div>
                  </div>

                  {/* Submit CTA */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white font-black text-sm shadow-xl shadow-amber-500/25 hover:from-amber-600 hover:to-amber-800 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                      style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
                    >
                      <span>🚀 {lang === 'kh' ? 'ផ្ញើសំណើចុះឈ្មោះផ្សព្វផ្សាយ' : 'Submit Partner Application'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-sm transition-colors"
                    >
                      {lang === 'kh' ? 'បិទ' : 'Cancel'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: PACKAGES */}
          {activeTab === 'packages' && (
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto mb-6">
                <h3
                  className="text-xl sm:text-2xl font-black text-slate-900 mb-2"
                  style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
                >
                  {lang === 'kh' ? 'កញ្ចប់ផ្សព្វផ្សាយដែលស័ក្តិសមបំផុត' : 'Choose the Perfect Promotion Plan'}
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm">
                  {lang === 'kh'
                    ? 'ជ្រើសរើសកញ្ចប់ដែលត្រូវនឹងទំហំអាជីវកម្មរបស់អ្នក ដើម្បីទទួលបានលទ្ធផលជាអតិបរមា។'
                    : 'Select a plan that best fits your goals to drive higher engagement and bookings.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {packages.map(pkg => (
                  <div
                    key={pkg.id}
                    className={`relative rounded-3xl p-6 flex flex-col justify-between transition-all ${pkg.color}`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs font-black px-3 py-1 rounded-full ${pkg.tagColor}`}>
                          {lang === 'kh' ? pkg.badge : pkg.badge_en}
                        </span>
                      </div>

                      <h4
                        className="text-lg font-black text-slate-900 mb-1"
                        style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
                      >
                        {lang === 'kh' ? pkg.name_kh : pkg.name_en}
                      </h4>
                      <div className="text-2xl font-black text-slate-900 mb-4">
                        {lang === 'kh' ? pkg.price : pkg.price_en}
                      </div>

                      <ul className="space-y-2.5 text-xs text-slate-600 mb-6 border-t border-slate-100 pt-4">
                        {(lang === 'kh' ? pkg.features_kh : pkg.features_en).map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-teal-600 font-bold">✓</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => {
                        setPackageType(pkg.id as any)
                        setActiveTab('form')
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-teal text-white font-bold text-xs transition-colors shadow"
                      style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
                    >
                      {lang === 'kh' ? 'ជ្រើសរើសកញ្ចប់នេះ →' : 'Choose This Plan →'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DIRECT CONTACT */}
          {activeTab === 'contact' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <h3
                  className="text-xl sm:text-2xl font-black text-slate-900 mb-2"
                  style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
                >
                  {lang === 'kh' ? 'ទំនាក់ទំនងក្រុមការងារ CamTourism ផ្ទាល់' : 'Direct Contact & Consultation'}
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm">
                  {lang === 'kh'
                    ? 'លោកអ្នកអាចទាក់ទងមកយើងខ្ញុំដោយផ្ទាល់ដើម្បីពិគ្រោះយោបល់ ឬសាកសួរព័ត៌មានបន្ថែម។'
                    : 'Feel free to reach out directly to our partnership team via phone or Telegram.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Telegram Card */}
                <a
                  href="https://t.me/CamTourismAdmin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white p-6 rounded-3xl border border-sky-100 shadow-sm hover:shadow-xl hover:border-sky-300 transition-all flex flex-col items-center text-center"
                >
                  <div className="w-14 h-14 bg-sky-100 text-[#229ED9] group-hover:bg-[#229ED9] group-hover:text-white rounded-2xl flex items-center justify-center transition-colors mb-4">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z" />
                    </svg>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900 mb-1">Telegram Hotline</h4>
                  <p className="text-xs text-slate-500 mb-3">@CamTourismAdmin</p>
                  <span className="px-4 py-1.5 rounded-full bg-sky-50 text-sky-700 text-xs font-bold group-hover:bg-[#229ED9] group-hover:text-white transition-colors">
                    {lang === 'kh' ? 'ជជែកតាម Telegram →' : 'Chat on Telegram →'}
                  </span>
                </a>

                {/* Phone Call Card */}
                <a
                  href="tel:+85512888999"
                  className="group bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col items-center text-center"
                >
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white rounded-2xl flex items-center justify-center transition-colors mb-4">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900 mb-1">Direct Call</h4>
                  <p className="text-xs text-slate-500 mb-3">+855 12 888 999 / +855 96 789 0123</p>
                  <span className="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    {lang === 'kh' ? 'ហៅទូរស័ព្ទផ្ទាល់ →' : 'Call Directly →'}
                  </span>
                </a>
              </div>

              {/* Working hours & assurance */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <span>🕒</span>
                  <span>{lang === 'kh' ? 'ម៉ោងធ្វើការឆ្លើយតប៖' : 'Operating Hours:'}</span>
                  <span className="font-normal text-slate-500">ចន្ទ - សៅរ៍ (8:00 AM – 6:00 PM)</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <span>🏢</span>
                  <span>{lang === 'kh' ? 'ទីតាំងការិយាល័យ៖' : 'Office Location:'}</span>
                  <span className="font-normal text-slate-500">រាជធានីភ្នំពេញ ព្រះរាជាណាចក្រកម្ពុជា</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
