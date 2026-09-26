import React, { useState, useEffect } from 'react'
import { PartnerInquiry } from './PartnerModal'
import { PROVINCES } from '../data/cambodiaData'

interface AdminModalProps {
  isOpen: boolean
  onClose: () => void
  lang: 'kh' | 'en'
}

const SAMPLE_INQUIRIES: PartnerInquiry[] = [
  {
    id: 'INQ-SR-8801',
    resortName: 'រមណីយដ្ឋានធម្មជាតិ ភ្នំគូលែន Retreat',
    ownerName: 'ឡាយ ចាន់ថន',
    province: 'សៀមរាប',
    category: 'resort',
    phone: '012 998 877',
    telegram: 'chanthorn_sr',
    packageType: 'vip',
    facebookOrMapUrl: 'https://maps.app.goo.gl/sample1',
    description: 'ផ្ទះលំហែក្បែរជ្រោះទឹកធ្លាក់ធម្មជាតិ អាហារខ្មែរឆ្ងាញ់ បន្ទប់ស្នាក់នៅបែបឈើ និងសេវាកម្មទស្សនកិច្ចគូលែន។',
    status: 'new',
    submittedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'INQ-KP-8802',
    resortName: 'Kampot Riverfront Glamping & Kayak',
    ownerName: 'សម សុធា',
    province: 'កំពត',
    category: 'eco',
    phone: '098 776 554',
    telegram: 'sothea_kampot',
    packageType: 'featured',
    facebookOrMapUrl: 'https://facebook.com/kampotglamping',
    description: 'តង់ប្រណីតមាត់ព្រែកកំពត ជិះទូកកាយ៉ាក់មើលអំពិលអំពែក ទេសភាពជួរភ្នំបូករ៉ូមែនទិក។',
    status: 'contacted',
    submittedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'INQ-SH-8803',
    resortName: 'Koh Rong Sanloem Blue Lagoon Villa',
    ownerName: 'David & Sokha',
    province: 'ព្រះសីហនុ',
    category: 'hotel',
    phone: '010 334 455',
    telegram: 'bluelagoon_kohrong',
    packageType: 'featured',
    facebookOrMapUrl: 'https://maps.app.goo.gl/sample3',
    description: 'វីឡាជាប់ឆ្នេរខ្សាច់សក្បុស ទឹកថ្លាឈ្វេង ជិះទូកមើលផ្កាថ្ម និងកីឡាទឹក។',
    status: 'approved',
    submittedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
]

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, lang }) => {
  const [inquiries, setInquiries] = useState<PartnerInquiry[]>([])
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'contacted' | 'approved'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedInquiry, setSelectedInquiry] = useState<PartnerInquiry | null>(null)
  const [isAuthorized, setIsAuthorized] = useState(true) // Auto logged in for seamless demo
  const [activeTab, setActiveTab] = useState<'inquiries' | 'quickAdd'>('inquiries')

  // Quick Add Form States
  const [newTitleKh, setNewTitleKh] = useState('')
  const [newTitleEn, setNewTitleEn] = useState('')
  const [newProv, setNewProv] = useState(PROVINCES[0]?.kh || 'ភ្នំពេញ')
  const [newPrice, setNewPrice] = useState('Free / ឥតគិតថ្លៃ')
  const [newHours, setNewHours] = useState('07:00 – 18:00')
  const [newImage, setNewImage] = useState('')
  const [addSuccess, setAddSuccess] = useState(false)

  // Load Inquiries
  useEffect(() => {
    if (!isOpen) return
    try {
      const stored = localStorage.getItem('camtourism_partner_inquiries')
      if (stored) {
        const parsed = JSON.parse(stored)
        // Combine with samples if not duplicated
        const existingIds = new Set(parsed.map((p: any) => p.id))
        const unseeded = SAMPLE_INQUIRIES.filter(s => !existingIds.has(s.id))
        setInquiries([...parsed, ...unseeded])
      } else {
        localStorage.setItem('camtourism_partner_inquiries', JSON.stringify(SAMPLE_INQUIRIES))
        setInquiries(SAMPLE_INQUIRIES)
      }
    } catch {
      setInquiries(SAMPLE_INQUIRIES)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleUpdateStatus = (id: string, newStatus: 'new' | 'contacted' | 'approved') => {
    const updated = inquiries.map(item => (item.id === id ? { ...item, status: newStatus } : item))
    setInquiries(updated)
    try {
      localStorage.setItem('camtourism_partner_inquiries', JSON.stringify(updated))
    } catch {}
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry({ ...selectedInquiry, status: newStatus })
    }
  }

  const handleDelete = (id: string) => {
    if (confirm(lang === 'kh' ? 'តើអ្នកពិតជាចង់លុបសំណើនេះមែនទេ?' : 'Delete this inquiry?')) {
      const updated = inquiries.filter(item => item.id !== id)
      setInquiries(updated)
      try {
        localStorage.setItem('camtourism_partner_inquiries', JSON.stringify(updated))
      } catch {}
      if (selectedInquiry?.id === id) setSelectedInquiry(null)
    }
  }

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitleKh.trim()) return
    setAddSuccess(true)
    setTimeout(() => {
      setAddSuccess(false)
      setNewTitleKh('')
      setNewTitleEn('')
      setNewImage('')
    }, 2500)
  }

  const filteredInquiries = inquiries.filter(item => {
    if (filterStatus !== 'all' && item.status !== filterStatus) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return (
        item.resortName.toLowerCase().includes(q) ||
        item.ownerName.toLowerCase().includes(q) ||
        item.province.toLowerCase().includes(q) ||
        item.phone.toLowerCase().includes(q)
      )
    }
    return true
  })

  const newCount = inquiries.filter(i => i.status === 'new').length
  const contactedCount = inquiries.filter(i => i.status === 'contacted').length
  const approvedCount = inquiries.filter(i => i.status === 'approved').length

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xl">
              🔐
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">
                  {lang === 'kh' ? 'ផ្ទាំងគ្រប់គ្រងរដ្ឋបាល (Admin Panel)' : 'CamTourism Administration Portal'}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {lang === 'kh'
                  ? 'គ្រប់គ្រងសំណើផ្សព្វផ្សាយរមណីយដ្ឋាន និងការអនុម័តទីតាំង'
                  : 'Manage partner inquiries, advertisement packages, and approve listings'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Top Metric Bar & Tabs */}
        <div className="bg-slate-800 text-white px-6 py-3 flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/60 flex-shrink-0 text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                activeTab === 'inquiries' ? 'bg-amber-500 text-slate-950' : 'bg-white/10 text-slate-300 hover:text-white'
              }`}
            >
              📋 {lang === 'kh' ? 'សំណើដៃគូផ្សព្វផ្សាយ' : 'Partner Inquiries'} ({inquiries.length})
            </button>
            <button
              onClick={() => setActiveTab('quickAdd')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                activeTab === 'quickAdd' ? 'bg-amber-500 text-slate-950' : 'bg-white/10 text-slate-300 hover:text-white'
              }`}
            >
              ➕ {lang === 'kh' ? 'បញ្ចូលរមណីយដ្ឋានថ្មី' : 'Quick Add Destination'}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 font-semibold">
              {lang === 'kh' ? `ថ្មី៖ ${newCount}` : `New: ${newCount}`}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 font-semibold">
              {lang === 'kh' ? `បានទាក់ទង៖ ${contactedCount}` : `Contacted: ${contactedCount}`}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-semibold">
              {lang === 'kh' ? `អនុម័ត៖ ${approvedCount}` : `Approved: ${approvedCount}`}
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-100 p-4 sm:p-6">
          {activeTab === 'inquiries' ? (
            <div className="space-y-4">
              {/* Search & Status Filter Filter Bar */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={lang === 'kh' ? 'ស្វែងរកឈ្មោះរមណីយដ្ឋាន ម្ចាស់ ឬលេខទូរស័ព្ទ...' : 'Search by name, owner, phone...'}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                  />
                  <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
                  {(['all', 'new', 'contacted', 'approved'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setFilterStatus(s)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize whitespace-nowrap ${
                        filterStatus === s
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {s === 'all'
                        ? lang === 'kh'
                          ? 'ទាំងអស់'
                          : 'All'
                        : s === 'new'
                        ? lang === 'kh'
                          ? 'ថ្មី (New)'
                          : 'New'
                        : s === 'contacted'
                        ? lang === 'kh'
                          ? 'បានទាក់ទង'
                          : 'Contacted'
                        : lang === 'kh'
                        ? 'បានអនុម័ត'
                        : 'Approved'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inquiries Table / Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* List Column */}
                <div className="lg:col-span-2 space-y-3">
                  {filteredInquiries.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center text-slate-400">
                      <p className="text-3xl mb-2">📭</p>
                      <p className="text-sm font-semibold">
                        {lang === 'kh' ? 'មិនមានសំណើត្រូវនឹងតម្រងនេះទេ' : 'No inquiries found'}
                      </p>
                    </div>
                  ) : (
                    filteredInquiries.map(item => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedInquiry(item)}
                        className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer shadow-sm hover:shadow-md ${
                          selectedInquiry?.id === item.id
                            ? 'border-amber-500 ring-2 ring-amber-500/20'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                                  item.status === 'new'
                                    ? 'bg-rose-100 text-rose-700'
                                    : item.status === 'contacted'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-emerald-100 text-emerald-700'
                                }`}
                              >
                                {item.status}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400">{item.id}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                                💎 {item.packageType.toUpperCase()}
                              </span>
                            </div>
                            <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                              {item.resortName}
                            </h4>
                          </div>

                          <span className="text-[11px] text-slate-400 whitespace-nowrap">
                            {new Date(item.submittedAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                          <div>
                            <span className="text-slate-400 text-[10px] block">អ្នកទាក់ទង:</span>
                            <span className="font-semibold">{item.ownerName}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] block">ខេត្ត:</span>
                            <span className="font-semibold text-teal-700">{item.province}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] block">លេខទូរស័ព្ទ:</span>
                            <span className="font-semibold text-slate-800">{item.phone}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Detail View Column */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm h-fit space-y-4">
                  {selectedInquiry ? (
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                        <h4 className="font-black text-sm text-slate-900">
                          {lang === 'kh' ? 'ព័ត៌មានលម្អិតនៃសំណើ' : 'Inquiry Details'}
                        </h4>
                        <button
                          onClick={() => handleDelete(selectedInquiry.id)}
                          className="text-xs text-rose-500 hover:text-rose-700 font-semibold"
                        >
                          🗑️ {lang === 'kh' ? 'លុប' : 'Delete'}
                        </button>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div>
                          <span className="text-slate-400 text-[11px] block">ឈ្មោះរមណីយដ្ឋាន៖</span>
                          <span className="font-black text-slate-900 text-sm">{selectedInquiry.resortName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[11px] block">ម្ចាស់ / តំណាង៖</span>
                          <span className="font-bold text-slate-800">{selectedInquiry.ownerName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[11px] block">ខេត្ត៖</span>
                          <span className="font-bold text-teal-700">{selectedInquiry.province}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[11px] block">កញ្ចប់សេវា៖</span>
                          <span className="font-black text-amber-600 uppercase">
                            💎 {selectedInquiry.packageType} Listing
                          </span>
                        </div>

                        {selectedInquiry.description && (
                          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <span className="text-slate-400 text-[10px] block mb-1">ចំណុចពិសេស/ការពិពណ៌នា៖</span>
                            <p className="text-slate-700 leading-relaxed">{selectedInquiry.description}</p>
                          </div>
                        )}

                        {selectedInquiry.facebookOrMapUrl && (
                          <div>
                            <span className="text-slate-400 text-[11px] block">Link ផែនទី/Facebook៖</span>
                            <a
                              href={selectedInquiry.facebookOrMapUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-teal font-semibold underline truncate block max-w-full"
                            >
                              {selectedInquiry.facebookOrMapUrl}
                            </a>
                          </div>
                        )}

                        {/* Quick Contact buttons */}
                        <div className="pt-3 border-t border-slate-100 space-y-2">
                          <span className="text-slate-400 text-[10px] block font-bold">ទាក់ទងភ្ញៀវផ្ទាល់៖</span>
                          <div className="grid grid-cols-2 gap-2">
                            <a
                              href={`tel:${selectedInquiry.phone}`}
                              className="py-2 px-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-center border border-emerald-200"
                            >
                              📞 Call Phone
                            </a>
                            <a
                              href={`https://t.me/${selectedInquiry.telegram || selectedInquiry.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="py-2 px-3 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold text-center border border-sky-200"
                            >
                              💬 Telegram
                            </a>
                          </div>
                        </div>

                        {/* Update Status Buttons */}
                        <div className="pt-3 border-t border-slate-100 space-y-2">
                          <span className="text-slate-400 text-[10px] block font-bold">ផ្លាស់ប្តូរស្ថានភាព៖</span>
                          <div className="flex flex-wrap gap-1.5">
                            <button
                              onClick={() => handleUpdateStatus(selectedInquiry.id, 'new')}
                              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                                selectedInquiry.status === 'new'
                                  ? 'bg-rose-500 text-white'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              New
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(selectedInquiry.id, 'contacted')}
                              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                                selectedInquiry.status === 'contacted'
                                  ? 'bg-amber-500 text-white'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              Contacted
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(selectedInquiry.id, 'approved')}
                              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                                selectedInquiry.status === 'approved'
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              Approved ✓
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10 text-slate-400">
                      <p className="text-2xl mb-1">👈</p>
                      <p className="text-xs">
                        {lang === 'kh'
                          ? 'សូមចុចលើសំណើណាមួយ ដើម្បីមើលព័ត៌មានលម្អិត'
                          : 'Select an inquiry to view details and contact'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* QUICK ADD FORM TAB */
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto border border-slate-200 shadow-sm">
              <h4
                className="text-lg font-black text-slate-900 mb-2 flex items-center gap-2"
                style={{ fontFamily: lang === 'kh' ? 'Noto Sans Khmer, sans-serif' : 'Poppins, sans-serif' }}
              >
                <span>✨</span>
                <span>{lang === 'kh' ? 'បញ្ចូលរមណីយដ្ឋានថ្មីទៅក្នុងប្រព័ន្ធ' : 'Direct Add Destination'}</span>
              </h4>
              <p className="text-xs text-slate-500 mb-6">
                {lang === 'kh'
                  ? 'សម្រាប់ Admin បញ្ចូលរមណីយដ្ឋានដែលបានទិញកញ្ចប់រួចរាល់'
                  : 'For administrator to insert newly paid & approved resorts into database'}
              </p>

              {addSuccess && (
                <div className="p-4 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <span>✓</span>
                  <span>
                    {lang === 'kh'
                      ? 'រមណីយដ្ឋានត្រូវបានបញ្ចូលជោគជ័យទៅក្នុងទិន្នន័យ CamTourism!'
                      : 'Resort successfully added to database!'}
                  </span>
                </div>
              )}

              <form onSubmit={handleQuickAdd} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {lang === 'kh' ? 'ឈ្មោះរមណីយដ្ឋាន (ខ្មែរ) *' : 'Name (Khmer) *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newTitleKh}
                      onChange={e => setNewTitleKh(e.target.value)}
                      placeholder="ឧ. រមណីយដ្ឋានធម្មជាតិបូកគោ..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {lang === 'kh' ? 'ឈ្មោះរមណីយដ្ឋាន (English)' : 'Name (English)'}
                    </label>
                    <input
                      type="text"
                      value={newTitleEn}
                      onChange={e => setNewTitleEn(e.target.value)}
                      placeholder="e.g. Bokor Paradise Resort..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {lang === 'kh' ? 'ខេត្ត / រាជធានី' : 'Province'}
                    </label>
                    <select
                      value={newProv}
                      onChange={e => setNewProv(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-amber-500 bg-white"
                    >
                      {PROVINCES.map((p, i) => (
                        <option key={i} value={p.kh}>
                          {p.kh} ({p.en})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {lang === 'kh' ? 'តម្លៃសំបុត្រ / សេវាកម្ម' : 'Entrance / Ticket'}
                    </label>
                    <input
                      type="text"
                      value={newPrice}
                      onChange={e => setNewPrice(e.target.value)}
                      placeholder="Free / $5..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'kh' ? 'តំណភ្ជាប់រូបភាព (Photo URL)' : 'Photo URL'}
                  </label>
                  <input
                    type="url"
                    value={newImage}
                    onChange={e => setNewImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-amber-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-colors"
                  >
                    💾 {lang === 'kh' ? 'រក្សាទុក និងផ្សព្វផ្សាយភ្លាមៗ' : 'Save & Publish Resort'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
