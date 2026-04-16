export default function PageLoading() {
  return (
    <div className="min-h-screen bg-earth-950">
      {/* Navbar placeholder */}
      <div className="h-16 bg-earth-900/80 border-b border-earth-800" />

      {/* Hero skeleton */}
      <section className="relative min-h-[60vh] flex items-center pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-4xl mx-auto text-center">
            <div className="h-6 w-48 bg-earth-800 rounded-full animate-pulse mx-auto mb-6" />
            <div className="h-12 w-3/4 bg-earth-800 rounded-lg animate-pulse mx-auto mb-4" />
            <div className="h-12 w-1/2 bg-earth-800 rounded-lg animate-pulse mx-auto mb-6" />
            <div className="h-5 w-96 bg-earth-800/60 rounded animate-pulse mx-auto mb-8" />
            <div className="flex gap-4 justify-center">
              <div className="h-14 w-40 bg-brand-500/20 rounded-xl animate-pulse" />
              <div className="h-14 w-40 bg-earth-800 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats skeleton */}
      <section className="border-y border-earth-800 bg-earth-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 bg-earth-800 rounded-xl animate-pulse mx-auto mb-3" />
                <div className="h-8 w-16 bg-earth-800 rounded-lg animate-pulse mx-auto mb-1" />
                <div className="h-3 w-24 bg-earth-800/60 rounded animate-pulse mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
