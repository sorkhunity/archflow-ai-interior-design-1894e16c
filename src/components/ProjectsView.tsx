import React, { useState, useEffect } from 'react';
import { 
  Layout, Plus, Search, Filter, Trash2, Eye, Calendar, 
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

// Normalise helper for Persian/Arabic
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
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 start-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-xl text-sm flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-amber-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold">
            <Layout className="w-4 h-4 text-amber-700" />
            <span>مدیریت پروژه‌های معماری</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">پروژه‌های بازسازی و طراحی داخلی</h1>
          <p className="text-sm text-stone-500">لیست پروژه‌های فعال با متریال‌های انتخابی، بودجه و وضعیت پیشرفت</p>
        </div>
        <button
          onClick={onOpenNewProjectModal}
          className="px-5 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>ثبت پروژه جدید</span>
        </button>
      </div>

      {/* Search & Status Filter */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-stone-200">
        <div className="relative flex-1">
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input
            type="text"
            placeholder="جستجوی نام پروژه، مشتری یا سبک (با تطبیق حروف فارسی)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full ps-12 pe-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all text-stone-900 placeholder:text-stone-400"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
          <Filter className="w-4 h-4 text-stone-400 shrink-0 ms-1 me-2 hidden sm:block" />
          {[
            { id: 'all', label: 'همه پروژه‌ها' },
            { id: 'active', label: 'در حال اجرا' },
            { id: 'review', label: 'در حال بررسی' },
            { id: 'completed', label: 'تکمیل شده' },
          ].map(st => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === st.id ? 'bg-amber-600 text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-4">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
            <Layout className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-800">پروژه‌ای یافت نشد</h3>
          <p className="text-sm text-stone-500 max-w-sm mx-auto">با فیلتر یا عبارت جستجوی فعلی موردی پیدا نشد.</p>
          <button
            onClick={() => { setStatusFilter('all'); setSearchQuery(''); }}
            className="px-5 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-sm"
          >
            مشاهده همه پروژه‌ها
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <div 
              key={project.id}
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-video bg-stone-100 overflow-hidden group">
                <img 
                  src={project.planImage} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 start-3">
                  {getStatusBadge(project.status)}
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span className="flex items-center gap-1 font-semibold text-amber-700">
                      <Sparkles className="w-3.5 h-3.5" />
                      {project.style}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {project.createdAt}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-stone-900 text-xl">{project.title}</h3>
                  <p className="text-xs text-stone-600 line-clamp-2">{project.description}</p>
                </div>

                <div className="space-y-4 pt-4 border-t border-stone-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-stone-400" />
                      مشتری:
                    </span>
                    <span className="font-bold text-stone-800">{project.clientName}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-stone-400" />
                      بودجه:
                    </span>
                    <span className="font-bold text-amber-700">{project.budget}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => setActiveDetailProject(project)}
                      className="flex-1 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Eye className="w-4 h-4" />
                      <span>جزئیات پروژه</span>
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(project.id)}
                      className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-all"
                      aria-label="حذف پروژه"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Detail Modal */}
      {activeDetailProject && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveDetailProject(null)}
          role="dialog"
          aria-modal="true"
          aria-label="جزئیات پروژه"
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video bg-stone-900">
              <img 
                src={activeDetailProject.planImage} 
                alt={activeDetailProject.title} 
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveDetailProject(null)}
                className="absolute top-4 start-4 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 backdrop-blur-md transition-all"
                aria-label="بستن"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute top-4 end-4">
                {getStatusBadge(activeDetailProject.status)}
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-700">{activeDetailProject.style}</span>
                <h2 className="text-2xl font-extrabold text-stone-900">{activeDetailProject.title}</h2>
                <p className="text-sm text-stone-600 leading-relaxed">{activeDetailProject.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs">
                <div>
                  <span className="text-stone-400 block mb-1">نام مشتری</span>
                  <span className="font-bold text-stone-800 text-sm">{activeDetailProject.clientName}</span>
                </div>
                <div>
                  <span className="text-stone-400 block mb-1">برآورد بودجه</span>
                  <span className="font-bold text-amber-700 text-sm">{activeDetailProject.budget}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-stone-800 text-sm">مصالح و متریال‌های تخصیص‌یافته</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {activeDetailProject.materials?.map(mat => (
                    <div key={mat.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-3">
                      <img src={mat.imageUrl} alt={mat.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div className="overflow-hidden">
                        <span className="font-bold text-stone-800 text-xs block truncate">{mat.name}</span>
                        <span className="text-[10px] text-stone-400">{mat.code}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end pt-4 border-t border-stone-100">
                <button
                  onClick={() => setActiveDetailProject(null)}
                  className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-md"
                >
                  بستن پنجره
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (Replaces window.confirm) */}
      {deleteConfirmId && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setDeleteConfirmId(null)}
          role="dialog"
          aria-modal="true"
          aria-label="تایید حذف پروژه"
        >
          <div 
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-extrabold text-stone-900">آیا از حذف این پروژه مطمئن هستید؟</h3>
              <p className="text-sm text-stone-500">این عملیات غیرقابل بازگشت است و تمام اطلاعات مرتبط با آن حذف خواهد شد.</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-all"
              >
                انصراف
              </button>
              <button
                onClick={() => {
                  onDeleteProject(deleteConfirmId);
                  setDeleteConfirmId(null);
                  showToast('پروژه با موفقیت حذف شد.');
                }}
                className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all"
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
