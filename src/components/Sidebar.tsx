import React from 'react';
import { ActiveTab, UserStats } from '../types';
import { 
  LayoutDashboard, 
  CheckSquare, 
  FileText, 
  Gift, 
  History, 
  Sparkles, 
  Award,
  Zap,
  ChevronRight,
  Database,
  User,
  ExternalLink,
  Phone,
  MessageCircle,
  BookOpen,
  HelpCircle
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  stats: UserStats;
  onOpenAi: () => void;
  onOpenBackup: () => void;
  onOpenManual: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  stats,
  onOpenAi,
  onOpenBackup,
  onOpenManual,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'tasks', label: 'Tasks & Goals', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'notes', label: 'Notes & Ideas', icon: <FileText className="w-4 h-4" /> },
    { 
      id: 'rewards', 
      label: 'Reward Shop', 
      icon: <Gift className="w-4 h-4" />, 
      badge: `${stats.pointsBalance} PTS` 
    },
    { id: 'history', label: 'Activity Log', icon: <History className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Sidebar Container matching dark wireframe screenshot */}
      <aside className={`
        fixed lg:static top-0 left-0 bottom-0 z-50
        w-64 bg-[#121216] border-r border-[#22222a] p-4 flex flex-col justify-between
        transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="space-y-6">
          {/* Logo / App Header */}
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <Zap className="w-5 h-5 fill-white/20" />
              </div>
              <div>
                <h1 className="text-base font-semibold text-white tracking-tight leading-none">NEXUS</h1>
                <p className="text-[11px] text-zinc-400 font-medium tracking-wide uppercase mt-1">Tasks & Rewards</p>
              </div>
            </div>
          </div>

          {/* User Rank Card */}
          <div className="bg-[#191921] border border-[#272734] rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-medium text-zinc-300">Level {stats.level}</div>
                  <div className="text-[10px] text-zinc-400">Productivity Master</div>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-400 font-number">{stats.currentStreak}d Streak 🔥</span>
            </div>

            {/* XP Bar */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[10px] text-zinc-400 font-number">
                <span>XP Progress</span>
                <span>{stats.xp} / {stats.xpToNextLevel}</span>
              </div>
              <div className="w-full bg-[#242432] h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-violet-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (stats.xp / stats.xpToNextLevel) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider px-3 mb-2">
              Menu
            </div>
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium
                    transition-all duration-150 group
                    ${isActive 
                      ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30' 
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#191922] border border-transparent'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <span className={isActive ? 'text-indigo-400' : 'text-zinc-400 group-hover:text-zinc-200'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`
                      text-[10px] font-semibold px-2 py-0.5 rounded-md font-number
                      ${isActive ? 'bg-indigo-500/20 text-indigo-300' : 'bg-[#22222d] text-zinc-400'}
                    `}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* User Manual & Guide Button */}
            <div className="pt-2 mt-2 border-t border-[#22222d] space-y-1.5">
              <button
                onClick={() => {
                  onOpenManual();
                  setIsMobileOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-indigo-300 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/25 hover:border-indigo-500/40 transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <span>User Manual (নির্দেশিকা)</span>
                </div>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-bold">
                  Guide
                </span>
              </button>

              <button
                onClick={() => {
                  onOpenBackup();
                  setIsMobileOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40 transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>Save / Export Data</span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-semibold">
                  JSON
                </span>
              </button>
            </div>
          </nav>
        </div>

        {/* Bottom AI Assistant Promo & Developer Credits */}
        <div className="pt-3 border-t border-[#22222a] space-y-2.5">
          <button
            onClick={onOpenAi}
            className="w-full bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-800/40 hover:border-indigo-500/60 p-2.5 rounded-xl flex items-center justify-between text-left group transition-all"
          >
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">AI Studio Helper</div>
                <div className="text-[10px] text-zinc-400">Suggest tasks & rewards</div>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* Developer Credit Card */}
          <div className="bg-[#121217] border border-[#232330] p-3 rounded-xl space-y-2">
            <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 flex items-center justify-between">
              <span>Made By</span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
            </div>

            <div>
              <div className="text-xs font-bold text-white tracking-wide">Fahim Faisal</div>
              <div className="text-[10px] text-indigo-400 font-medium">UI & UX Designer</div>
              <div className="text-[10px] text-zinc-400">Product Developer</div>
            </div>

            {/* Links */}
            <div className="pt-2 border-t border-[#1f1f2a] flex items-center justify-between gap-1 text-[10px]">
              <a
                href="https://web.facebook.com/designerzFahim"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-2 py-1 rounded-lg transition-colors border border-blue-500/20"
              >
                <span>Facebook</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>

              <a
                href="https://wa.me/8801868503159"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-1 rounded-lg transition-colors border border-emerald-500/20"
              >
                <MessageCircle className="w-2.5 h-2.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
