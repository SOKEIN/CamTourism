import React, { useState, useMemo } from 'react'
import { PROVINCES, REGIONS, Province } from '../data/cambodiaData'

interface ProvincePickerModalProps {
  isOpen: boolean
  onClose: () => void
  selectedProvince: string
  onSelectProvince: (provinceEn: string) => void
  lang: 'kh' | 'en'
}

export const ProvincePickerModal: React.FC<ProvincePickerModalProps> = ({
  isOpen,
  onClose,
  selectedProvince,
  onSelectProvince,
  lang,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeRegion, setActiveRegion] = useState('all')

  const filteredProvinces = useMemo(() => {
    return PROVINCES.filter(p => {
      // Region filter
      if (activeRegion === 'capital_central') {
        if (!p.region_en.includes('Capital') && !p.region_en.includes('Central')) return false
      } else if (activeRegion === 'northwest') {
        if (!p.region_en.includes('Northwest')) return false
      } else if (activeRegion === 'coastal') {
        if (!p.region_en.includes('Coastal')) return false
      } else if (activeRegion === 'northeast') {
        if (!p.region_en.includes('Northeast')) return false
      } else if (activeRegion === 'plains_south') {
        if (!p.region_en.includes('Plains') && !p.region_en.includes('Southern')) return false
      }

      // Search filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim()
        const matchKh = p.kh.toLowerCase().includes(query)
        const matchEn = p.en.toLowerCase().includes(query)
        const matchSpots = p.topSpots_kh.some(s => s.toLowerCase().includes(query)) ||
                           p.topSpots_en.some(s => s.toLowerCase().includes(query))
        return matchKh || matchEn || matchSpots
      }

      return true
    })
  }, [searchTerm, activeRegion])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 sm:px-7 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-teal/5 via-amber-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-teal text-white flex items-center justify-center text-xl shadow-md shadow-teal/20">
              📍
            </div>
            <div>
              <h3
                className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight"
                style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
              >
                {lang === 'kh' ? 'ជ្រើសរើសរាជធានី-ខេត្តទាំង ២៥' : 'Select From All 25 Provinces'}
              </h3>
              <p
                className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5"
                style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
              >
                {lang === 'kh'
                  ? 'ស្វែងរកទីកន្លែងទេសចរណ៍តាមរាជធានី និងខេត្តទូទាំងប្រទេសកម្ពុជា'
                  : 'Explore tourist attractions across every province of Cambodia'}
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

        {/* Search & Region Filter Bar */}
        <div className="px-5 sm:px-7 py-3.5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800 space-y-3">
          {/* Search Input & Reset Button */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">🔍</span>
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder={
                  lang === 'kh'
                    ? 'ស្វែងរកតាមឈ្មោះខេត្ត ឬកន្លែងល្បី (ឧ. សៀមរាប, កោះរ៉ុង, បូករ...)'
                    : 'Search province or landmark (e.g. Siem Reap, Bokor...)'
                }
                className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
                style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
                autoFocus
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs p-1 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Option: All Provinces */}
            <button
              type="button"
              onClick={() => {
                onSelectProvince('')
                onClose()
              }}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all shrink-0 flex items-center justify-center gap-2 border cursor-pointer ${
                !selectedProvince
                  ? 'bg-teal text-white border-teal shadow-md shadow-teal/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal/50 hover:bg-teal/5'
              }`}
              style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
            >
              <span>🇰🇭</span>
              <span>{lang === 'kh' ? 'ខេត្តទាំងអស់ (២៥)' : 'All Provinces (25)'}</span>
              {!selectedProvince && <span className="text-amber-300">✓</span>}
            </button>
          </div>

          {/* Region Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {REGIONS.map(reg => (
              <button
                key={reg.id}
                type="button"
                onClick={() => setActiveRegion(reg.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeRegion === reg.id
                    ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
                style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
              >
                {lang === 'kh' ? reg.kh : reg.en}
              </button>
            ))}
          </div>
        </div>

        {/* Province Grid Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 min-h-[280px]">
          {filteredProvinces.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-4xl">🔍</span>
              <p
                className="text-base font-bold text-slate-700 dark:text-slate-300 mt-2"
                style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
              >
                {lang === 'kh' ? 'រកមិនឃើញខេត្តដែលត្រូវគ្នានឹង' : 'No provinces found matching'}{' '}
                <span className="text-teal">"{searchTerm}"</span>
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('')
                  setActiveRegion('all')
                }}
                className="mt-3 text-sm text-teal dark:text-teal-400 font-bold hover:underline cursor-pointer"
              >
                {lang === 'kh' ? 'បង្ហាញខេត្តទាំងអស់ឡើងវិញ' : 'Reset filters'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-3.5">
              {filteredProvinces.map(prov => {
                const isSelected = selectedProvince === prov.en
                return (
                  <button
                    key={prov.en}
                    type="button"
                    onClick={() => {
                      onSelectProvince(prov.en)
                      onClose()
                    }}
                    className={`group relative text-left p-2.5 sm:p-3 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-teal bg-teal/5 ring-2 ring-teal shadow-lg shadow-teal/10'
                        : 'border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-teal/40 hover:bg-slate-50/80 dark:hover:bg-slate-800/80 hover:shadow-md'
                    }`}
                  >
                    {/* Thumbnail Image */}
                    <div className="relative w-full h-24 sm:h-28 rounded-xl overflow-hidden mb-2.5 bg-slate-100 dark:bg-slate-800">
                      <img
                        src={prov.image}
                        alt={prov.en}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Spot count badge */}
                      <span className="absolute bottom-1.5 left-2 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-sm text-white text-[11px] font-bold">
                        {prov.count} {lang === 'kh' ? 'កន្លែង' : 'spots'}
                      </span>

                      {/* Checkmark when selected */}
                      {isSelected && (
                        <span className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-teal text-white flex items-center justify-center text-xs font-black shadow-md">
                          ✓
                        </span>
                      )}
                    </div>

                    {/* Province Titles */}
                    <div>
                      <div
                        className={`text-sm sm:text-base font-black truncate leading-snug ${
                          isSelected ? 'text-teal dark:text-teal-400' : 'text-slate-900 dark:text-white group-hover:text-teal dark:group-hover:text-teal-400'
                        }`}
                        style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
                      >
                        {lang === 'kh' ? prov.kh : prov.en}
                      </div>
                      <div
                        className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        {lang === 'kh' ? prov.en : prov.kh}
                      </div>

                      {/* Top highlight spot preview */}
                      <div
                        className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 truncate"
                        style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
                      >
                        🌟 {lang === 'kh' ? prov.topSpots_kh[0] : prov.topSpots_en[0]}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-7 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}>
            {lang === 'kh'
              ? `បង្ហាញខេត្តចំនួន ${filteredProvinces.length} នៃ ២៥ រាជធានី-ខេត្ត`
              : `Showing ${filteredProvinces.length} of 25 provinces`}
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors text-xs cursor-pointer"
            style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
          >
            {lang === 'kh' ? 'យល់ព្រម' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  )
}
