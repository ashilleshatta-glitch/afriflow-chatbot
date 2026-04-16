export default function CoursesLoading() {
  return (
    <div className="min-h-screen bg-earth-950">
      {/* Navbar placeholder */}
      <div className="h-16 bg-earth-900/80 border-b border-earth-800" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="h-10 w-64 bg-earth-800 rounded-lg animate-pulse mx-auto mb-4" />
          <div className="h-4 w-96 bg-earth-800/60 rounded animate-pulse mx-auto" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-10 w-28 bg-earth-800 rounded-xl animate-pulse" />
          ))}
        </div>

        {/* Search bar */}
        <div className="max-w-lg mx-auto mb-12">
          <div className="h-12 bg-earth-800 rounded-xl animate-pulse" />
        </div>

        {/* Course grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-earth-900 border border-earth-800 rounded-2xl overflow-hidden">
              <div className="h-48 bg-earth-800 animate-pulse" />
              <div className="p-5">
                <div className="h-3 w-20 bg-earth-800/60 rounded animate-pulse mb-3" />
                <div className="h-5 w-3/4 bg-earth-800 rounded animate-pulse mb-2" />
                <div className="h-3 w-full bg-earth-800/40 rounded animate-pulse mb-4" />
                <div className="flex justify-between items-center">
                  <div className="h-4 w-16 bg-earth-800/60 rounded animate-pulse" />
                  <div className="h-8 w-24 bg-earth-800 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
