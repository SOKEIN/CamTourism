import { useState, useEffect, useRef } from 'react'
import {
  DESTINATIONS,
  PROVINCES,
  REGIONS,
  type Destination,
  type Province,
} from './data/cambodiaData'
import { CamTourismLogo } from './components/CamTourismLogo'
import { ProvincePickerModal } from './components/ProvincePickerModal'
import { CategoryPickerModal } from './components/CategoryPickerModal'
import { PartnerModal } from './components/PartnerModal'
import { PartnerBanner } from './components/PartnerBanner'
import { AdminModal } from './components/AdminModal'

type Lang = 'kh' | 'en'
type Page = 'home' | 'search' | 'destination' | 'province'

// ─── Translations ────────────────────────────────────────────────────────────
const T = {
  kh: {
    nav: ['ទំព័រដើម', 'តំបន់ទេសចរណ៍', 'ខេត្ត/រាជធានី', 'ប្រភេទ', 'ផែនទី', 'អំពីយើង'],
    login: 'ចូលគណនី',
    cta: 'ចាប់ផ្តើមស្វែងរក',
    hero_badge: 'ព្រះរាជាណាចក្រកម្ពុជា • ដែនដីនៃភាពអស្ចារ្យ',
    hero_h1: 'ស្វែងរកភាពអស្ចារ្យ',
    hero_h1b: 'នៃព្រះរាជាណាចក្រកម្ពុជា',
    hero_sub: 'Explore the Kingdom of Wonder',
    hero_desc: 'ស្វែងរកតំបន់ទេសចរណ៍ ប្រាសាទបុរាណ ធម្មជាតិស្រស់បំព្រង ឆ្នេរសមុទ្រ និងបទពិសោធន៍ថ្មីៗ នៅទូទាំងប្រទេសកម្ពុជា ទាំង ២៥ ខេត្ត-រាជធានី។',
    search_ph: 'ស្វែងរកទីកន្លែង ខេត្ត ឬប្រភេទទេសចរណ៍...',
    search: 'ស្វែងរក',
    all_provinces: 'ខេត្តទាំងអស់ (២៥)',
    all_categories: 'ប្រភេទទាំងអស់',
    cat_title: 'តើអ្នកចង់ទៅកម្សាន្តនៅទីណា?',
    cat_sub: 'ស្វែងរកតំបន់ទេសចរណ៍តាមចំណង់ចំណូលចិត្តរបស់អ្នក ធម្មជាតិ ប្រាសាទ ឬឆ្នេរសមុទ្រ។',
    pop_title: 'តំបន់ទេសចរណ៍ពេញនិយម និងល្បីល្បាញបំផុត',
    pop_sub: 'គោលដៅកំពូលៗដែលទាក់ទាញភ្ញៀវទេសចរជាតិ និងអន្តរជាតិច្រើនលើសលប់ ជាមួយនឹងការវាយតម្លៃខ្ពស់។',
    prov_title: 'ស្វែងរកតាមខេត្ត និងរាជធានី (ទាំង ២៥)',
    prov_sub: 'រុករកតំបន់ទេសចរណ៍តាមភូមិភាគ និងបណ្តាខេត្តក្រុងនីមួយៗទូទាំងប្រទេសកម្ពុជា។',
    view_all: 'មើលទាំងអស់ →',
    view_details: 'មើលព័ត៌មានលម្អិត',
    explore: 'ស្វែងរកតំបន់',
    destinations: 'តំបន់ទេសចរណ៍',
    reviews: 'មតិវាយតម្លៃ',
    footer_desc: 'គេហទំព័រផ្សព្វផ្សាយទេសចរណ៍កម្ពុជាផ្លូវការ ស្វែងរក និងស្គាល់កម្ពុជាឱ្យកាន់តែច្បាស់ជាមួយ CamTourism។',
    footer_cols: [
      { title: 'ស្វែងរក', links: ['តំបន់ទេសចរណ៍', 'ខេត្ត/រាជធានី', 'ប្រភេទទេសចរណ៍', 'ផែនទីទេសចរណ៍'] },
      { title: 'អំពី CamTourism', links: ['អំពីយើង', 'ទំនាក់ទំនង', 'គោលការណ៍ឯកជនភាព', 'លក្ខខណ្ឌប្រើប្រាស់'] },
    ],
    follow: 'តាមដានយើងនៅលើបណ្តាញសង្គម',
    copyright: '© 2026 CamTourism. រក្សាសិទ្ធិគ្រប់យ៉ាង។ ក្រសួងទេសចរណ៍នៃព្រះរាជាណាចក្រកម្ពុជា។',
    found: 'តំបន់ត្រូវបានរកឃើញ',
    filter_prov: 'ខេត្ត/រាជធានី (២៥)',
    filter_cat: 'ប្រភេទទេសចរណ៍',
    filter_rating: 'ការវាយតម្លៃអប្បបរមា',
    clear: 'លុបតម្រងទាំងអស់',
    sort_labels: ['ពេញនិយមបំផុត', 'ឈ្មោះ (A–Z)', 'ការវាយតម្លៃខ្ពស់', 'ថ្មីបំផុត'],
    about_title: 'អំពីទីកន្លែងនេះ',
    info_title: 'ព័ត៌មានសំខាន់ៗ',
    location: 'ទីតាំង',
    hours: 'ម៉ោងបើកទស្សនា',
    ticket: 'តម្លៃសំបុត្រចូលទស្សនា',
    best_time: 'ពេលវេលាល្អបំផុត',
    time_spent: 'រយៈពេលគួរចំណាយ',
    distance: 'ចម្ងាយពីទីរួមខេត្ត/ក្រុង',
    nearby: 'តំបន់ទេសចរណ៍នៅក្បែរ',
    facilities: 'សម្ភារៈ & សេវាកម្ម',
    open_maps: 'បើកក្នុង Google Maps',
    get_dir: 'ស្វែងរកផ្លូវធ្វើដំណើរ',
    rating_dist: 'ការវាយតម្លៃលម្អិត',
    write_review: 'សរសេរមតិវាយតម្លៃ',
    prov_hero_sub: 'ស្វែងយល់ពីតំបន់ទេសចរណ៍ក្នុង',
    saved_title: 'តំបន់ដែលបានរក្សាទុក',
    saved_empty: 'អ្នកមិនទាន់បានរក្សាទុកទីកន្លែងណានៅឡើយទេ។ ចុចប៊ូតុងបេះដូងលើទីកន្លែងដែលអ្នកពេញចិត្ត!',
    share_copied: 'បានចម្លងតំណភ្ជាប់ជោគជ័យ!',
    show_more: 'បង្ហាញបន្ថែមទៀត',
    show_less: 'បង្ហាញតិចជាងមុន',
  },
  en: {
    nav: ['Home', 'Destinations', 'Provinces', 'Categories', 'Map', 'About Us'],
    login: 'Sign In',
    cta: 'Start Exploring',
    hero_badge: 'Kingdom of Cambodia • Kingdom of Wonder',
    hero_h1: 'Discover the Wonders',
    hero_h1b: 'of Cambodia',
    hero_sub: 'Explore the Kingdom of Wonder • One Journey at a Time',
    hero_desc: 'Experience legendary ancient temples, tropical islands, pristine rainforest waterfalls, and authentic cultural heritage across all 25 provinces of Cambodia.',
    search_ph: 'Search destinations, provinces, or categories...',
    search: 'Search',
    all_provinces: 'All Provinces (25)',
    all_categories: 'All Categories',
    cat_title: 'Where Would You Like to Go?',
    cat_sub: 'Explore destinations tailored to your favorite travel style.',
    pop_title: 'Most Popular Destinations',
    pop_sub: 'Top-rated travel spots drawing travelers from around the globe.',
    prov_title: 'Explore by Province (All 25)',
    prov_sub: 'Browse destinations by geographical region across the Kingdom.',
    view_all: 'View All →',
    view_details: 'View Details',
    explore: 'Explore',
    destinations: 'Destinations',
    reviews: 'Reviews',
    footer_desc: 'The official destination portal for Cambodian tourism. Discover and experience the authentic Kingdom of Wonder with CamTourism.',
    footer_cols: [
      { title: 'Explore', links: ['Destinations', 'Provinces (25)', 'Categories', 'Travel Map'] },
      { title: 'About CamTourism', links: ['About Us', 'Contact', 'Privacy Policy', 'Terms of Service'] },
    ],
    follow: 'Follow us',
    copyright: '© 2026 CamTourism. All rights reserved. Kingdom of Cambodia.',
    found: 'destinations found',
    filter_prov: 'Provinces (25)',
    filter_cat: 'Category',
    filter_rating: 'Minimum Rating',
    clear: 'Clear Filters',
    sort_labels: ['Most Popular', 'Name (A–Z)', 'Highest Rated', 'Recently Added'],
    about_title: 'About This Destination',
    info_title: 'Key Information',
    location: 'Location',
    hours: 'Opening Hours',
    ticket: 'Entrance Fee',
    best_time: 'Best Season to Visit',
    time_spent: 'Recommended Duration',
    distance: 'Distance from City Center',
    nearby: 'Nearby Attractions',
    facilities: 'Facilities & Services',
    open_maps: 'Open in Google Maps',
    get_dir: 'Get Directions',
    rating_dist: 'Rating Breakdown',
    write_review: 'Write a Review',
    prov_hero_sub: 'Discover top tourist destinations in',
    saved_title: 'Saved Destinations',
    saved_empty: 'No saved destinations yet. Click the heart icon on any card to save it for later!',
    share_copied: 'Destination link copied to clipboard!',
    show_more: 'Show More Destinations',
    show_less: 'Show Less',
  },
}

// ─── Categories ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'temple', icon: '🏛️', kh: 'ប្រាសាទ & បេតិកភណ្ឌ', en: 'Temples & Heritage', count: 48 },
  { id: 'nature', icon: '🌿', kh: 'ធម្មជាតិ & ទេសភាព', en: 'Nature & Landscapes', count: 63 },
  { id: 'waterfall', icon: '💧', kh: 'ទឹកធ្លាក់', en: 'Waterfalls', count: 34 },
  { id: 'beach', icon: '🏖️', kh: 'ឆ្នេរសមុទ្រ & កោះ', en: 'Beaches & Islands', count: 29 },
  { id: 'mountain', icon: '🏔️', kh: 'ភ្នំ & ទេសភាពខ្ពង់រាប', en: 'Mountains & Treks', count: 21 },
  { id: 'culture', icon: '🎭', kh: 'វប្បធម៌ & ប្រវត្តិសាស្ត្រ', en: 'Culture & History', count: 31 },
  { id: 'eco', icon: '🌱', kh: 'អេកូទេសចរណ៍', en: 'Eco Tourism', count: 25 },
  { id: 'community', icon: '🏡', kh: 'ទេសចរណ៍សហគមន៍', en: 'Community Tourism', count: 22 },
  { id: 'food', icon: '🍜', kh: 'ម្ហូបអាហារ & ផ្សារបុរាណ', en: 'Food & Local Markets', count: 19 },
]

// ─── Helper Components ────────────────────────────────────────────────────────
function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <svg
          key={s}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={s <= Math.floor(rating) ? '#F59E0B' : s - 0.5 <= rating ? 'url(#halfStar)' : '#E2E8F0'}
        >
          <defs>
            <linearGradient id="halfStar">
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#E2E8F0" />
            </linearGradient>
          </defs>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </span>
  )
}

function HeartButton({ active, onChange }: { active: boolean; onChange: () => void }) {
  return (
    <button
      onClick={e => {
        e.stopPropagation()
        onChange()
      }}
      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
        active
          ? 'bg-rose-500 text-white scale-110'
          : 'bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white backdrop-blur-sm'
      }`}
      aria-label="Save destination"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    </button>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({
  lang,
  setLang,
  setPage,
  setSearchQuery,
  favCount,
  onOpenSaved,
  onOpenPartner,
  darkMode,
  setDarkMode,
}: {
  lang: Lang
  setLang: (l: Lang) => void
  setPage: (p: Page) => void
  setSearchQuery: (q: string) => void
  favCount: number
  onOpenSaved: () => void
  onOpenPartner: () => void
  darkMode: boolean
  setDarkMode: (d: boolean) => void
}) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const t = T[lang]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const q = (e.currentTarget.elements.namedItem('q') as HTMLInputElement)?.value || ''
    setSearchQuery(q)
    setPage('search')
    setSearchOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? darkMode
            ? 'bg-slate-950/95 backdrop-blur-md shadow-xl py-2 border-b border-slate-800'
            : 'bg-white/95 backdrop-blur-md shadow-lg shadow-slate-200/50 py-2 border-b border-slate-100'
          : 'bg-gradient-to-b from-dark/70 via-dark/40 to-transparent py-3'
      }`}
    >
      <div className="max-w-[1440px] w-full mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20 gap-2 sm:gap-4">
          {/* Logo with official CamTourism emblem */}
          <button
            onClick={() => setPage('home')}
            className="flex items-center gap-2 group text-left transition-transform active:scale-95 shrink-0"
          >
            <CamTourismLogo variant="navbar" isDark={!scrolled || darkMode} />
          </button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-5 shrink-0">
            {t.nav.map((n, i) => (
              <button
                key={i}
                onClick={() => {
                  if (i === 0) setPage('home')
                  else if (i === 1) {
                    setSearchQuery('')
                    setPage('search')
                  } else if (i === 2) {
                    setPage('home')
                    setTimeout(() => {
                      document.getElementById('province-section')?.scrollIntoView({ behavior: 'smooth' })
                    }, 50)
                  } else if (i === 3) {
                    setPage('home')
                    setTimeout(() => {
                      document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' })
                    }, 50)
                  } else if (i === 4) {
                    setPage('home')
                    setTimeout(() => {
                      document.getElementById('map-banner')?.scrollIntoView({ behavior: 'smooth' })
                    }, 50)
                  }
                }}
                className={`nav-link whitespace-nowrap shrink-0 text-[13px] xl:text-[15px] font-bold tracking-normal transition-all hover:scale-105 ${
                  scrolled
                    ? darkMode
                      ? 'text-slate-200 hover:text-amber-300'
                      : 'text-slate-800 hover:text-teal'
                    : 'text-white hover:text-amber-300'
                }`}
                style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
              >
                {n}
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 xl:gap-3 shrink-0">
            {/* Quick Search trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`w-9 h-9 xl:w-10 xl:h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                scrolled
                  ? darkMode
                    ? 'text-slate-200 hover:bg-slate-800'
                    : 'text-slate-700 hover:bg-slate-100'
                  : 'text-white/90 hover:text-white hover:bg-white/15'
              }`}
              title="Search"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>

            {/* Saved Favorites trigger */}
            <button
              onClick={onOpenSaved}
              className={`relative w-9 h-9 xl:w-10 xl:h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                scrolled
                  ? darkMode
                    ? 'text-slate-200 hover:bg-slate-800 hover:text-rose-400'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-rose-500'
                  : 'text-white/90 hover:text-white hover:bg-white/15'
              }`}
              title={t.saved_title}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              {favCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-rose-500 text-white rounded-full text-[11px] font-bold flex items-center justify-center">
                  {favCount}
                </span>
              )}
            </button>

            {/* Dark / Light Mode Switcher */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-9 h-9 xl:w-10 xl:h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                scrolled
                  ? darkMode
                    ? 'text-amber-400 bg-slate-800 hover:bg-slate-700'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-amber-500'
                  : darkMode
                  ? 'text-amber-400 bg-white/15 hover:bg-white/25'
                  : 'text-white/90 hover:text-white hover:bg-white/15'
              }`}
              title={
                darkMode
                  ? lang === 'kh'
                    ? 'ប្ដូរទៅ Light Mode ☀️'
                    : 'Switch to Light Mode ☀️'
                  : lang === 'kh'
                  ? 'ប្ដូរទៅ Dark Mode 🌙'
                  : 'Switch to Dark Mode 🌙'
              }
              aria-label="Toggle theme mode"
            >
              {darkMode ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-amber-400">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              ) : (
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'kh' ? 'en' : 'kh')}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full text-xs xl:text-sm font-bold border whitespace-nowrap shrink-0 transition-all ${
                scrolled
                  ? darkMode
                    ? 'border-slate-700 text-slate-200 hover:border-amber-400 hover:text-amber-300 bg-slate-800/80'
                    : 'border-slate-200 text-slate-800 hover:border-teal hover:text-teal bg-slate-50'
                  : 'border-white/30 text-white hover:bg-white/20 bg-white/10 backdrop-blur-sm'
              }`}
            >
              <span className="whitespace-nowrap inline-flex items-center gap-1">{lang === 'kh' ? '🇰🇭 ខ្មែរ' : '🇬🇧 EN'}</span>
            </button>

            {/* Partner Button - visible on desktop/wide screens, accessible in drawer for mobile/tablet */}
            <button
              onClick={onOpenPartner}
              className={`hidden xl:inline-flex items-center gap-1.5 px-3 py-2 xl:px-3.5 xl:py-2.5 rounded-xl text-xs xl:text-sm font-black border whitespace-nowrap shrink-0 transition-all hover:scale-105 active:scale-95 shadow-sm ${
                scrolled
                  ? darkMode
                    ? 'border-amber-400/80 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                    : 'border-amber-400 bg-amber-50 text-amber-900 hover:bg-amber-100 shadow-amber-400/20'
                  : 'border-amber-400/70 bg-amber-500/25 text-amber-300 hover:bg-amber-500/40 backdrop-blur-sm shadow-lg'
              }`}
              style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
            >
              <span className="text-base shrink-0">📢</span>
              <span className="whitespace-nowrap">{lang === 'kh' ? 'ផ្សព្វផ្សាយរមណីយដ្ឋាន' : 'List Resort'}</span>
            </button>

            {/* Explore CTA Button - visible on desktop, accessible in drawer for mobile/tablet */}
            <button
              onClick={() => {
                setSearchQuery('')
                setPage('search')
              }}
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 xl:px-4.5 xl:py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs xl:text-sm font-black rounded-xl whitespace-nowrap shrink-0 shadow-md shadow-amber-500/30 transition-all hover:scale-105 active:scale-95"
              style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
            >
              <span className="whitespace-nowrap">{t.cta}</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`lg:hidden w-10 h-10 rounded-full flex items-center justify-center ${
                scrolled ? (darkMode ? 'text-slate-100' : 'text-slate-800') : 'text-white'
              }`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                {menuOpen ? (
                  <path d="M18 6 6 18M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Quick Search Dropdown */}
        {searchOpen && (
          <div className="py-3 border-t border-slate-100/20 animate-in fade-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleNavSearch} className="flex gap-2">
              <div className={`flex-1 relative flex items-center rounded-xl shadow-xl border px-3 py-2 ${
                darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
              }`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" className="mr-2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  name="q"
                  autoFocus
                  placeholder={t.search_ph}
                  className={`w-full text-sm outline-none ${
                    darkMode ? 'bg-transparent text-white placeholder-slate-400' : 'bg-transparent text-slate-800 placeholder-slate-400'
                  }`}
                  style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2 bg-teal text-white rounded-xl text-xs font-bold shadow-md hover:bg-teal-dark transition-colors"
                style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
              >
                {t.search}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className={`lg:hidden px-6 py-6 shadow-2xl border-b ${
          darkMode
            ? 'bg-slate-950/95 backdrop-blur-xl border-slate-800 text-slate-100'
            : 'bg-white/95 backdrop-blur-xl border-slate-200 text-slate-800'
        }`}>
          <div className="flex flex-col gap-3">
            {/* Dark Mode toggle row in mobile drawer */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-sm font-bold flex items-center gap-2">
                {darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </span>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
              >
                {darkMode ? (lang === 'kh' ? 'ប្ដូរទៅ Light ☀️' : 'Switch to Light ☀️') : (lang === 'kh' ? 'ប្ដូរទៅ Dark 🌙' : 'Switch to Dark 🌙')}
              </button>
            </div>

            {t.nav.map((n, i) => (
              <button
                key={i}
                onClick={() => {
                  setMenuOpen(false)
                  if (i === 0) setPage('home')
                  else if (i === 1) {
                    setSearchQuery('')
                    setPage('search')
                  } else if (i === 2) {
                    setPage('home')
                    setTimeout(() => document.getElementById('province-section')?.scrollIntoView({ behavior: 'smooth' }), 50)
                  } else if (i === 3) {
                    setPage('home')
                    setTimeout(() => document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' }), 50)
                  } else if (i === 4) {
                    setPage('home')
                    setTimeout(() => document.getElementById('map-banner')?.scrollIntoView({ behavior: 'smooth' }), 50)
                  }
                }}
                className="text-left py-3 text-lg font-bold hover:text-teal border-b border-slate-100 dark:border-slate-800 transition-colors"
                style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
              >
                {n}
              </button>
            ))}
            <div className="flex flex-col gap-2.5 pt-4">
              <button
                onClick={() => {
                  setMenuOpen(false)
                  onOpenPartner()
                }}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-base shadow-md"
                style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
              >
                <span className="text-lg">📢</span>
                <span>{lang === 'kh' ? 'ផ្សព្វផ្សាយរមណីយដ្ឋាន (Partner)' : 'List Your Resort'}</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false)
                  onOpenSaved()
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-base font-bold"
              >
                <span>❤️ {t.saved_title} ({favCount})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

// ─── Hero Section with Atmospheric Switcher & Smart Travel Search Hub ─────────
const SCENES = [
  {
    id: 'angkor',
    title_kh: 'ប្រាសាទអង្គរវត្ត',
    title_en: 'Angkor Wat',
    location_kh: 'សៀមរាប',
    location_en: 'Siem Reap',
    badge_kh: 'បេតិកភណ្ឌពិភពលោក UNESCO',
    badge_en: 'UNESCO World Heritage',
    destId: 1,
    image: 'https://images.unsplash.com/photo-1599283787923-51b965a58b05?w=1920&h=1080&fit=crop&auto=format',
    icon: '🏛️',
  },
  {
    id: 'kohrong',
    title_kh: 'កោះរ៉ុងសន្លឹម',
    title_en: 'Koh Rong Sanloem',
    location_kh: 'ព្រះសីហនុ',
    location_en: 'Preah Sihanouk',
    badge_kh: 'ឋានសួគ៌កោះត្រូពិច',
    badge_en: 'Tropical Island Paradise',
    destId: 15,
    image: 'https://images.unsplash.com/photo-1651510688982-75f481b89027?w=1920&h=1080&fit=crop&auto=format',
    icon: '🏝️',
  },
  {
    id: 'bousra',
    title_kh: 'ទឹកធ្លាក់ប៊ូស្រា',
    title_en: 'Bousra Waterfall',
    location_kh: 'មណ្ឌលគិរី',
    location_en: 'Mondulkiri',
    badge_kh: 'ទឹកធ្លាក់ធម្មជាតិព្រៃភ្នំ',
    badge_en: 'Rainforest Cascade',
    destId: 6,
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0c/Bousra_Waterfall.jpg/1280px-Bousra_Waterfall.jpg',
    icon: '💧',
  },
  {
    id: 'bokor',
    title_kh: 'ឧទ្យានជាតិភ្នំបូករ',
    title_en: 'Bokor National Park',
    location_kh: 'កំពត',
    location_en: 'Kampot',
    badge_kh: 'អាកាសធាតុត្រជាក់ & សមុទ្រពពក',
    badge_en: 'Misty Mountain Plateau',
    destId: 3,
    image: 'https://images.unsplash.com/photo-1653714802676-6a50c7ead70e?w=1920&h=1080&fit=crop&auto=format',
    icon: '⛰️',
  },
]

const HERO_MOOD_TABS = [
  { id: 'all', icon: '✨', kh: 'ទាំងអស់', en: 'All Wonders', cat: '' },
  { id: 'temple', icon: '🏛️', kh: 'ប្រាសាទបុរាណ', en: 'Temples', cat: 'Ancient Temples' },
  { id: 'island', icon: '🏝️', kh: 'កោះ & ឆ្នេរសមុទ្រ', en: 'Islands & Beaches', cat: 'Islands & Beaches' },
  { id: 'waterfall', icon: '💧', kh: 'ទឹកធ្លាក់ & ធម្មជាតិ', en: 'Waterfalls', cat: 'Waterfalls' },
  { id: 'mountain', icon: '⛰️', kh: 'ភ្នំ & ផ្សងព្រេង', en: 'Mountains', cat: 'Mountains & Parks' },
]

function Hero({
  lang,
  setPage,
  setSearchQuery,
  setSelectedDest,
}: {
  lang: Lang
  setPage: (p: Page) => void
  setSearchQuery: (q: string) => void
  setSelectedDest: (d: Destination) => void
}) {
  const t = T[lang]
  const [activeScene, setActiveScene] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [activeMoodTab, setActiveMoodTab] = useState('all')

  // Search states
  const [keyword, setKeyword] = useState('')
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  // Modal dialog states
  const [showProvModal, setShowProvModal] = useState(false)
  const [showCatModal, setShowCatModal] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const searchBoxRef = useRef<HTMLDivElement>(null)

  // Auto-cycle scenic backgrounds every 8 seconds
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setActiveScene(prev => (prev + 1) % SCENES.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [isPaused])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const currentScene = SCENES[activeScene]
  const activeSceneDest = DESTINATIONS.find(d => d.id === currentScene.destId)

  // Autocomplete matching destinations
  const suggestions = keyword.trim()
    ? DESTINATIONS.filter(
        d =>
          d.en.toLowerCase().includes(keyword.toLowerCase()) ||
          d.kh.includes(keyword) ||
          d.province_en.toLowerCase().includes(keyword.toLowerCase()) ||
          d.province_kh.includes(keyword)
      ).slice(0, 5)
    : DESTINATIONS.filter(d => d.isPopular).slice(0, 5)

  const handleDoSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const queryParts = [keyword, selectedProvince, selectedCategory].filter(Boolean)
    setSearchQuery(queryParts.join(' '))
    setPage('search')
    setShowSuggestions(false)
    setShowProvModal(false)
    setShowCatModal(false)
  }

  const handleSelectMood = (tab: typeof HERO_MOOD_TABS[0]) => {
    setActiveMoodTab(tab.id)
    setSelectedCategory(tab.cat)
  }

  const selectedProvObj = PROVINCES.find(p => p.en === selectedProvince)
  const selectedCatObj = CATEGORIES.find(c => c.en === selectedCategory)

  return (
    <section
      className="relative min-h-[740px] lg:min-h-[840px] flex flex-col justify-between pt-24 sm:pt-28 pb-6 sm:pb-8 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 1. Stacked Cross-Fade Background Images */}
      {SCENES.map((scene, idx) => (
        <div
          key={scene.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            idx === activeScene ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
          style={{ transitionProperty: 'opacity, transform', transitionDuration: '1000ms' }}
        >
          <img
            src={scene.image}
            alt={scene.title_en}
            className="w-full h-full object-cover object-center"
            onError={e => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1599283787923-51b965a58b05?w=1920&h=1080&fit=crop&auto=format'
            }}
          />
        </div>
      ))}

      {/* Atmospheric Vignette & Color Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-900/65" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-transparent to-slate-950/85 pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none" />

      {/* 2. Center Content & Smart Search Hub */}
      <div className="relative z-20 max-w-5xl mx-auto px-3.5 sm:px-6 w-full text-center mt-4 sm:mt-6">
        {/* Royal Kingdom Heritage Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 bg-slate-900/80 hover:bg-slate-900/95 backdrop-blur-md border border-amber-400/40 rounded-full px-4 sm:px-5 py-1.5 sm:py-2 mb-3.5 sm:mb-4 shadow-xl transition-all">
          <span className="text-amber-400 text-sm">🇰🇭</span>
          <span
            className="text-amber-300 text-xs sm:text-sm font-bold tracking-wider uppercase"
            style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
          >
            {t.hero_badge}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse ml-0.5" />
        </div>

        {/* High-Impact Headline */}
        <h1
          className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-1 drop-shadow-xl"
          style={{
            fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif',
            textShadow: '0 4px 24px rgba(0,0,0,0.65)',
          }}
        >
          {t.hero_h1}
        </h1>
        <h1
          className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-3.5 sm:mb-4 drop-shadow-xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500"
          style={{
            fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif',
            textShadow: '0 4px 30px rgba(245,158,11,0.3)',
          }}
        >
          {t.hero_h1b}
        </h1>

        <p
          className="text-white/90 text-xs sm:text-sm md:text-base max-w-2xl mx-auto mb-5 sm:mb-7 leading-relaxed font-normal drop-shadow px-2"
          style={{
            fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif',
            lineHeight: lang === 'kh' ? 1.9 : 1.6,
          }}
        >
          {t.hero_desc}
        </p>

        {/* 3. Re-Engineered Smart Travel Search Hub */}
        <div ref={searchBoxRef} className="max-w-4xl mx-auto relative text-left">
          {/* Interactive Travel Mood Quick Tabs */}
          <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 mb-2.5 sm:mb-3 overflow-x-auto no-scrollbar py-1 px-1">
            {HERO_MOOD_TABS.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleSelectMood(tab)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-1.5 backdrop-blur-md cursor-pointer ${
                  activeMoodTab === tab.id
                    ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30 scale-105 font-black ring-2 ring-amber-300'
                    : 'bg-slate-900/60 hover:bg-slate-900/85 text-white/90 hover:text-white border border-white/20 hover:border-amber-400/60'
                }`}
                style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
              >
                <span>{tab.icon}</span>
                <span>{lang === 'kh' ? tab.kh : tab.en}</span>
              </button>
            ))}
          </div>

          {/* Main Search Bar Shell - Glassmorphic, Modern & Responsive */}
          <form
            onSubmit={handleDoSearch}
            className="bg-white/95 dark:bg-slate-900/95 rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/50 p-2 sm:p-2.5 border border-white/80 dark:border-slate-700/80 backdrop-blur-xl flex flex-col lg:flex-row items-stretch gap-2 transition-all relative z-30"
          >
            {/* Compartment 1: Destination / Keyword Input */}
            <div className="flex-1 relative flex items-center px-4 py-3 rounded-xl sm:rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-100 dark:border-slate-800 focus-within:border-teal/50 focus-within:bg-slate-50/90 dark:focus-within:bg-slate-800 transition-all">
              <span className="text-teal text-xl mr-3 shrink-0">🔍</span>
              <div className="flex-1 min-w-0">
                <span
                  className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 leading-none mb-1"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {lang === 'kh' ? 'តំបន់ទេសចរណ៍ / ទីកន្លែង' : 'Destination / Place'}
                </span>
                <input
                  value={keyword}
                  onChange={e => {
                    setKeyword(e.target.value)
                    setShowSuggestions(true)
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder={lang === 'kh' ? 'ឧ. អង្គរវត្ត, កោះរ៉ុង, ប៊ូស្រា...' : 'e.g. Angkor, Koh Rong, Bousra...'}
                  className="w-full bg-transparent text-sm sm:text-base font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
                  style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
                />
              </div>
              {keyword && (
                <button
                  type="button"
                  onClick={() => setKeyword('')}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-sm p-1.5 cursor-pointer"
                >
                  ✕
                </button>
              )}

              {/* Suggestions Popup Dropdown */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2 mb-2 flex items-center justify-between">
                    <span>{keyword ? (lang === 'kh' ? 'លទ្ធផលផ្គូផ្គង' : 'Matches') : (lang === 'kh' ? 'តំបន់ពេញនិយម' : 'Popular Highlights')}</span>
                    <button
                      type="button"
                      onClick={() => setShowSuggestions(false)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xs p-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-1.5 max-h-72 overflow-y-auto">
                    {suggestions.map(s => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setSelectedDest(s)
                          setPage('destination')
                          setShowSuggestions(false)
                        }}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-teal/5 dark:hover:bg-teal/10 transition-colors text-left group cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                          <img src={s.image} alt={s.en} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div
                            className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-teal dark:group-hover:text-teal-400 text-sm sm:text-base truncate"
                            style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
                          >
                            {lang === 'kh' ? s.kh : s.en}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {lang === 'kh' ? s.province_kh : s.province_en} · ⭐ {s.rating} ({s.reviews} {lang === 'kh' ? 'មតិ' : 'reviews'})
                          </div>
                        </div>
                        <span className="text-sm text-teal font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                          →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Compartments 2 & 3: Responsive Grid for Tablet, iPad & Mobile */}
            <div className="grid grid-cols-2 lg:flex items-stretch gap-2">
              {/* Compartment 2: Custom Province Selector Button */}
              <button
                type="button"
                onClick={() => {
                  setShowProvModal(true)
                  setShowCatModal(false)
                  setShowSuggestions(false)
                }}
                className="w-full lg:w-56 text-left px-3.5 sm:px-4 py-3 rounded-xl sm:rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-100 dark:border-slate-800 hover:border-teal/30 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="min-w-0 pr-1">
                  <span
                    className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 leading-none mb-1"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    {lang === 'kh' ? 'រាជធានី-ខេត្ត (២៥)' : 'Province (25)'}
                  </span>
                  <div
                    className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal dark:group-hover:text-teal-400 truncate transition-colors"
                    style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
                  >
                    {selectedProvObj
                      ? `📍 ${lang === 'kh' ? selectedProvObj.kh : selectedProvObj.en}`
                      : lang === 'kh'
                      ? 'ខេត្តទាំងអស់ (២៥)'
                      : 'All 25 Provinces'}
                  </div>
                </div>
                <span className="text-slate-400 group-hover:text-teal text-xs ml-1.5 shrink-0">▼</span>
              </button>

              {/* Compartment 3: Custom Category Selector Button */}
              <button
                type="button"
                onClick={() => {
                  setShowCatModal(true)
                  setShowProvModal(false)
                  setShowSuggestions(false)
                }}
                className="w-full lg:w-52 text-left px-3.5 sm:px-4 py-3 rounded-xl sm:rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-100 dark:border-slate-800 hover:border-teal/30 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="min-w-0 pr-1">
                  <span
                    className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 leading-none mb-1"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    {lang === 'kh' ? 'ប្រភេទទេសចរណ៍' : 'Category / Style'}
                  </span>
                  <div
                    className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal dark:group-hover:text-teal-400 truncate transition-colors"
                    style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
                  >
                    {selectedCatObj
                      ? `${selectedCatObj.icon} ${lang === 'kh' ? selectedCatObj.kh : selectedCatObj.en}`
                      : lang === 'kh'
                      ? 'គ្រប់ប្រភេទទាំងអស់'
                      : 'All Styles'}
                  </div>
                </div>
                <span className="text-slate-400 group-hover:text-teal text-xs ml-1.5 shrink-0">▼</span>
              </button>
            </div>

            {/* Compartment 4: Search Submit Button */}
            <button
              type="submit"
              className="w-full lg:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-teal to-teal-dark hover:from-teal-dark hover:to-teal text-white rounded-xl sm:rounded-2xl font-black text-sm sm:text-base shadow-xl shadow-teal/30 hover:shadow-teal/50 hover:scale-[1.02] active:scale-95 transition-all shrink-0 cursor-pointer"
              style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <span>{t.search}</span>
            </button>
          </form>

          {/* Interactive Modals for Province & Category Selection */}
          <ProvincePickerModal
            isOpen={showProvModal}
            onClose={() => setShowProvModal(false)}
            selectedProvince={selectedProvince}
            onSelectProvince={provEn => setSelectedProvince(provEn)}
            lang={lang}
          />

          <CategoryPickerModal
            isOpen={showCatModal}
            onClose={() => setShowCatModal(false)}
            selectedCategory={selectedCategory}
            onSelectCategory={catId => {
              const matched = CATEGORIES.find(c => c.id === catId || c.en.toLowerCase().includes(catId.toLowerCase()))
              setSelectedCategory(matched ? matched.en : catId)
              const moodMatched = HERO_MOOD_TABS.find(m => m.id === catId || (matched && m.cat === matched.en))
              if (moodMatched) setActiveMoodTab(moodMatched.id)
            }}
            lang={lang}
          />

          {/* Quick Experience Filter Chips */}
          <div className="flex items-center justify-start sm:justify-center gap-2 mt-4 overflow-x-auto no-scrollbar py-1 px-1">
            <span className="text-white/80 text-xs font-bold mr-1 shrink-0 flex items-center gap-1">
              <span>🔥</span>
              <span>{lang === 'kh' ? 'ពេញនិយម៖' : 'Popular:'}</span>
            </span>
            {[
              { label: '🏛️ ប្រាសាទអង្គរវត្ត', query: 'អង្គរវត្ត' },
              { label: '🏝️ កោះរ៉ុងសមុទ្រថ្លា', query: 'កោះរ៉ុង' },
              { label: '💧 ទឹកធ្លាក់ប៊ូស្រា', query: 'ប៊ូស្រា' },
              { label: '⛰️ ភ្នំបូករកំពត', query: 'បូករ' },
              { label: '🚋 រថភ្លើងឫស្សី', query: 'រថភ្លើងឫស្សី' },
              { label: '🐬 ផ្សោតកាំពី', query: 'កាំពី' },
            ].map(chip => (
              <button
                key={chip.query}
                type="button"
                onClick={() => {
                  setSearchQuery(chip.query)
                  setPage('search')
                }}
                className="px-3.5 py-1.5 rounded-full bg-slate-900/60 hover:bg-slate-900/90 border border-white/20 hover:border-amber-400 text-white hover:text-amber-300 text-xs sm:text-sm font-semibold backdrop-blur-md transition-all hover:scale-105 active:scale-95 shadow-sm shrink-0 cursor-pointer"
                style={{ fontFamily: 'Noto Sans Khmer, sans-serif' }}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Bottom Hero Bar: Location Spotlight (Left) & Scenic Switcher (Right) */}
      <div className="relative z-20 max-w-7xl mx-auto px-3.5 sm:px-6 w-full flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 border-t border-white/10">
        {/* Floating Active Spot Card (Left) */}
        {activeSceneDest && (
          <button
            type="button"
            onClick={() => {
              setSelectedDest(activeSceneDest)
              setPage('destination')
            }}
            className="w-full md:w-auto flex items-center gap-3.5 bg-slate-950/80 hover:bg-slate-900 backdrop-blur-xl border border-white/20 hover:border-amber-400 rounded-2xl p-2.5 pr-5 text-left transition-all hover:scale-[1.02] group shadow-2xl cursor-pointer"
          >
            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-800 shrink-0 ring-2 ring-white/10 group-hover:ring-amber-400/50 transition-all">
              <img
                src={activeSceneDest.image}
                alt={activeSceneDest.en}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={e => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1595781723824-9213a40e3257?w=400&h=400&fit=crop&auto=format'
                }}
              />
              <span className="absolute top-1 left-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-black animate-pulse" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-black text-amber-400 uppercase tracking-wide truncate">
                  {lang === 'kh' ? currentScene.badge_kh : currentScene.badge_en}
                </span>
                <span className="text-[11px] text-white/70 shrink-0">· ⭐ {activeSceneDest.rating}</span>
              </div>
              <div
                className="text-white font-black text-sm sm:text-base group-hover:text-amber-300 transition-colors truncate"
                style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
              >
                {lang === 'kh' ? currentScene.title_kh : currentScene.title_en}
              </div>
              <div className="text-xs text-slate-300 font-medium flex items-center gap-1">
                <span>📍 {lang === 'kh' ? currentScene.location_kh : currentScene.location_en}</span>
                <span className="text-amber-300 font-bold ml-1 group-hover:translate-x-1 transition-transform inline-block">
                  {lang === 'kh' ? 'ព័ត៌មានលម្អិត →' : 'Details →'}
                </span>
              </div>
            </div>
          </button>
        )}

        {/* Scenic Scene Switcher Controls (Right) */}
        <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-1.5 sm:gap-2 bg-slate-950/80 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 shadow-2xl">
          {/* Prev Scene Arrow */}
          <button
            type="button"
            onClick={() => setActiveScene(prev => (prev - 1 + SCENES.length) % SCENES.length)}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition-colors cursor-pointer shrink-0"
            title="Previous scene"
            aria-label="Previous scene"
          >
            ‹
          </button>

          {/* Scenes List */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {SCENES.map((scene, idx) => (
              <button
                key={scene.id}
                type="button"
                onClick={() => setActiveScene(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  activeScene === idx
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md font-black scale-105'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
              >
                <span>{scene.icon}</span>
                <span className="hidden sm:inline">{lang === 'kh' ? scene.title_kh : scene.title_en}</span>
              </button>
            ))}
          </div>

          {/* Next Scene Arrow */}
          <button
            type="button"
            onClick={() => setActiveScene(prev => (prev + 1) % SCENES.length)}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition-colors cursor-pointer shrink-0"
            title="Next scene"
            aria-label="Next scene"
          >
            ›
          </button>

          {/* Play / Pause Toggle */}
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-colors cursor-pointer shrink-0 ml-0.5 sm:ml-1 ${
              isPaused ? 'bg-amber-400/20 text-amber-300' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title={isPaused ? 'Resume auto-cycle' : 'Pause auto-cycle'}
            aria-label="Toggle auto cycle"
          >
            {isPaused ? '▶' : '⏸'}
          </button>
        </div>
      </div>
    </section>
  )
}


// ─── Running Text Ticker (អក្សររត់ - Cambodia Tourism Highlights) ───────────────
function CambodiaHighlightsTicker({ lang }: { lang: Lang }) {
  const highlights = [
    {
      icon: '🇰🇭',
      kh: 'ព្រះរាជាណាចក្រកម្ពុជា «ព្រះរាជាណាចក្រនៃភាពអស្ចារ្យ» (Kingdom of Wonder)',
      en: 'Kingdom of Cambodia — "Kingdom of Wonder", Rich Heritage & Living Culture',
    },
    {
      icon: '🏛️',
      kh: 'អបអរសាទរ រមណីយដ្ឋានប្រាសាទកោះកេរ ចុះបញ្ជីបេតិកភណ្ឌពិភពលោក UNESCO (២០២៣)',
      en: 'Celebration: Koh Ker Temple Complex inscribed as UNESCO World Heritage Site',
    },
    {
      icon: '🌅',
      kh: 'ទស្សនាថ្ងៃរះដ៏អស្ចារ្យលើកំពូលប្រាសាទអង្គរវត្ត គោលដៅទេសចរណ៍បេតិកភណ្ឌលេខ ១ លើពិភពលោក',
      en: 'Witness iconic sunrise over Angkor Wat — World’s #1 Cultural Landmark',
    },
    {
      icon: '🏝️',
      kh: 'រដូវកាលវិស្សមកាលកោះឋានសួគ៌ កោះរ៉ុង & កោះរ៉ុងសន្លឹម ទឹកសមុទ្រថ្លាដូចកញ្ចក់ ខ្សាច់សក្បុស',
      en: 'Tropical Island Getaway: Koh Rong & Koh Rong Sanloem with turquoise waters',
    },
    {
      icon: '⛰️',
      kh: 'ដំណើរផ្សងព្រេងឡើងភ្នំបូករ និងភ្នំខ្នងផ្សារ ស្រូបយកអ័ព្ទត្រជាក់ និងសមុទ្រពពកធម្មជាតិ',
      en: 'Adventure trekking to Bokor & Khnorng Phsar highland clouds',
    },
    {
      icon: '🐬',
      kh: 'គយគន់សត្វផ្សោតក្បាលត្រឡោកទន្លេមេគង្គដ៏កម្រលើលោក នៅអន្លង់ផ្សោតកាំពី ខេត្តក្រចេះ',
      en: 'Spot rare freshwater Irrawaddy dolphins at Kampi, Kratie Province',
    },
    {
      icon: '🚋',
      kh: 'បទពិសោធន៍ជិះរថភ្លើងឫស្សី (ណូរី) កាត់វាលស្រែ និងផ្ទះបុរាណវត្តគរ ខេត្តបាត់ដំបង',
      en: 'Ride the world-unique Bamboo Train through Battambang countryside',
    },
    {
      icon: '💧',
      kh: 'ទស្សនាទឹកធ្លាក់ប៊ូស្រាដ៏មហិមា និងជម្រកដំរីអេកូទេសចរណ៍ ខេត្តមណ្ឌលគិរី',
      en: 'Marvel at Bousra Waterfall and ethical elephant sanctuaries in Mondulkiri',
    },
  ]

  // Duplicate for seamless infinite loop
  const loopItems = [...highlights, ...highlights]

  return (
    <div className="bg-slate-900 dark:bg-slate-950 text-white border-y border-teal-800/40 shadow-inner overflow-hidden py-3 relative transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 flex items-center gap-3">
        {/* Fixed Badge on left */}
        <div className="shrink-0 flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded-lg text-xs font-black uppercase tracking-wider shadow-md z-10 select-none">
          <span className="animate-pulse">📢</span>
          <span className="hidden sm:inline">{lang === 'kh' ? 'ព័ត៌មានពិសេស' : 'Highlights'}</span>
        </div>

        {/* Marquee Container */}
        <div className="overflow-hidden flex-1 relative [mask-image:linear-gradient(to_right,transparent,black_30px,black_calc(100%-30px),transparent)]">
          <div className="animate-marquee hover:[animation-play-state:paused] py-0.5">
            {loopItems.map((item, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2 mx-6 text-xs sm:text-sm font-medium text-slate-200 hover:text-amber-300 transition-colors whitespace-nowrap cursor-default"
                style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
              >
                <span className="text-base">{item.icon}</span>
                <span>{lang === 'kh' ? item.kh : item.en}</span>
                <span className="text-teal-400 font-bold ml-4">✦</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Running Photo Marquee (រូបភាពរត់ - Top Destinations Strip) ────────────────
function RunningPhotoMarquee({
  lang,
  onSelectDest,
}: {
  lang: Lang
  onSelectDest: (d: Destination) => void
}) {
  // Select 12 iconic destinations across different categories and provinces
  const photoDestinations = DESTINATIONS.filter(d =>
    [1, 4, 3, 6, 7, 5, 23, 28, 12, 32, 26, 48].includes(d.id)
  )

  // Duplicate for seamless infinite loop
  const loopPhotos = [...photoDestinations, ...photoDestinations]

  return (
    <div className="py-6 bg-slate-100 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800/80 overflow-hidden transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-amber-500 font-black text-sm">✨</span>
          <span
            className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700 dark:text-slate-300"
            style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
          >
            {lang === 'kh' ? 'រូបភាពទិដ្ឋភាពទេសចរណ៍ល្បីៗនៅកម្ពុជា' : 'Iconic Cambodian Destinations Reel'}
          </span>
        </div>
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 hidden sm:inline">
          {lang === 'kh' ? '👈 អូស ឬដាក់ Mouse ពីលើដើម្បីផ្អាក 👉' : '👈 Hover or tap to pause 👉'}
        </span>
      </div>

      {/* Marquee Strip with mask gradient on edges */}
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20px,black_calc(100%-20px),transparent)]">
        <div className="animate-marquee hover:[animation-play-state:paused] py-2">
          {loopPhotos.map((dest, i) => (
            <button
              key={`${dest.id}-${i}`}
              type="button"
              onClick={() => onSelectDest(dest)}
              className="group relative w-64 sm:w-72 h-44 rounded-2xl overflow-hidden mx-2.5 shrink-0 text-left shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              {/* Photo */}
              <img
                src={dest.image}
                alt={dest.en}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-85 group-hover:opacity-75 transition-opacity" />

              {/* Top Badge: Province & Rating */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-950/70 backdrop-blur-md text-[11px] font-bold text-amber-300 border border-white/15">
                  📍 {lang === 'kh' ? dest.province_kh : dest.province_en}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/90 text-slate-950 text-[11px] font-black flex items-center gap-1 shadow">
                  ★ {dest.rating}
                </span>
              </div>

              {/* Bottom Info: Title & Category */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5">
                <span className="inline-block px-2 py-0.5 rounded bg-teal/80 text-white text-[10px] font-semibold mb-1">
                  {lang === 'kh' ? dest.cat_kh : dest.cat_en}
                </span>
                <div
                  className="text-white font-extrabold text-sm truncate group-hover:text-amber-300 transition-colors drop-shadow"
                  style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
                >
                  {lang === 'kh' ? dest.kh : dest.en}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}


// ─── Categories Section ───────────────────────────────────────────────────────
function CategoriesSection({
  lang,
  setPage,
  setSearchQuery,
}: {
  lang: Lang
  setPage: (p: Page) => void
  setSearchQuery: (q: string) => void
}) {
  const t = T[lang]
  return (
    <section id="categories-section" className="py-20 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-block text-teal dark:text-teal-400 font-bold text-xs uppercase tracking-wider mb-2">
            Categories & Travel Styles
          </div>
          <h2
            className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3"
            style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif', lineHeight: lang === 'kh' ? 1.7 : 1.2 }}
          >
            {t.cat_title}
          </h2>
          <p
            className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed"
            style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif', lineHeight: lang === 'kh' ? 1.9 : 1.6 }}
          >
            {t.cat_sub}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              onClick={() => {
                setSearchQuery(c.en)
                setPage('search')
              }}
              className="group bg-slate-50 dark:bg-slate-900 hover:bg-teal dark:hover:bg-teal rounded-2xl p-5 text-center border border-slate-200/80 dark:border-slate-800 hover:border-teal hover:shadow-xl hover:shadow-teal/20 transition-all duration-300 flex flex-col items-center justify-between cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 group-hover:bg-white/20 flex items-center justify-center text-3xl mb-3 shadow-sm group-hover:scale-110 transition-transform">
                {c.icon}
              </div>
              <div
                className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-white text-xs sm:text-sm mb-1 line-clamp-1 transition-colors"
                style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
              >
                {lang === 'kh' ? c.kh : c.en}
              </div>
              <div
                className="text-[11px] text-slate-400 dark:text-slate-500 group-hover:text-teal-100 font-medium transition-colors"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {c.count} {lang === 'kh' ? 'កន្លែង' : 'places'}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Destination Card Component ───────────────────────────────────────────────
function DestinationCard({
  dest,
  lang,
  onSelect,
  onFav,
  isFav,
}: {
  dest: Destination
  lang: Lang
  onSelect: () => void
  onFav: () => void
  isFav: boolean
}) {
  const t = T[lang]
  return (
    <div
      onClick={onSelect}
      className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl border border-slate-100 dark:border-slate-800 hover:border-teal/30 dark:hover:border-teal/50 cursor-pointer transition-all duration-300 flex flex-col"
    >
      {/* Thumbnail with zoom effect */}
      <div className="relative h-56 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <img
          src={dest.image}
          alt={dest.en}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Favorite button */}
        <div className="absolute top-3 right-3 z-10">
          <HeartButton active={isFav} onChange={onFav} />
        </div>

        {/* Category tag */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className="inline-flex items-center gap-1 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md text-teal-900 dark:text-teal-300 text-xs font-bold px-3 py-1 rounded-full shadow-md border border-white/20 dark:border-slate-700/50"
            style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
          >
            {lang === 'kh' ? dest.cat_kh : dest.cat_en}
          </span>
        </div>

        {/* Popular Badge if exists */}
        {dest.isPopular && (
          <div className="absolute bottom-3 left-3 z-10">
            <span
              className="inline-flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md"
              style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
            >
              {lang === 'kh' ? dest.popularBadge_kh || 'ពេញនិយម ⭐' : dest.popularBadge_en || 'Popular ⭐'}
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3
            className="font-black text-slate-900 dark:text-white group-hover:text-teal dark:group-hover:text-teal-400 text-base sm:text-lg mb-1.5 transition-colors line-clamp-1"
            style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
          >
            {lang === 'kh' ? dest.kh : dest.en}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-2.5 font-medium">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}>
              {lang === 'kh' ? dest.province_kh : dest.province_en}
            </span>
          </div>

          {/* Description snippet */}
          <p
            className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 leading-relaxed font-normal"
            style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif', lineHeight: lang === 'kh' ? 1.9 : 1.6 }}
          >
            {lang === 'kh' ? dest.desc_kh : dest.desc_en}
          </p>
        </div>

        <div>
          {/* Rating & Reviews */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <StarRating rating={dest.rating} size={15} />
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-200" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {dest.rating}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500" style={{ fontFamily: 'Poppins, sans-serif' }}>
                ({dest.reviews.toLocaleString()} {lang === 'kh' ? 'មតិ' : 'reviews'})
              </span>
            </div>

            <button
              onClick={e => {
                e.stopPropagation()
                onSelect()
              }}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-teal group-hover:text-white text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all group-hover:scale-110 shadow-sm shrink-0 ml-2 cursor-pointer"
              title={t.view_details}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Popular Destinations Section (with Filter Tabs) ─────────────────────────
function PopularDestinations({
  lang,
  setPage,
  setSelectedDest,
  favs,
  toggleFav,
}: {
  lang: Lang
  setPage: (p: Page) => void
  setSelectedDest: (d: Destination) => void
  favs: Set<number>
  toggleFav: (id: number) => void
}) {
  const t = T[lang]
  const [activeTab, setActiveTab] = useState('all')
  const [expanded, setExpanded] = useState(false)

  const tabs = [
    { id: 'all', kh: 'ទាំងអស់', en: 'All' },
    { id: 'popular', kh: 'ពេញនិយមបំផុត ⭐', en: 'Top Highlights ⭐' },
    { id: 'temple', kh: 'ប្រាសាទបុរាណ 🏛️', en: 'Temples 🏛️' },
    { id: 'nature', kh: 'ធម្មជាតិ & ទឹកធ្លាក់ 💧', en: 'Nature & Falls 💧' },
    { id: 'beach', kh: 'ឆ្នេរ & កោះ 🏝️', en: 'Beaches & Islands 🏝️' },
    { id: 'culture', kh: 'វប្បធម៌ & បទពិសោធន៍ 🎭', en: 'Culture & Heritage 🎭' },
  ]

  const filteredDests = DESTINATIONS.filter(d => {
    if (activeTab === 'all') return true
    if (activeTab === 'popular') return d.isPopular || d.rating >= 4.7
    if (activeTab === 'temple') return d.cat_en.toLowerCase().includes('temple')
    if (activeTab === 'nature') return d.cat_en.toLowerCase().includes('waterfall') || d.cat_en.toLowerCase().includes('nature')
    if (activeTab === 'beach') return d.cat_en.toLowerCase().includes('beach') || d.cat_en.toLowerCase().includes('island')
    if (activeTab === 'culture') return d.cat_en.toLowerCase().includes('culture') || d.cat_en.toLowerCase().includes('eco')
    return true
  })

  const visibleDests = expanded ? filteredDests : filteredDests.slice(0, 8)

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-block text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
              Featured Attractions
            </div>
            <h2
              className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2"
              style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
            >
              {t.pop_title}
            </h2>
            <p
              className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-xl"
              style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif', lineHeight: lang === 'kh' ? 1.8 : 1.5 }}
            >
              {t.pop_sub}
            </p>
          </div>

          <button
            onClick={() => setPage('search')}
            className="shrink-0 text-teal dark:text-teal-400 hover:text-teal-dark font-bold text-sm inline-flex items-center gap-1 group cursor-pointer"
            style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
          >
            <span>{t.view_all}</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                setExpanded(false)
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-teal text-white shadow-md shadow-teal/20'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-teal/40 hover:text-teal dark:hover:text-teal-400'
              }`}
              style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
            >
              {lang === 'kh' ? tab.kh : tab.en}
            </button>
          ))}
        </div>

        {/* Grid of Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {visibleDests.map(dest => (
            <DestinationCard
              key={dest.id}
              dest={dest}
              lang={lang}
              onSelect={() => {
                setSelectedDest(dest)
                setPage('destination')
              }}
              onFav={() => toggleFav(dest.id)}
              isFav={favs.has(dest.id)}
            />
          ))}
        </div>

        {/* Show More toggle if more destinations available */}
        {filteredDests.length > 8 && (
          <div className="text-center mt-12">
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-2 border-teal text-teal dark:text-teal-400 hover:text-teal-dark rounded-xl font-bold text-sm shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
              style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
            >
              <span>{expanded ? t.show_less : `${t.show_more} (${filteredDests.length - 8})`}</span>
              <span>{expanded ? '↑' : '↓'}</span>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

// ─── Province Explorer Section (with All 25 Provinces & Region Tabs) ──────────
function ProvinceExplorer({
  lang,
  setPage,
  setSelectedProvince,
}: {
  lang: Lang
  setPage: (p: Page) => void
  setSelectedProvince: (p: Province) => void
}) {
  const t = T[lang]
  const [selectedRegion, setSelectedRegion] = useState('all')

  const filteredProvinces =
    selectedRegion === 'all'
      ? PROVINCES
      : PROVINCES.filter(p => {
          if (selectedRegion === 'capital_central') return p.region_en.includes('Capital')
          if (selectedRegion === 'northwest') return p.region_en.includes('Northwest')
          if (selectedRegion === 'coastal') return p.region_en.includes('Coastal')
          if (selectedRegion === 'northeast') return p.region_en.includes('Northeast')
          if (selectedRegion === 'plains_south') return p.region_en.includes('Plains')
          return true
        })

  return (
    <section id="province-section" className="py-20 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mb-10">
          <div className="inline-block text-teal dark:text-teal-400 font-bold text-xs uppercase tracking-wider mb-2">
            Cambodia's 25 Provinces & Capital
          </div>
          <h2
            className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2"
            style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
          >
            {t.prov_title}
          </h2>
          <p
            className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed"
            style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif', lineHeight: lang === 'kh' ? 1.8 : 1.5 }}
          >
            {t.prov_sub}
          </p>
        </div>

        {/* Region Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8 overflow-x-auto pb-2">
          {REGIONS.map(r => (
            <button
              key={r.id}
              onClick={() => setSelectedRegion(r.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedRegion === r.id
                  ? 'bg-teal text-white shadow-md shadow-teal/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
            >
              {lang === 'kh' ? r.kh : r.en}
            </button>
          ))}
        </div>

        {/* Province Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProvinces.map((prov, i) => (
            <button
              key={i}
              onClick={() => {
                setSelectedProvince(prov)
                setPage('province')
              }}
              className="group relative rounded-2xl overflow-hidden h-60 bg-slate-900 text-left shadow-sm hover:shadow-2xl border border-slate-100 dark:border-slate-800 transition-all duration-300 flex flex-col justify-end p-5 cursor-pointer"
            >
              <img
                src={prov.image}
                alt={prov.en}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

              <div className="relative z-10 w-full">
                <span className="text-xs uppercase font-bold tracking-wider text-amber-400 block mb-1">
                  {lang === 'kh' ? prov.region_kh : prov.region_en}
                </span>
                <h3
                  className="text-white font-black text-lg sm:text-xl leading-tight group-hover:text-amber-300 transition-colors"
                  style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
                >
                  {lang === 'kh' ? prov.kh : prov.en}
                </h3>
                <p className="text-slate-200 text-sm mt-1 font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {prov.count} {lang === 'kh' ? 'តំបន់ទេសចរណ៍' : 'destinations'}
                </p>

                {/* Top spots preview chips */}
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {(lang === 'kh' ? prov.topSpots_kh : prov.topSpots_en).slice(0, 2).map((spot, idx) => (
                    <span
                      key={idx}
                      className="bg-white/25 backdrop-blur-sm text-white text-xs px-2.5 py-0.5 rounded-lg truncate max-w-[150px] font-medium"
                      style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
                    >
                      {spot}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Interactive Map & Discovery Banner ───────────────────────────────────────
function FeaturedBanner({
  lang,
  setPage,
  setSearchQuery,
}: {
  lang: Lang
  setPage: (p: Page) => void
  setSearchQuery: (q: string) => void
}) {
  return (
    <section id="map-banner" className="py-16 bg-slate-50 dark:bg-slate-900/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-teal-900 via-teal to-teal-dark p-8 md:p-14 text-white shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1599283787923-51b965a58b05?w=1400&h=500&fit=crop&auto=format"
            alt="Angkor silhouette"
            className="absolute inset-0 w-full h-full object-cover opacity-15 mix-blend-overlay"
          />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold px-3 py-1 rounded-full mb-4">
              <span>🗺️ Kingdom of Wonder Interactive Map</span>
            </div>
            <h2
              className="text-2xl sm:text-4xl font-extrabold mb-3 leading-tight"
              style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
            >
              {lang === 'kh'
                ? 'ស្វែងរកគោលដៅទេសចរណ៍ទូទាំងប្រទេសកម្ពុជា'
                : 'Plan Your Perfect Journey Across Cambodia'}
            </h2>
            <p
              className="text-white/80 text-sm sm:text-base leading-relaxed mb-6"
              style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif', lineHeight: lang === 'kh' ? 1.9 : 1.6 }}
            >
              {lang === 'kh'
                ? 'ស្វែងរកព័ត៌មានលម្អិតអំពីតម្លៃសំបុត្រ ម៉ោងបើក ពេលវេលាល្អបំផុត និងផ្លូវធ្វើដំណើរទៅកាន់រមណីយដ្ឋានទាំង ៤៦ កន្លែង។'
                : 'Get complete guides on ticket prices, opening hours, local customs, and travel directions for 46 premier destinations.'}
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setSearchQuery('')
                  setPage('search')
                }}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 text-sm"
                style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
              >
                {lang === 'kh' ? 'រុករកតំបន់ទាំងអស់' : 'Explore All Destinations'}
              </button>
              <button
                onClick={() => {
                  document.getElementById('province-section')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold rounded-xl backdrop-blur-sm transition-all text-sm"
                style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
              >
                {lang === 'kh' ? 'មើលតាមបណ្តាខេត្ត' : 'Browse by Province'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Search & Filter Page ─────────────────────────────────────────────────────
function SearchPage({
  lang,
  query,
  setPage,
  setSelectedDest,
  favs,
  toggleFav,
}: {
  lang: Lang
  query: string
  setPage: (p: Page) => void
  setSelectedDest: (d: Destination) => void
  favs: Set<number>
  toggleFav: (id: number) => void
}) {
  const t = T[lang]
  const [search, setSearch] = useState(query)
  const [selProvinces, setSelProvinces] = useState<string[]>([])
  const [selCats, setSelCats] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)
  const [sortIdx, setSortIdx] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [provSearch, setProvSearch] = useState('')

  useEffect(() => {
    setSearch(query)
  }, [query])

  const filtered = DESTINATIONS.filter(d => {
    const q = search.toLowerCase().trim()
    const matchQ =
      !q ||
      d.en.toLowerCase().includes(q) ||
      d.kh.includes(q) ||
      d.province_en.toLowerCase().includes(q) ||
      d.province_kh.includes(q) ||
      d.cat_en.toLowerCase().includes(q) ||
      d.cat_kh.includes(q)
    const matchP = selProvinces.length === 0 || selProvinces.includes(d.province_en)
    const matchC = selCats.length === 0 || selCats.includes(d.cat_en)
    const matchR = d.rating >= minRating
    return matchQ && matchP && matchC && matchR
  }).sort((a, b) => {
    if (sortIdx === 0) return b.reviews - a.reviews
    if (sortIdx === 1) return (lang === 'kh' ? a.kh : a.en).localeCompare(lang === 'kh' ? b.kh : b.en)
    if (sortIdx === 2) return b.rating - a.rating
    return b.id - a.id
  })

  const toggleProv = (p: string) =>
    setSelProvinces(prev => (prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]))
  const toggleCat = (c: string) =>
    setSelCats(prev => (prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]))

  const displayedProvinces = PROVINCES.filter(p =>
    provSearch ? p.en.toLowerCase().includes(provSearch.toLowerCase()) || p.kh.includes(provSearch) : true
  )

  const SidebarContent = () => (
    <div className="space-y-6">
      {/* Province filter with search */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3
            className="font-bold text-slate-900 dark:text-white text-sm"
            style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
          >
            {t.filter_prov}
          </h3>
          {selProvinces.length > 0 && (
            <span className="text-xs bg-teal text-white font-bold px-2 py-0.5 rounded-full">
              {selProvinces.length}
            </span>
          )}
        </div>

        <input
          value={provSearch}
          onChange={e => setProvSearch(e.target.value)}
          placeholder={lang === 'kh' ? 'ស្វែងរកខេត្ត...' : 'Filter provinces...'}
          className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg mb-2 outline-none focus:border-teal placeholder-slate-400"
        />

        <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
          {displayedProvinces.map(p => (
            <label
              key={p.en}
              className="flex items-center gap-2 cursor-pointer group py-1 px-1 rounded hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <input
                type="checkbox"
                checked={selProvinces.includes(p.en)}
                onChange={() => toggleProv(p.en)}
                className="w-4 h-4 accent-teal rounded cursor-pointer"
              />
              <span
                className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 group-hover:text-teal dark:group-hover:text-teal-400 font-medium"
                style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
              >
                {lang === 'kh' ? p.kh : p.en}
              </span>
              <span className="ml-auto text-[11px] text-slate-400 dark:text-slate-500" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {p.count}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <h3
          className="font-bold text-slate-900 dark:text-white text-sm mb-3"
          style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
        >
          {t.filter_cat}
        </h3>
        <div className="space-y-1.5">
          {CATEGORIES.map(c => (
            <label
              key={c.en}
              className="flex items-center gap-2 cursor-pointer group py-1 px-1 rounded hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <input
                type="checkbox"
                checked={selCats.includes(c.en)}
                onChange={() => toggleCat(c.en)}
                className="w-4 h-4 accent-teal rounded cursor-pointer"
              />
              <span
                className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 group-hover:text-teal dark:group-hover:text-teal-400 font-medium"
                style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
              >
                {c.icon} {lang === 'kh' ? c.kh : c.en}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating filter */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <h3
          className="font-bold text-slate-900 dark:text-white text-sm mb-3"
          style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
        >
          {t.filter_rating}
        </h3>
        <div className="space-y-2">
          {[0, 4.0, 4.5, 4.8].map(r => (
            <label key={r} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={minRating === r}
                onChange={() => setMinRating(r)}
                className="accent-teal cursor-pointer"
              />
              <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {r === 0 ? (lang === 'kh' ? 'ទាំងអស់' : 'All Ratings') : `${r}+ ⭐`}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters Button */}
      <button
        onClick={() => {
          setSelProvinces([])
          setSelCats([])
          setMinRating(0)
          setSearch('')
        }}
        className="w-full py-2.5 border border-slate-200 dark:border-slate-700 hover:border-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl text-xs font-bold transition-all cursor-pointer"
        style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
      >
        {t.clear}
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 transition-colors">
      {/* Search Header Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-16 z-30 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex gap-3 items-center">
            <div className="flex-1 flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-2.5 border border-slate-200 dark:border-slate-700 focus-within:border-teal focus-within:bg-white dark:focus-within:bg-slate-850 transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t.search_ph}
                className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white outline-none placeholder-slate-400"
                style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-4 py-2.5 bg-teal text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
            >
              <span>⚙️ Filters</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 sticky top-40 transition-colors">
              <SidebarContent />
            </div>
          </aside>

          {/* Mobile Sidebar Modal */}
          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
              <div className="relative ml-auto h-full w-80 bg-white dark:bg-slate-900 shadow-2xl p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="font-bold text-base text-slate-900 dark:text-white">Filters</h2>
                  <button onClick={() => setSidebarOpen(false)} className="text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                    ✕
                  </button>
                </div>
                <SidebarContent />
              </div>
            </div>
          )}

          {/* Results Grid */}
          <div className="flex-1 min-w-0">
            {/* Header info & sort */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div
                className="text-slate-600 dark:text-slate-300 font-medium"
                style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
              >
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{filtered.length}</span>{' '}
                <span>{t.found}</span>
              </div>

              {/* Sort pills */}
              <div className="flex flex-wrap gap-1.5">
                {t.sort_labels.map((label, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSortIdx(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      sortIdx === idx
                        ? 'bg-teal text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-teal/40 dark:hover:border-teal/50'
                    }`}
                    style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Results */}
            {filtered.length === 0 ? (
              <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 transition-colors">
                <div className="text-5xl mb-4">🔍</div>
                <h3
                  className="text-lg font-bold text-slate-800 dark:text-white mb-2"
                  style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
                >
                  {lang === 'kh' ? 'រកមិនឃើញតំបន់ទេសចរណ៍' : 'No destinations match your filters'}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  {lang === 'kh'
                    ? 'សូមព្យាយាមលុបតម្រង ឬស្វែងរកពាក្យគន្លឹះផ្សេង។'
                    : 'Try clearing your filters or search with a different keyword.'}
                </p>
                <button
                  onClick={() => {
                    setSelProvinces([])
                    setSelCats([])
                    setMinRating(0)
                    setSearch('')
                  }}
                  className="px-6 py-2.5 bg-teal text-white font-bold rounded-xl text-xs shadow-md"
                >
                  {t.clear}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map(dest => (
                  <DestinationCard
                    key={dest.id}
                    dest={dest}
                    lang={lang}
                    onSelect={() => {
                      setSelectedDest(dest)
                      setPage('destination')
                    }}
                    onFav={() => toggleFav(dest.id)}
                    isFav={favs.has(dest.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Destination Detail View (with Curated Category Gallery) ──────────────────
function DestinationDetail({
  dest,
  lang,
  setPage,
  setSelectedDest,
  favs,
  toggleFav,
}: {
  dest: Destination
  lang: Lang
  setPage: (p: Page) => void
  setSelectedDest: (d: Destination) => void
  favs: Set<number>
  toggleFav: (id: number) => void
}) {
  const t = T[lang]
  const [activeImg, setActiveImg] = useState(0)
  const [copied, setCopied] = useState(false)

  // Curated category gallery images
  const galleryImgs = [dest.hero, dest.image]

  const nearbyDests = dest.nearby
    .map(id => DESTINATIONS.find(d => d.id === id))
    .filter(Boolean) as Destination[]

  const infoRows = [
    { icon: '📍', label: t.location, value: lang === 'kh' ? dest.location_kh : dest.location_en },
    { icon: '🕐', label: t.hours, value: dest.hours },
    { icon: '🎫', label: t.ticket, value: dest.ticket },
    { icon: '🌤️', label: t.best_time, value: lang === 'kh' ? dest.best_time_kh : dest.best_time_en },
    { icon: '⏱️', label: t.time_spent, value: dest.time_spent },
    { icon: '🚗', label: t.distance, value: dest.distance },
  ]

  const reviews = [
    {
      name: 'Chanthy Vuth',
      rating: 5,
      date: '2026-08-15',
      text:
        lang === 'kh'
          ? 'កន្លែងនេះពិតជាអស្ចារ្យខ្លាំងណាស់! ទេសភាពស្អាត បរិយាកាសបរិសុទ្ធ និងគួរឱ្យចង់ចាំមិនអាចបំភ្លេចបាន។'
          : 'Absolutely incredible experience! Beautiful scenery, pristine atmosphere, and highly recommended for sunrise.',
      avatar: 'C',
    },
    {
      name: 'Alexander Wright',
      rating: 5,
      date: '2026-07-20',
      text: 'One of the true highlights of Cambodia! Make sure to hire a licensed local guide to understand the deep history.',
      avatar: 'A',
    },
    {
      name: 'Sokha Meng',
      rating: 4,
      date: '2026-06-12',
      text:
        lang === 'kh'
          ? 'រមណីយដ្ឋានល្អខ្លាំងណាស់ ស័ក្តិសមសម្រាប់គ្រួសារ និងការថតរូបអនុស្សាវរីយ៍។ គួរទៅទស្សនាពេលព្រឹកព្រលឹម។'
          : 'Great resort suitable for families and photography. Best visited in the early morning to avoid crowds.',
      avatar: 'S',
    },
  ]

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    dest.en + ' ' + dest.province_en + ' Cambodia'
  )}`

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 transition-colors">
      {/* Toast Notification */}
      {copied && (
        <div className="fixed bottom-6 right-6 z-50 bg-teal text-white px-5 py-3 rounded-2xl shadow-2xl font-bold text-sm animate-in fade-in slide-in-from-bottom-4">
          ✓ {t.share_copied}
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <button onClick={() => setPage('home')} className="hover:text-teal dark:hover:text-teal-400 transition-colors cursor-pointer">
            {lang === 'kh' ? 'ទំព័រដើម' : 'Home'}
          </button>
          <span>/</span>
          <button onClick={() => setPage('search')} className="hover:text-teal dark:hover:text-teal-400 transition-colors cursor-pointer">
            {lang === 'kh' ? 'តំបន់ទេសចរណ៍' : 'Destinations'}
          </button>
          <span>/</span>
          <span
            className="text-slate-900 dark:text-white font-bold truncate max-w-xs"
            style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
          >
            {lang === 'kh' ? dest.kh : dest.en}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Main Hero Photo Gallery */}
        <div className="rounded-3xl overflow-hidden shadow-xl bg-slate-900 mb-8 border border-slate-200 dark:border-slate-800">
          <div className="relative h-72 sm:h-96 md:h-[480px] w-full">
            <img
              src={galleryImgs[activeImg] || dest.hero}
              alt={dest.en}
              className="w-full h-full object-cover object-center transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

            {/* Floating Details on Hero */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                    {lang === 'kh' ? dest.cat_kh : dest.cat_en}
                  </span>
                  <span className="bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">
                    📍 {lang === 'kh' ? dest.province_kh : dest.province_en}
                  </span>
                </div>
                <h1
                  className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
                  style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
                >
                  {lang === 'kh' ? dest.kh : dest.en}
                </h1>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3">
                <HeartButton active={favs.has(dest.id)} onChange={() => toggleFav(dest.id)} />
                <button
                  onClick={handleShare}
                  className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow cursor-pointer"
                >
                  <span>🔗 {lang === 'kh' ? 'ចែករំលែក' : 'Share'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (Content & Description) */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Box */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
              <h2
                className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mb-4"
                style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
              >
                {t.about_title}
              </h2>
              <p
                className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base font-normal"
                style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif', lineHeight: lang === 'kh' ? 2 : 1.7 }}
              >
                {lang === 'kh' ? dest.desc_kh : dest.desc_en}
              </p>
            </div>

            {/* Facilities Box */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
              <h2
                className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mb-4"
                style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
              >
                {t.facilities}
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {dest.facilities.map((fac, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 bg-teal/10 dark:bg-teal-950/50 text-teal-900 dark:text-teal-300 text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl border border-teal/20 dark:border-teal-800/50"
                    style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
                  >
                    {fac}
                  </span>
                ))}
              </div>
            </div>

            {/* Google Maps Actions */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2
                    className="text-lg font-extrabold text-slate-900 dark:text-white mb-1"
                    style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
                  >
                    {lang === 'kh' ? 'ទីតាំងលើផែនទី និងទិសដៅធ្វើដំណើរ' : 'Location & Navigation'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {lang === 'kh' ? dest.location_kh : dest.location_en}
                  </p>
                </div>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal to-teal-dark hover:from-teal-dark hover:to-teal text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95 shrink-0"
                >
                  <span>🗺️ {t.open_maps}</span>
                </a>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2
                    className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white"
                    style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
                  >
                    {lang === 'kh' ? 'មតិវាយតម្លៃពីភ្ញៀវទេសចរ' : 'Traveler Reviews'}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={dest.rating} size={16} />
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {dest.rating}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      ({dest.reviews.toLocaleString()} {t.reviews})
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {reviews.map((r, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-teal text-white font-extrabold flex items-center justify-center text-sm shrink-0">
                      {r.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{r.name}</span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">{r.date}</span>
                      </div>
                      <StarRating rating={r.rating} size={12} />
                      <p
                        className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-2 leading-relaxed"
                        style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif', lineHeight: lang === 'kh' ? 1.8 : 1.5 }}
                      >
                        {r.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (Key Info & Nearby) */}
          <div className="space-y-6">
            {/* Key Info Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
              <h2
                className="text-base font-extrabold text-slate-900 dark:text-white mb-5"
                style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
              >
                {t.info_title}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-3.5">
                {infoRows.map((row, i) => (
                  <div key={i} className="flex gap-3 items-start p-2.5 sm:p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-xl shrink-0 mt-0.5">{row.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div
                        className="text-xs text-slate-400 dark:text-slate-400 font-semibold"
                        style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
                      >
                        {row.label}
                      </div>
                      <div
                        className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5"
                        style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
                      >
                        {row.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nearby Recommendations */}
            {nearbyDests.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
                <h2
                  className="text-base font-extrabold text-slate-900 dark:text-white mb-4"
                  style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
                >
                  {t.nearby}
                </h2>
                <div className="space-y-3">
                  {nearbyDests.map(nd => (
                    <button
                      key={nd.id}
                      onClick={() => setSelectedDest(nd)}
                      className="w-full flex gap-3 items-center hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl p-2.5 transition-colors group text-left border border-transparent hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                        <img src={nd.image} alt={nd.en} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="min-w-0">
                        <h4
                          className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm group-hover:text-teal dark:group-hover:text-teal-400 truncate transition-colors"
                          style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
                        >
                          {lang === 'kh' ? nd.kh : nd.en}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {lang === 'kh' ? nd.province_kh : nd.province_en} · ⭐ {nd.rating}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Province Detail Page ─────────────────────────────────────────────────────
function ProvinceDetail({
  province,
  lang,
  setPage,
  setSelectedDest,
  favs,
  toggleFav,
}: {
  province: Province
  lang: Lang
  setPage: (p: Page) => void
  setSelectedDest: (d: Destination) => void
  favs: Set<number>
  toggleFav: (id: number) => void
}) {
  const t = T[lang]
  const provDests = DESTINATIONS.filter(d => d.province_en === province.en)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 transition-colors">
      {/* Province Hero Banner */}
      <div className="relative h-80 sm:h-96 bg-slate-900">
        <img
          src={province.image}
          alt={province.en}
          className="w-full h-full object-cover object-center opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-end pb-10">
          <div>
            <button
              onClick={() => setPage('home')}
              className="mb-4 inline-flex items-center gap-2 text-white/80 hover:text-white text-xs sm:text-sm font-bold transition-colors bg-white/10 backdrop-blur-sm px-3.5 py-1.5 rounded-full cursor-pointer"
            >
              ← {lang === 'kh' ? 'ត្រឡប់ទៅទំព័រដើម' : 'Back to Home'}
            </button>
            <span className="text-amber-400 font-bold text-xs uppercase tracking-wider block mb-1">
              {lang === 'kh' ? province.region_kh : province.region_en}
            </span>
            <h1
              className="text-3xl sm:text-5xl font-extrabold text-white"
              style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
            >
              {lang === 'kh' ? province.kh : province.en}
            </h1>
            <p
              className="text-white/80 mt-2 text-sm sm:text-base max-w-2xl leading-relaxed"
              style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif', lineHeight: lang === 'kh' ? 1.8 : 1.5 }}
            >
              {lang === 'kh' ? province.desc_kh : province.desc_en}
            </p>
          </div>
        </div>
      </div>

      {/* Destinations inside this Province */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2
              className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white"
              style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
            >
              {lang === 'kh' ? `តំបន់ទេសចរណ៍នៅខេត្ត${province.kh}` : `Destinations in ${province.en}`}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
              {provDests.length} {lang === 'kh' ? 'កន្លែងត្រូវបានរាយការណ៍' : 'destinations documented'}
            </p>
          </div>
        </div>

        {provDests.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 transition-colors">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {lang === 'kh'
                ? 'តំបន់ទេសចរណ៍បន្ថែមសម្រាប់ខេត្តនេះកំពុងត្រូវបានបញ្ចូល។'
                : 'More destinations for this province are being curated.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {provDests.map(dest => (
              <DestinationCard
                key={dest.id}
                dest={dest}
                lang={lang}
                onSelect={() => {
                  setSelectedDest(dest)
                  setPage('destination')
                }}
                onFav={() => toggleFav(dest.id)}
                isFav={favs.has(dest.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Saved Destinations Modal Drawer ──────────────────────────────────────────
function SavedDrawer({
  open,
  onClose,
  favs,
  lang,
  onSelectDest,
  toggleFav,
}: {
  open: boolean
  onClose: () => void
  favs: Set<number>
  lang: Lang
  onSelectDest: (d: Destination) => void
  toggleFav: (id: number) => void
}) {
  const t = T[lang]
  if (!open) return null

  const savedList = DESTINATIONS.filter(d => favs.has(d.id))

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl p-6 overflow-y-auto z-10 flex flex-col transition-colors">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">❤️</span>
            <h2
              className="text-lg font-extrabold text-slate-900 dark:text-white"
              style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
            >
              {t.saved_title} ({savedList.length})
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-800 dark:hover:text-white text-lg font-bold cursor-pointer">
            ✕
          </button>
        </div>

        {savedList.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="text-5xl mb-4">🤍</div>
            <p
              className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed"
              style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
            >
              {t.saved_empty}
            </p>
          </div>
        ) : (
          <div className="space-y-3 flex-1 overflow-y-auto">
            {savedList.map(dest => (
              <div
                key={dest.id}
                onClick={() => {
                  onSelectDest(dest)
                  onClose()
                }}
                className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-teal/30 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-all group bg-white dark:bg-slate-900"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                  <img src={dest.image} alt={dest.en} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4
                    className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-teal dark:group-hover:text-teal-400 truncate"
                    style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
                  >
                    {lang === 'kh' ? dest.kh : dest.en}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {lang === 'kh' ? dest.province_kh : dest.province_en} · ⭐ {dest.rating}
                  </p>
                </div>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    toggleFav(dest.id)
                  }}
                  className="text-slate-400 hover:text-rose-500 p-2 cursor-pointer"
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({
  lang,
  onOpenPartner,
  onOpenAdmin,
}: {
  lang: Lang
  onOpenPartner?: () => void
  onOpenAdmin?: () => void
}) {
  const t = T[lang]
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Official CamTourism Logo & Brand */}
          <div className="md:col-span-2">
            <CamTourismLogo variant="footer" isDark={true} className="mb-4" />
            <p
              className="text-slate-400 text-sm leading-relaxed max-w-sm mt-3"
              style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif', lineHeight: lang === 'kh' ? 2 : 1.7 }}
            >
              {t.footer_desc}
            </p>

            {/* Social media channels */}
            <div className="mt-6">
              <span className="text-xs text-slate-500 font-semibold block mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {t.follow}:
              </span>
              <div className="flex items-center gap-2.5">
                {['Facebook', 'Instagram', 'YouTube', 'TikTok'].map(s => (
                  <button
                    key={s}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-teal transition-all text-xs font-semibold text-slate-300 hover:text-white"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Nav links columns */}
          {t.footer_cols.map((col, i) => (
            <div key={i}>
              <h4
                className="text-sm font-bold mb-4 text-amber-400 tracking-wide"
                style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
              >
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <button
                      className="text-sm text-slate-400 hover:text-teal-300 transition-colors"
                      style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
                    >
                      {link}
                    </button>
                  </li>
                ))}
                {/* Special Partner Link in second column */}
                {i === 1 && onOpenPartner && (
                  <li>
                    <button
                      onClick={onOpenPartner}
                      className="text-sm text-amber-400 hover:text-amber-300 font-bold transition-colors flex items-center gap-1.5 text-left"
                      style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
                    >
                      <span>📢</span>
                      <span>{lang === 'kh' ? 'សហការផ្សព្វផ្សាយរមណីយដ្ឋាន' : 'List Your Resort (Partner)'}</span>
                    </button>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 text-center sm:text-left" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {t.copyright}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
            {onOpenPartner && (
              <button
                onClick={onOpenPartner}
                className="hover:text-amber-400 transition-colors cursor-pointer text-xs"
                style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
              >
                📢 {lang === 'kh' ? 'សហការផ្សព្វផ្សាយ' : 'Partner with Us'}
              </button>
            )}
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-400 hover:text-amber-300 border border-white/10 transition-all text-xs cursor-pointer"
                title="Admin Console"
              >
                <span>🔐</span>
                <span>Admin Console</span>
              </button>
            )}
            <div className="flex items-center gap-2">
              <span>Made with</span>
              <span className="text-rose-500">❤️</span>
              <span>for Kingdom of Cambodia</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── Main App Component ───────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState<Lang>('kh')
  const [page, setPage] = useState<Page>('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null)
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null)
  const [favs, setFavs] = useState<Set<number>>(new Set())
  const [savedDrawerOpen, setSavedDrawerOpen] = useState(false)
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false)
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false)

  // Dark Mode State with localStorage persistence & system preference fallback
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cam_dark_mode')
      if (saved !== null) return saved === 'true'
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('cam_dark_mode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('cam_dark_mode', 'false')
    }
  }, [darkMode])

  const toggleFav = (id: number) => {
    setFavs(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page, selectedDest, selectedProvince])

  const handleSetPage = (p: Page) => {
    setPage(p)
    if (p === 'home') {
      setSelectedDest(null)
      setSelectedProvince(null)
    }
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 antialiased selection:bg-teal selection:text-white ${
        darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
      style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, Poppins, sans-serif' : 'Poppins, Noto Sans Khmer, sans-serif' }}
    >
      {/* Navigation Bar */}
      <Navbar
        lang={lang}
        setLang={setLang}
        setPage={handleSetPage}
        setSearchQuery={setSearchQuery}
        favCount={favs.size}
        onOpenSaved={() => setSavedDrawerOpen(true)}
        onOpenPartner={() => setIsPartnerModalOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Saved Drawer Modal */}
      <SavedDrawer
        open={savedDrawerOpen}
        onClose={() => setSavedDrawerOpen(false)}
        favs={favs}
        lang={lang}
        onSelectDest={d => {
          setSelectedDest(d)
          handleSetPage('destination')
        }}
        toggleFav={toggleFav}
      />

      {/* Pages Routing */}
      {page === 'home' && (
        <main>
          <Hero lang={lang} setPage={handleSetPage} setSearchQuery={setSearchQuery} setSelectedDest={setSelectedDest} />
          {/* Running Text Ticker (អក្សររត់ ព័ត៌មានពិសេសទេសចរណ៍កម្ពុជា) */}
          <CambodiaHighlightsTicker lang={lang} />
          {/* Running Photo Reel (រូបភាពរត់ ទិដ្ឋភាពទេសចរណ៍ល្បីៗនៅកម្ពុជា) */}
          <RunningPhotoMarquee
            lang={lang}
            onSelectDest={d => {
              setSelectedDest(d)
              handleSetPage('destination')
            }}
          />
          <CategoriesSection lang={lang} setPage={handleSetPage} setSearchQuery={setSearchQuery} />
          <PopularDestinations
            lang={lang}
            setPage={handleSetPage}
            setSelectedDest={setSelectedDest}
            favs={favs}
            toggleFav={toggleFav}
          />
          <FeaturedBanner lang={lang} setPage={handleSetPage} setSearchQuery={setSearchQuery} />
          <ProvinceExplorer
            lang={lang}
            setPage={handleSetPage}
            setSelectedProvince={setSelectedProvince}
          />
          {/* Partner & Resort Promotion Banner */}
          <PartnerBanner onOpenPartner={() => setIsPartnerModalOpen(true)} lang={lang} />
          <Footer
            lang={lang}
            onOpenPartner={() => setIsPartnerModalOpen(true)}
            onOpenAdmin={() => setIsAdminModalOpen(true)}
          />
        </main>
      )}

      {page === 'search' && (
        <main>
          <SearchPage
            lang={lang}
            query={searchQuery}
            setPage={handleSetPage}
            setSelectedDest={dest => {
              setSelectedDest(dest)
              handleSetPage('destination')
            }}
            favs={favs}
            toggleFav={toggleFav}
          />
          <Footer
            lang={lang}
            onOpenPartner={() => setIsPartnerModalOpen(true)}
            onOpenAdmin={() => setIsAdminModalOpen(true)}
          />
        </main>
      )}

      {page === 'destination' && selectedDest && (
        <main>
          <DestinationDetail
            dest={selectedDest}
            lang={lang}
            setPage={handleSetPage}
            setSelectedDest={d => setSelectedDest(d)}
            favs={favs}
            toggleFav={toggleFav}
          />
          <Footer
            lang={lang}
            onOpenPartner={() => setIsPartnerModalOpen(true)}
            onOpenAdmin={() => setIsAdminModalOpen(true)}
          />
        </main>
      )}

      {page === 'province' && selectedProvince && (
        <main>
          <ProvinceDetail
            province={selectedProvince}
            lang={lang}
            setPage={handleSetPage}
            setSelectedDest={d => {
              setSelectedDest(d)
              handleSetPage('destination')
            }}
            favs={favs}
            toggleFav={toggleFav}
          />
          <Footer
            lang={lang}
            onOpenPartner={() => setIsPartnerModalOpen(true)}
            onOpenAdmin={() => setIsAdminModalOpen(true)}
          />
        </main>
      )}

      {/* Partner with Us Modal */}
      <PartnerModal
        isOpen={isPartnerModalOpen}
        onClose={() => setIsPartnerModalOpen(false)}
        lang={lang}
      />

      {/* Admin Panel Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        lang={lang}
      />
    </div>
  )
}
