import React from 'react';
import { 
  Home, Sparkles, Box, Layout, Users, Plus, 
  LogOut, ShieldCheck, FileText, ChevronDown 
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserProfile;
  onOpenNewProject: () => void;
  onOpenAiDesigner: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenNewProject,
  onOpenAiDesigner
}) => {
  const navItems = [
    { id: 'dashboard', label: 'داشبورد', icon: Home },
    { id: 'ai_designer', label: 'طراح هوشمند AI', icon: Sparkles },
    { id: 'moodboard', label: 'مادبورد و رندرها', icon: Box },
    { id: 'projects', label: 'پروژه‌ها', icon: Layout },
    { id: 'materials', label: 'بانک مصالح ایرانی', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-800 flex items-center justify-center text-white shadow-md shadow-amber-900/20">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl text-stone-900 tracking-tight">معماریا</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-medium">هوش مصنوعی معماری</span>
              </div>
              <p className="text-xs text-stone-500">پلتفرم هوشمند طراحی داخلی و معماری بومی</p>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="hidden lg:flex items-center gap-1 bg-stone-100 p-1.5 rounded-2xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    window.location.hash = `#/${item.id}`;
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-white text-stone-900 shadow-xs' 
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-800' : 'text-stone-500'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Actions & User Profile */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenNewProject}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-950 text-white text-sm font-medium shadow-md shadow-amber-900/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>پروژه جدید</span>
            </button>

            <button
              onClick={onOpenAiDesigner}
              className="flex sm:hidden items-center justify-center w-10 h-10 rounded-xl bg-amber-900 text-white shadow-md"
              aria-label="طراح هوشمند"
            >
              <Sparkles className="w-5 h-5" />
            </button>

            {/* User chip */}
            <div className="flex items-center gap-3 ps-3 border-s border-stone-200">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-xl object-cover border-2 border-amber-800/20"
              />
              <div className="hidden md:block text-start">
                <div className="text-sm font-bold text-stone-900">{currentUser.name}</div>
                <div className="text-xs text-amber-900 font-medium">{currentUser.title}</div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Mobile nav scrollbar */}
      <div className="lg:hidden flex items-center gap-2 px-4 py-2 bg-stone-50 border-t border-stone-200 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                window.location.hash = `#/${item.id}`;
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive 
                  ? 'bg-amber-900 text-white shadow-xs' 
                  : 'bg-white text-stone-700 border border-stone-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
