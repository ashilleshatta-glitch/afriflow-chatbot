export default function AuthLoading() {
  return (
    <div className="min-h-screen bg-earth-950 flex">
      {/* Left panel skeleton */}
      <div className="hidden lg:flex lg:w-1/2 bg-earth-900 border-r border-earth-800 flex-col justify-between p-12">
        <div className="h-8 w-40 bg-earth-800 rounded-lg animate-pulse" />
        <div className="space-y-6">
          <div className="h-10 w-72 bg-earth-800 rounded-lg animate-pulse" />
          <div className="h-4 w-96 bg-earth-800/60 rounded animate-pulse" />
          <div className="space-y-3 mt-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-earth-800 rounded-full animate-pulse" />
                <div className="h-4 w-48 bg-earth-800/60 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
        <div className="h-4 w-32 bg-earth-800/40 rounded animate-pulse" />
      </div>

      {/* Right panel skeleton */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="h-8 w-48 bg-earth-800 rounded-lg animate-pulse mx-auto mb-2" />
            <div className="h-4 w-64 bg-earth-800/60 rounded animate-pulse mx-auto" />
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-earth-800 rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="h-12 bg-brand-500/20 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  )
}
