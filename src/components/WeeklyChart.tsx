import { mockWeeklyData } from '../data/mockData';

export default function WeeklyChart() {
  const maxMinutes = Math.max(...mockWeeklyData.map((d) => d.minutes));

  return (
    <div className="card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <h3 className="section-title">This Week</h3>
        <span className="badge-brand">{mockWeeklyData.reduce((a, b) => a + b.minutes, 0)} min total</span>
      </div>

      <div className="flex items-end justify-between gap-2 h-36">
        {mockWeeklyData.map((d, i) => {
          const height = (d.minutes / maxMinutes) * 100;
          const isToday = i === new Date().getDay() - 1 || (i === 6 && new Date().getDay() === 0);
          return (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-semibold text-surface-700">{d.minutes}</span>
              <div className="w-full relative" style={{ height: '100px' }}>
                <div
                  className={`absolute bottom-0 w-full rounded-lg transition-all duration-500 ${
                    isToday ? 'gradient-brand shadow-md shadow-brand-600/20' : 'bg-surface-200 hover:bg-surface-300'
                  }`}
                  style={{ height: `${height}%` }}
                />
              </div>
              <span className={`text-xs font-medium ${isToday ? 'text-brand-700' : 'text-surface-400'}`}>{d.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
