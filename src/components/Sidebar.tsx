import { useApp, type Page } from '../context/AppContext';
import {
  LayoutDashboard,
  User,
  Music,
  Sparkles,
  ListChecks,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const navItems: { id: Page; label: string; icon: typeof LayoutDashboard; badge?: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'routine', label: 'Practice', icon: ListChecks },
  { id: 'generate', label: 'Generate', icon: Sparkles, badge: 'AI' },
  { id: 'instruments', label: 'Instruments', icon: Music },
  { id: 'profile', label: 'Profile', icon: User },
];

export default function Sidebar() {
  const { page, navigate, student } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = (id: Page) => {
    navigate(id);
    setMobileOpen(false);
  };

  const content = (
    <>
      <div className="px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center shadow-lg shadow-brand-600/20">
            <Music className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-surface-900">MadJo AI</h1>
            <p className="text-[11px] text-surface-400 font-medium tracking-wide uppercase">AI Music Learning Agent</p>
          </div>
        </div>
      </div>

      <div className="px-3 mb-4">
        <div className="px-3 py-3 bg-surface-50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 gradient-brand rounded-lg flex items-center justify-center text-white text-sm font-semibold">
              {student.avatar}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-surface-900 truncate">{student.name}</p>
              <p className="text-xs text-surface-500">Grade {student.gradeLevel} &middot; {student.instrument}</p>
            </div>
          </div>
        </div>
      </div>

      <nav className="px-3 flex-1">
        <p className="px-3 mb-2 text-[11px] font-semibold text-surface-400 uppercase tracking-wider">Menu</p>
        {navItems.map((item) => {
          const isActive = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => nav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 mb-1 ${
                isActive
                  ? 'bg-brand-50 text-brand-700 shadow-sm'
                  : 'text-surface-500 hover:bg-surface-50 hover:text-surface-700'
              }`}
            >
              <item.icon className={`w-[18px] h-[18px] ${isActive ? 'text-brand-600' : ''}`} />
              {item.label}
              {item.badge && (
                <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold bg-accent-100 text-accent-700 rounded-md">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-surface-100">
        <div className="flex items-center gap-2 text-accent-600">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-semibold">{student.streak} day streak</span>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-surface-200/60">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center">
              <Music className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-lg font-bold text-surface-900">MadJo AI</span>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg hover:bg-surface-100">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed top-0 left-0 bottom-0 z-40 w-72 bg-white border-r border-surface-200/60 flex flex-col transform transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {content}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-surface-200/60">
        {content}
      </aside>
    </>
  );
}
