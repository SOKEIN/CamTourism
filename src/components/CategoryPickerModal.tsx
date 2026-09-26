import React from 'react'

export interface CategoryItem {
  id: string
  icon: string
  kh: string
  en: string
  count: number
  desc_kh: string
  desc_en: string
}

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'temple',
    icon: '🏛️',
    kh: 'ប្រាសាទបុរាណ',
    en: 'Ancient Temples',
    count: 12,
    desc_kh: 'បេតិកភណ្ឌពិភពលោក និងប្រាសាទអង្គរ',
    desc_en: 'World heritage sanctuaries and Angkor architecture',
  },
  {
    id: 'island',
    icon: '🏝️',
    kh: 'កោះ & ឆ្នេរសមុទ្រ',
    en: 'Islands & Beaches',
    count: 6,
    desc_kh: 'ឆ្នេរខ្សាច់ស ទឹកថ្លាឈ្វេង និងកោះឋានសួគ៌',
    desc_en: 'White sand beaches, crystal waters & island getaways',
  },
  {
    id: 'waterfall',
    icon: '💧',
    kh: 'ទឹកធ្លាក់ធម្មជាតិ',
    en: 'Waterfalls',
    count: 7,
    desc_kh: 'ទឹកធ្លាក់ប៊ូស្រា គូលែន និងអូរតាវ៉ៅ',
    desc_en: 'Bousra, Kulen and scenic cascading mountain falls',
  },
  {
    id: 'mountain',
    icon: '⛰️',
    kh: 'ភ្នំ & ឧទ្យានជាតិ',
    en: 'Mountains & Parks',
    count: 8,
    desc_kh: 'ភ្នំបូករ ភ្នំឱរ៉ាល់ និងជួរភ្នំក្រវាញ',
    desc_en: 'Bokor, Aural peak and Cardamom mountain range',
  },
  {
    id: 'culture',
    icon: '🏙️',
    kh: 'វប្បធម៌ & រាជធានី',
    en: 'Culture & Heritage',
    count: 10,
    desc_kh: 'ព្រះបរមរាជវាំង សារមន្ទីរ និងវត្តអារាមប្រវត្តិសាស្ត្រ',
    desc_en: 'Royal palace, historic museums and Buddhist pagodas',
  },
  {
    id: 'nature',
    icon: '🌿',
    kh: 'អេកូទេសចរណ៍ & ធម្មជាតិ',
    en: 'Ecotourism & Wildlife',
    count: 8,
    desc_kh: 'ផ្សោតកាំពី ដែនជម្រកសត្វព្រៃ និងព្រៃកោងកាង',
    desc_en: 'Irrawaddy dolphins, wildlife sanctuaries and mangroves',
  },
  {
    id: 'food',
    icon: '🍲',
    kh: 'ម្ហូបអាហារ & ផ្សាររាត្រី',
    en: 'Food & Night Markets',
    count: 5,
    desc_kh: 'រសជាតិម្ហូបខ្មែរ ក្តាមឆាម្រេចខ្ចី និងផ្សារកែប',
    desc_en: 'Authentic Khmer cuisine, Kep crab and vibrant night markets',
  },
]

interface CategoryPickerModalProps {
  isOpen: boolean
  onClose: () => void
  selectedCategory: string
  onSelectCategory: (categoryId: string) => void
  lang: 'kh' | 'en'
}

export const CategoryPickerModal: React.FC<CategoryPickerModalProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
  lang,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 sm:px-7 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-500/5 via-teal/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xl shadow-md shadow-amber-500/20">
              🏷️
            </div>
            <div>
              <h3
                className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight"
                style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
              >
                {lang === 'kh' ? 'ជ្រើសរើសប្រភេទទេសចរណ៍' : 'Select Travel Style'}
              </h3>
              <p
                className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5"
                style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
              >
                {lang === 'kh'
                  ? 'ជ្រើសរើសតាមចំណង់ចំណូលចិត្តនៃការដើរកម្សាន្តរបស់អ្នក'
                  : 'Choose destinations tailored to your favorite travel experiences'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors flex items-center justify-center text-sm font-bold cursor-pointer"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Quick Reset Option: All Categories */}
        <div className="px-5 sm:px-7 py-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              onSelectCategory('')
              onClose()
            }}
            className={`w-full py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-between border cursor-pointer ${
              !selectedCategory
                ? 'bg-teal text-white border-teal shadow-md shadow-teal/20'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal/50 hover:bg-teal/5'
            }`}
            style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">✨</span>
              <span>{lang === 'kh' ? 'គ្រប់ប្រភេទទាំងអស់ ( All Styles )' : 'All Travel Styles'}</span>
            </div>
            {!selectedCategory && <span className="text-amber-300 font-bold">✓ បានជ្រើសរើស</span>}
          </button>
        </div>

        {/* Categories Grid Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {CATEGORIES.map(cat => {
              const isSelected = selectedCategory === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    onSelectCategory(cat.id)
                    onClose()
                  }}
                  className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 cursor-pointer ${
                    isSelected
                      ? 'border-teal bg-teal/5 ring-2 ring-teal shadow-lg shadow-teal/10'
                      : 'border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-400 hover:bg-slate-50/80 dark:hover:bg-slate-800/80 hover:shadow-md'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-800/40 flex items-center justify-center text-2xl shrink-0">
                    {cat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={`text-sm sm:text-base font-black truncate leading-tight ${
                          isSelected ? 'text-teal dark:text-teal-400' : 'text-slate-900 dark:text-white'
                        }`}
                        style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
                      >
                        {lang === 'kh' ? cat.kh : cat.en}
                      </span>
                      {isSelected ? (
                        <span className="text-teal dark:text-teal-400 font-black text-sm">✓</span>
                      ) : (
                        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                          {cat.count} {lang === 'kh' ? 'កន្លែង' : 'spots'}
                        </span>
                      )}
                    </div>
                    <div
                      className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate mt-0.5"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      {lang === 'kh' ? cat.en : cat.kh}
                    </div>
                    <p
                      className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 leading-relaxed"
                      style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
                    >
                      {lang === 'kh' ? cat.desc_kh : cat.desc_en}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-7 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors text-xs sm:text-sm cursor-pointer"
            style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
          >
            {lang === 'kh' ? 'យល់ព្រម' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  )
}
