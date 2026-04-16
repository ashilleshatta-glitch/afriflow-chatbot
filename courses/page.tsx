'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AfriAICoach from '@/components/LazyAfriAICoach'
import CourseCard from '@/components/CourseCard'
import { Search, Filter, SlidersHorizontal } from 'lucide-react'
import { SAMPLE_COURSES, SCHOOLS } from '@/lib/data'

const LEVELS = ['All', 'beginner', 'intermediate', 'advanced']
const PRICES = ['All', 'Free', 'Paid', 'Premium']

export default function CoursesPage() {
  const [search, setSearch] = useState('')
  const [selectedSchool, setSelectedSchool] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('All')
  const [selectedPrice, setSelectedPrice] = useState('All')

  const filtered = SAMPLE_COURSES.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
    const matchSchool = selectedSchool === 'all' || c.school === selectedSchool
    const matchLevel = selectedLevel === 'All' || c.level === selectedLevel
    const matchPrice = selectedPrice === 'All' ||
      (selectedPrice === 'Free' && c.isFree) ||
      (selectedPrice === 'Paid' && !c.isFree && !c.isPremium) ||
      (selectedPrice === 'Premium' && c.isPremium)
    return matchSearch && matchSchool && matchLevel && matchPrice
  })

  return (
    <div className="min-h-screen bg-earth-950">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="relative bg-earth-900 border-b border-earth-800 py-16">
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="section-tag mb-4">
              <Filter size={14} />
              All Courses
            </span>
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
              Learn AI, Automate <span className="gradient-text">Everything</span>
            </h1>
            <p className="text-earth-400 text-lg max-w-2xl mx-auto mb-8">
              Practical AI courses built for African learners, businesses, and builders.
            </p>
            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-500" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search courses, tools, topics..."
                className="input-field pl-12 py-4 text-base"
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar filters */}
            <div className="lg:w-64 flex-shrink-0 space-y-6">
              <div>
                <h3 className="text-white font-medium text-sm mb-3 flex items-center gap-2">
                  <SlidersHorizontal size={15} className="text-brand-400" /> School
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedSchool('all')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedSchool === 'all' ? 'bg-brand-500/15 text-brand-400 font-medium' : 'text-earth-400 hover:text-white hover:bg-earth-800'
                    }`}
                  >
                    All Schools
                  </button>
                  {SCHOOLS.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSchool(s.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                        selectedSchool === s.id ? 'bg-brand-500/15 text-brand-400 font-medium' : 'text-earth-400 hover:text-white hover:bg-earth-800'
                      }`}
                    >
                      <span>{s.icon}</span> {s.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-white font-medium text-sm mb-3">Level</h3>
                <div className="flex flex-wrap gap-2">
                  {LEVELS.map(level => (
                    <button
                      key={level}
                      onClick={() => setSelectedLevel(level)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                        selectedLevel === level
                          ? 'bg-brand-500 text-white'
                          : 'bg-earth-800 text-earth-400 hover:text-white'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-white font-medium text-sm mb-3">Price</h3>
                <div className="flex flex-wrap gap-2">
                  {PRICES.map(price => (
                    <button
                      key={price}
                      onClick={() => setSelectedPrice(price)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedPrice === price
                          ? 'bg-brand-500 text-white'
                          : 'bg-earth-800 text-earth-400 hover:text-white'
                      }`}
                    >
                      {price}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Course grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-earth-400 text-sm">
                  <span className="text-white font-medium">{filtered.length}</span> courses found
                </p>
                <select className="bg-earth-800 border border-earth-700 text-earth-300 text-sm rounded-lg px-3 py-2 outline-none">
                  <option>Most popular</option>
                  <option>Newest first</option>
                  <option>Price: Low to high</option>
                  <option>Highest rated</option>
                </select>
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="text-white font-semibold text-lg mb-2">No courses found</h3>
                  <p className="text-earth-500">Try adjusting your filters or search terms</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filtered.map((course, i) => (
                    <CourseCard key={i} course={course as any} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <AfriAICoach />
    </div>
  )
}
