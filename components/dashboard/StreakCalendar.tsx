'use client'

/** GitHub-style streak calendar (last 30 days). */
export default function StreakCalendar({ activeDays }: { activeDays: number[] }) {
  // Generate last 30 days
  const today = new Date()
  const days: { date: Date; active: boolean }[] = []

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dayOfYear = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000)
    days.push({ date: d, active: activeDays.includes(dayOfYear) || activeDays.includes(i) })
  }

  const weekDay = (d: Date) => d.toLocaleDateString('en', { weekday: 'narrow' })

  return (
    <div>
      <div className="grid grid-cols-10 gap-1">
        {days.map((day, i) => (
          <div
            key={i}
            className={`w-full aspect-square rounded-sm transition-all ${
              day.active
                ? 'bg-brand-500 hover:bg-brand-400'
                : 'bg-earth-800 hover:bg-earth-700'
            }`}
            style={{
              animationDelay: `${i * 30}ms`,
            }}
            title={`${day.date.toLocaleDateString('en', { month: 'short', day: 'numeric' })}${day.active ? ' — active' : ''}`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between mt-2 text-[10px] text-earth-600">
        <span>30 days ago</span>
        <div className="flex items-center gap-1">
          <span>Less</span>
          <div className="w-2.5 h-2.5 bg-earth-800 rounded-sm" />
          <div className="w-2.5 h-2.5 bg-brand-500/40 rounded-sm" />
          <div className="w-2.5 h-2.5 bg-brand-500 rounded-sm" />
          <span>More</span>
        </div>
        <span>Today</span>
      </div>
    </div>
  )
}
