import React from 'react';
import { 
  Sparkles, ArrowRight, Box, Layout, ShieldCheck, 
  Plus, CheckCircle2, TrendingUp, Compass, Heart, MessageSquare 
} from 'lucide-react';
import { Project, MaterialItem, RenderItem, UserProfile } from '../types';

interface DashboardViewProps {
  currentUser: UserProfile;
  projects: Project[];
  renders: RenderItem[];
  materials: MaterialItem[];
  setActiveTab: (tab: string) => void;
  onOpenNewProject: () => void;
  onOpenAiDesigner: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  projects,
  renders,
  materials,
  setActiveTab,
  onOpenNewProject,
  onOpenAiDesigner,
}) => {
  return (
    <div className="space-y-8 pb-16">
      
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-white shadow-xl">
        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
          <img 
            src="/__l5e/assets-v1/37676bb5-fabf-42e6-97a0-a98cdbd1de16/prototype-workplace.jpg" 
            alt="طراحی داخلی معماریا" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/60 to-transparent"></div>
        
        <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4" />
            <span>نسل جدید معماری هوشمند ایرانی</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            فضای رویایی خود را با هوش مصنوعی و اصالت ایرانی طراحی کنید
          </h1>
          
          <p className="text-stone-300 text-base sm:text-lg leading-relaxed">
            از رندرینگ سه‌بعدی با هوش مصنوعی تا هماهنگی دقیق با متریال‌های اصیل ایرانی (چوب بلوط، سنگ تراورتن، کاشی فیروزه‌ای). معماریا همراه شماست.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onOpenAiDesigner}
              className="px-6 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-lg shadow-amber-600/30 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Sparkles className="w-5 h-5" />
              <span>شروع طراحی با هوش مصنوعی</span>
            </button>
            <button
              onClick={onOpenNewProject}
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold backdrop-blur-md flex items-center gap-2 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>ایجاد پروژه جدید</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
            <Layout className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">{projects.length}</div>
          <div className="text-sm font-medium text-stone-500">پروژه‌های فعال و بازسازی</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">{renders.length}</div>
          <div className="text-sm font-medium text-stone-500">رندرهای هوش مصنوعی</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-800 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">{materials.length}</div>
          <div className="text-sm font-medium text-stone-500">متریال اصیل ایرانی ثبت شده</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-800 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">۹۸٪</div>
          <div className="text-sm font-medium text-stone-500">رضایت مشتریان و طراحان</div>
        </div>
      </div>

      {/* Recent Projects & AI Renders Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Projects list */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-stone-900">پروژه‌های اخیر شما</h2>
              <p className="text-sm text-stone-500">مدیریت پروژه‌های ساخت و بازسازی داخلی</p>
            </div>
            <button
              onClick={() => setActiveTab('projects')}
              className="text-sm font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1"
            >
              <span>مشاهده همه</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {projects.slice(0, 3).map((proj) => (
              <div 
                key={proj.id}
                onClick={() => setActiveTab('projects')}
                className="group p-4 sm:p-5 rounded-2xl bg-stone-50 hover:bg-amber-50/40 border border-stone-200/80 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={proj.planImage}
                    alt={proj.title}
                    className="w-16 h-16 rounded-xl object-cover border border-stone-200"
                  />
                  <div>
                    <h3 className="font-bold text-stone-900 group-hover:text-amber-900 transition-colors">{proj.title}</h3>
                    <p className="text-xs text-stone-500 mt-0.5">کارفرما: {proj.clientName} • سبک: {proj.style}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900">
                        {proj.status === 'active' ? 'در حال اجرا' : proj.status === 'review' ? 'بررسی کارفرما' : 'تکمیل شده'}
                      </span>
                      <span className="text-xs text-stone-600 font-medium">بودجه: {proj.budget}</span>
                    </div>
                  </div>
                </div>

                <div className="self-end sm:self-center p-2 rounded-xl bg-white text-stone-600 group-hover:bg-amber-900 group-hover:text-white transition-all shadow-xs">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick AI Generator card */}
        <div className="bg-gradient-to-br from-amber-900 to-stone-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <h3 className="text-2xl font-bold">دستیار هوشمند معماری</h3>
            <p className="text-stone-300 text-sm leading-relaxed">
              با هوش مصنوعی پیشرفته معماریا، ایده‌های خود را در چند ثانیه به رندرهای نوری حرفه‌ای و مادبورد تبدیل کنید.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-xs text-stone-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>پشتیبانی از اقلیم و متریال ایرانی</span>
              </div>
              <p>امکان ترکیب آجر سنتی، کاشی فیروزه‌ای و چوب بلوط با طراحی مدرن.</p>
            </div>

            <button
              onClick={onOpenAiDesigner}
              className="w-full py-3.5 rounded-2xl bg-white text-stone-900 hover:bg-stone-100 font-bold transition-all shadow-lg text-center flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-800" />
              <span>اجرای طراح هوشمند</span>
            </button>
          </div>
        </div>

      </div>

      {/* Featured AI Renders Gallery */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900">گالری رندرهای محبوب هوش مصنوعی</h2>
            <p className="text-sm text-stone-500">ایده‌های الهام‌بخش طراحی شده با معماریا AI</p>
          </div>
          <button
            onClick={() => setActiveTab('moodboard')}
            className="text-sm font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1"
          >
            <span>مشاهده گالری کامل</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {renders.slice(0, 3).map((render) => (
            <div key={render.id} className="group rounded-2xl overflow-hidden border border-stone-200 bg-stone-50 shadow-xs hover:shadow-md transition-all">
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={render.imageUrl} 
                  alt={render.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 end-3 px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-white text-xs font-semibold">
                  {render.quality}
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">{render.style}</span>
                  <div className="flex items-center gap-1 text-xs text-stone-500">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    <span>{render.likes}</span>
                  </div>
                </div>
                <h3 className="font-bold text-stone-900">{render.title}</h3>
                <p className="text-xs text-stone-500 line-clamp-2">{render.prompt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
