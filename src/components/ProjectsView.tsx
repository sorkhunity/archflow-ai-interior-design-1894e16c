import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, Trash2, Eye, Calendar, 
  DollarSign, User, Sparkles, CheckCircle2, AlertCircle, X, Check 
} from 'lucide-react';
import { Project, MaterialItem } from '../types';

interface ProjectsViewProps {
  projects: Project[];
  materials: MaterialItem[];
  onAddProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  onOpenNewProjectModal: () => void;
}

const normaliseText = (str: string) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/ة/g, 'ه')
    .replace(/آ/g, 'ا')
    .trim();
};

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  materials,
  onAddProject,
  onDeleteProject,
  onOpenNewProjectModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeDetailProject, setActiveDetailProject] = useState<Project | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeDetailProject) setActiveDetailProject(null);
        if (deleteConfirmId) setDeleteConfirmId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDetailProject, deleteConfirmId]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredProjects = projects.filter(p => {
    const norm = normaliseText(debouncedSearch);
    const matchesSearch = !norm || 
      normaliseText(p.title).includes(norm) || 
      normaliseText(p.clientName).includes(norm) ||
      normaliseText(p.style).includes(norm);
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">در حال اجرا</span>;
      case 'review':
        return <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200">در حال بررسی</span>;
      case 'completed':
        return <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold border border-blue-200">تکمیل شده</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold border border-stone-200">پیش‌نویس</span>;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {toastMsg && (
        <div className="fixed bottom-6 start-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-xl text-sm flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-amber-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">مدیریت پروژه‌های طراحی داخلی</h1>
          <p className="text-sm text-stone-500 mt-1">لیست جامع پروژه‌ها، وضعیت پیشرفت و دسترسی به جزئیات مالی و متریال</p>
        </div>
        <button
          onClick={onOpenNewProjectModal}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-600 text-white font-medium hover:bg-amber-700 shadow-lg shadow-amber-600/20 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>پروژه جدید</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-stone-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی پروژه، کارفرما یا سبک..."
            className="w-full ps-10 pe-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-stone-400 ms-1 hidden sm:block" />
          {[
            { id: 'all', label: 'همه' },
            { id: 'active', label: 'در حال اجرا' },
            { id: 'review', label: 'در حال بررسی' },
            { id: 'completed', label: 'تکمیل شده' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid / Empty State */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-stone-800">هیچ پروژه‌ای یافت نشد</h3>
          <p className="text-sm text-stone-500 max-w-sm mx-auto">با عبارت جستجوی فعلی یا فیلتر انتخاب شده، موردی پیدا نشد. لطفاً فیلتر را تغییر دهید یا پروژه جدیدی ثبت کنید.</p>
          <button
            onClick={onOpenNewProjectModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-medium hover:bg-amber-700 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>افزودن پروژه جدید</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p) => (
            <div 
              key={p.id}
              className="bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group"
            >
              <div className="relative h-48 overflow-hidden bg-stone-100">
                <img 
                  src={p.image} 
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 start-3">
                  {getStatusBadge(p.status)}
                </div>
                <div className="absolute top-3 end-3 bg-stone-900/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs font-medium">
                  {p.style}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-stone-900 group-hover:text-amber-700 transition-colors">{p.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <User className="w-3.5 h-3.5 text-stone-400" />
                    <span>کارفرما: {p.clientName}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-stone-100">
                  <div className="flex items-center justify-between text-xs text-stone-600">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      <span>تحویل: {p.deadline}</span>
                    </span>
                    <span className="flex items-center gap-1.5 font-semibold text-stone-900">
                      <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                      <span>{(p.budget ?? 0).toLocaleString('fa-IR')} میلیون تومان</span>
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-stone-500">پیشرفت فیزیکی</span>
                      <span className="text-amber-700 font-bold">{p.progress}%</span>
                    </div>
                    <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-amber-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                  <button
                    onClick={() => setActiveDetailProject(p)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-amber-700 bg-stone-50 hover:bg-stone-100 px-3.5 py-2 rounded-xl transition-all"
                  >
                    <Eye className="w-4 h-4 text-stone-500" />
                    <span>مشاهده جزئیات</span>
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(p.id)}
                    className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    title="حذف پروژه"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {activeDetailProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
            <div className="relative h-64 bg-stone-100">
              <img 
                src={activeDetailProject.image} 
                alt={activeDetailProject.title}
                className="w-full h-full object-cover" 
              />
              <button
                onClick={() => setActiveDetailProject(null)}
                className="absolute top-4 end-4 p-2.5 bg-stone-900/60 hover:bg-stone-900 text-white rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 start-4 flex items-center gap-2">
                {getStatusBadge(activeDetailProject.status)}
                <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-stone-900">
                  {activeDetailProject.style}
                </span>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-stone-900">{activeDetailProject.title}</h2>
                <p className="text-sm text-stone-500 mt-1">کارفرما: {activeDetailProject.clientName}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <div>
                  <span className="text-xs text-stone-400 block">بودجه کل</span>
                  <span className="text-sm font-bold text-stone-900 mt-0.5 block">{(activeDetailProject.budget ?? 0).toLocaleString('fa-IR')} م.ت</span>
                </div>
                <div>
                  <span className="text-xs text-stone-400 block">تاریخ تحویل</span>
                  <span className="text-sm font-bold text-stone-900 mt-0.5 block">{activeDetailProject.deadline}</span>
                </div>
                <div>
                  <span className="text-xs text-stone-400 block">پیشرفت کار</span>
                  <span className="text-sm font-bold text-amber-600 mt-0.5 block">{activeDetailProject.progress}%</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>متریال‌ها و مصالح پیشنهادی</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {materials.slice(0, 4).map((m) => (
                    <div key={m.id} className="flex items-center gap-3 p-3 rounded-2xl border border-stone-200 bg-stone-50">
                      <img src={m.image} alt={m.name} className="w-12 h-12 rounded-xl object-cover" />
                      <div className="overflow-hidden">
                        <h5 className="text-xs font-bold text-stone-800 truncate">{m.name}</h5>
                        <span className="text-xs text-stone-500">{m.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-stone-100">
                <button
                  onClick={() => setActiveDetailProject(null)}
                  className="px-6 py-2.5 bg-stone-900 text-white rounded-2xl text-sm font-medium hover:bg-stone-800 transition-all"
                >
                  بستن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl border border-stone-200 text-center">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-600">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-stone-900">آیا از حذف این پروژه اطمینان دارید؟</h3>
              <p className="text-sm text-stone-500">این عملیات غیرقابل بازگشت است و تمام اطلاعات مرتبط با آن حذف خواهد شد.</p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-stone-100 text-stone-700 text-sm font-medium hover:bg-stone-200 transition-all"
              >
                انصراف
              </button>
              <button
                onClick={() => {
                  onDeleteProject(deleteConfirmId);
                  setDeleteConfirmId(null);
                  showToast('پروژه با موفقیت حذف شد');
                }}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20"
              >
                تایید و حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
