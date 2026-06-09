import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, BarChart2, Sparkles, Zap } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/habits/new', label: 'Create Habit', icon: PlusCircle, end: false },
  { to: '/analytics', label: 'Analytics', icon: BarChart2, end: false },
  { to: '/ai', label: 'AI Recommendations', icon: Sparkles, end: false },
];

const Sidebar = () => {
  return (
    <aside className="hidden lg:flex flex-col w-56 shrink-0 bg-white border-r border-slate-200 min-h-screen py-6 px-3">
      {/* Logo */}
      <div className="flex items-center gap-2 px-3 mb-8">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <Zap size={16} className="text-white" fill="white" />
        </div>
        <span className="font-bold text-slate-800 text-lg tracking-tight">
          Habit Hero
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto px-3 pt-6 border-t border-slate-100">
        <p className="text-xs text-slate-400">© 2024 Habit Hero</p>
      </div>
    </aside>
  );
};

export default Sidebar;
