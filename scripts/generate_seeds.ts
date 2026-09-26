import { PROVINCES, DESTINATIONS } from '../src/data/cambodiaData.ts'
import fs from 'node:fs'
import path from 'node:path'

function escapeSql(str: string | undefined | null): string {
  if (str === undefined || str === null) return 'NULL'
  return "'" + str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r') + "'"
}

const lines: string[] = []
lines.push('-- ==============================================================================')
lines.push('-- CamTourism Official Seed Data (All 25 Provinces & 46 Authentic Destinations)')
lines.push('-- ==============================================================================')
lines.push('USE `camtourism`;')
lines.push('')
lines.push('-- 1. SEED CATEGORIES')
lines.push('INSERT INTO `categories` (`slug`, `name_kh`, `name_en`, `icon`, `count_spots`, `desc_kh`, `desc_en`) VALUES')
const categoriesData = [
  { slug: 'temple', kh: 'ប្រាសាទបុរាណ', en: 'Ancient Temples', icon: '🏛️', count: 12, desc_kh: 'បេតិកភណ្ឌពិភពលោក និងប្រាសាទអង្គរ', desc_en: 'World heritage sanctuaries and Angkor architecture' },
  { slug: 'island', kh: 'កោះ & ឆ្នេរសមុទ្រ', en: 'Islands & Beaches', icon: '🏝️', count: 6, desc_kh: 'ឆ្នេរខ្សាច់ស ទឹកថ្លាឈ្វេង និងកោះឋានសួគ៌', desc_en: 'White sand beaches, crystal waters & island getaways' },
  { slug: 'waterfall', kh: 'ទឹកធ្លាក់ធម្មជាតិ', en: 'Waterfalls', icon: '💧', count: 7, desc_kh: 'ទឹកធ្លាក់ប៊ូស្រា គូលែន និងអូរតាវ៉ៅ', desc_en: 'Bousra, Kulen and scenic cascading mountain falls' },
  { slug: 'mountain', kh: 'ភ្នំ & ឧទ្យានជាតិ', en: 'Mountains & Parks', icon: '⛰️', count: 8, desc_kh: 'ភ្នំបូករ ភ្នំឱរ៉ាល់ និងជួរភ្នំក្រវាញ', desc_en: 'Bokor, Aural peak and Cardamom mountain range' },
  { slug: 'culture', kh: 'វប្បធម៌ & រាជធានី', en: 'Culture & Heritage', icon: '🏙️', count: 10, desc_kh: 'ព្រះបរមរាជវាំង សារមន្ទីរ និងវត្តអារាមប្រវត្តិសាស្ត្រ', desc_en: 'Royal palace, historic museums and Buddhist pagodas' },
  { slug: 'nature', kh: 'អេកូទេសចរណ៍ & ធម្មជាតិ', en: 'Ecotourism & Wildlife', icon: '🌿', count: 8, desc_kh: 'ផ្សោតកាំពី ដែនជម្រកសត្វព្រៃ និងព្រៃកោងកាង', desc_en: 'Irrawaddy dolphins, wildlife sanctuaries and mangroves' },
  { slug: 'food', kh: 'ម្ហូបអាហារ & ផ្សាររាត្រី', en: 'Food & Night Markets', icon: '🍲', count: 5, desc_kh: 'រសជាតិម្ហូបខ្មែរ ក្តាមឆាម្រេចខ្ចី និងផ្សារកែប', desc_en: 'Authentic Khmer cuisine, Kep crab and vibrant night markets' },
]

lines.push(
  categoriesData.map(c => `(${escapeSql(c.slug)}, ${escapeSql(c.kh)}, ${escapeSql(c.en)}, ${escapeSql(c.icon)}, ${c.count}, ${escapeSql(c.desc_kh)}, ${escapeSql(c.desc_en)})`).join(',\n') + ';'
)
lines.push('')

lines.push('-- 2. SEED PROVINCES')
lines.push('INSERT INTO `provinces` (`id`, `name_kh`, `name_en`, `slug`, `region_kh`, `region_en`, `count_destinations`, `image`, `desc_kh`, `desc_en`, `top_spots_kh`, `top_spots_en`) VALUES')

const provValues = PROVINCES.map((p, idx) => {
  const id = idx + 1
  const slug = p.en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const topKhJson = JSON.stringify(p.topSpots_kh)
  const topEnJson = JSON.stringify(p.topSpots_en)
  return `(${id}, ${escapeSql(p.kh)}, ${escapeSql(p.en)}, ${escapeSql(slug)}, ${escapeSql(p.region_kh)}, ${escapeSql(p.region_en)}, ${p.count}, ${escapeSql(p.image)}, ${escapeSql(p.desc_kh)}, ${escapeSql(p.desc_en)}, ${escapeSql(topKhJson)}, ${escapeSql(topEnJson)})`
})
lines.push(provValues.join(',\n') + ';')
lines.push('')

lines.push('-- 3. SEED DESTINATIONS')
lines.push('INSERT INTO `destinations` (`id`, `title_kh`, `title_en`, `province_id`, `category_slug`, `cat_kh`, `cat_en`, `rating`, `reviews_count`, `image`, `hero_image`, `desc_kh`, `desc_en`, `location_kh`, `location_en`, `hours`, `ticket`, `best_time_kh`, `best_time_en`, `time_spent`, `distance`, `facilities`, `nearby_ids`, `is_popular`, `popular_badge_kh`, `popular_badge_en`) VALUES')

const destValues = DESTINATIONS.map(d => {
  // Find province_id
  const provIdx = PROVINCES.findIndex(p => p.en.toLowerCase() === d.province_en.toLowerCase())
  const province_id = provIdx >= 0 ? provIdx + 1 : 1

  let cat_slug = 'culture'
  const cKh = d.cat_kh.toLowerCase()
  if (cKh.includes('ប្រាសាទ')) cat_slug = 'temple'
  else if (cKh.includes('កោះ') || cKh.includes('ឆ្នេរ')) cat_slug = 'island'
  else if (cKh.includes('ទឹកធ្លាក់')) cat_slug = 'waterfall'
  else if (cKh.includes('ភ្នំ')) cat_slug = 'mountain'
  else if (cKh.includes('ធម្មជាតិ') || cKh.includes('អេកូ')) cat_slug = 'nature'
  else if (cKh.includes('អាហារ') || cKh.includes('ម្ហូប')) cat_slug = 'food'

  const facilitiesJson = JSON.stringify(d.facilities || [])
  const nearbyJson = JSON.stringify(d.nearby || [])
  const isPop = d.isPopular ? 1 : 0

  return `(${d.id}, ${escapeSql(d.kh)}, ${escapeSql(d.en)}, ${province_id}, ${escapeSql(cat_slug)}, ${escapeSql(d.cat_kh)}, ${escapeSql(d.cat_en)}, ${d.rating}, ${d.reviews}, ${escapeSql(d.image)}, ${escapeSql(d.hero)}, ${escapeSql(d.desc_kh)}, ${escapeSql(d.desc_en)}, ${escapeSql(d.location_kh)}, ${escapeSql(d.location_en)}, ${escapeSql(d.hours)}, ${escapeSql(d.ticket)}, ${escapeSql(d.best_time_kh)}, ${escapeSql(d.best_time_en)}, ${escapeSql(d.time_spent)}, ${escapeSql(d.distance)}, ${escapeSql(facilitiesJson)}, ${escapeSql(nearbyJson)}, ${isPop}, ${escapeSql(d.popularBadge_kh)}, ${escapeSql(d.popularBadge_en)})`
})

lines.push(destValues.join(',\n') + ';')
lines.push('')

lines.push('-- 4. SAMPLE REVIEWS')
lines.push('INSERT INTO `reviews` (`destination_id`, `user_name`, `rating`, `comment`) VALUES')
lines.push(`(1, 'សុខ សុវណ្ណារ៉ា', 5, 'ប្រាសាទអង្គរវត្តពេលថ្ងៃរះពិតជាអស្ចារ្យណាស់ ជាមោទនភាពជាតិខ្មែរ!'),`)
lines.push(`(1, 'Michael Chen', 5, 'One of the greatest human architectural wonders in history. Unforgettable sunrise!'),`)
lines.push(`(7, 'លីណា សៀក', 5, 'កោះរ៉ុងសន្លឹម ទឹកសមុទ្រថ្លាដូចកញ្ចក់ ខ្សាច់សក្បុស ស្ងប់ស្ងាត់ល្អណាស់សម្រាប់សម្រាកលំហែកាយ។'),`)
lines.push(`(16, 'ចាន់ វិបុល', 5, 'ទឹកធ្លាក់ប៊ូស្រាទឹកធ្លាក់ខ្លាំង ត្រជាក់ស្រេង ខ្យល់អាកាសបរិសុទ្ធ ម្ហូបជនជាតិដើមភាគតិចក៏ឆ្ងាញ់!'),`)
lines.push(`(9, 'Sarah Jenkins', 5, 'Bokor National Park has incredible mountain mist, historical palace ruins, and cool breeze.');`)

const outPath = path.resolve(process.cwd(), 'database/seeds.sql')
fs.writeFileSync(outPath, lines.join('\n'), 'utf-8')
console.log('Successfully generated database/seeds.sql!')
