import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Trash2, Eye, Calendar, 
  User, Sparkles, AlertCircle, X, Check 
} from 'lucide-react';
import { Project, MaterialItem } from '../types';

interface ProjectsListProps {
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

export const ProjectsView: React.FC<ProjectsListProps> = ({
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
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">مدیریت پروژه‌ها</h1>
          <p className="text-sm text-stone-500 mt-1">بررسی، مدیریت و پیگیری پروژه‌های طراحی داخلی و معماری</p>
        </div>
        <button
          onClick={onOpenNewProjectModal}
          className="px-5 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-2xl shadow-lg shadow-amber-600/20 transition-all flex items-center gap-2 text-sm"
        >
          <Plus className="w-5 h-5" />
          <span>پروژه جدید</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input
            type="text"
            placeholder="جستجو بر اساس نام پروژه، کارفرما یا سبک..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full ps-12 pe-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-sm"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'همه پروژه‌ها' },
            { id: 'active', label: 'در حال اجرا' },
            { id: 'review', label: 'در حال بررسی' },
            { id: 'completed', label: 'تکمیل شده' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? 'bg-stone-900 text-white shadow-md'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 shadow-sm p-8">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 mb-1">پروژه‌ای یافت نشد</h3>
          <p className="text-sm text-stone-500 max-w-sm mx-auto mb-6">با فیلترهای فعلی یا عبارت جستجو، موردی پیدا نشد. پروژه جدیدی اضافه کنید یا جستجو را تغییر دهید.</p>
          <button
            onClick={onOpenNewProjectModal}
            className="px-5 py-2.5 bg-stone-900 text-white text-sm font-medium rounded-xl hover:bg-stone-800 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>افزودن پروژه جدید</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div 
              key={project.id}
              className="bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group"
            >
              {/* Image banner */}
              <div className="relative h-48 overflow-hidden bg-stone-100">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e)=>{(e.target as HTMLImageElement).src='/__l5e/assets-v1/37676bb5-fabf-42e6-97a0-a98cdbd1de16/prototype-workplace.jpg';}}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-3 start-3">
                  {getStatusBadge(project.status)}
                </div>
                <div className="absolute bottom-3 start-4 end-4 text-white">
                  <span className="text-xs font-medium text-amber-300 bg-black/40 px-2.5 py-1 rounded-lg backdrop-blur-md">
                    {project.style}
                  </span>
                  <h3 className="text-lg font-bold mt-1 text-white tracking-tight drop-shadow-sm">{project.title}</h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <div className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-stone-400" />
                      <span>{project.clientName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-stone-400" />
                      <span>{project.deadline}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                    <span className="text-stone-500">متراژ: <strong className="text-stone-800">{project.area} متر مربع</strong></span>
                    <span className="font-bold text-stone-900">{project.budget}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                  <button
                    onClick={() => setActiveDetailProject(project)}
                    className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>مشاهده جزئیات</span>
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(project.id)}
                    className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="حذف پروژه"
                    aria-label="حذف پروژه"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-2.5 py-1 rounded-lg">{activeDetailProject.style}</span>
                <h2 className="text-xl font-bold text-stone-900 mt-1">{activeDetailProject.title}</h2>
              </div>
              <button
                onClick={() => setActiveDetailProject(null)}
                className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors"
                aria-label="بستن"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative h-64 rounded-2xl overflow-hidden bg-stone-100">
              <img 
                src={activeDetailProject.image} 
                alt={activeDetailProject.title}
                className="w-full h-full object-cover"
                onError={(e)=>{(e.target as HTMLImageElement).src='/__l5e/assets-v1/37676bb5-fabf-42e6-97a0-a98cdbd1de16/prototype-workplace.jpg';}}
              />
              <div className="absolute top-3 start-3">
                {getStatusBadge(activeDetailProject.status)}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs">
              <div>
                <span className="text-stone-400 block mb-1">کارفرما</span>
                <strong className="text-stone-900 font-bold text-sm">{activeDetailProject.clientName}</strong>
              </div>
              <div>
                <span className="text-stone-400 block mb-1">متراژ</span>
                <strong className="text-stone-900 font-bold text-sm">{activeDetailProject.area} مترمربع</strong>
              </div>
              <div>
                <span className="text-stone-400 block mb-1">بودجه</span>
                <strong className="text-stone-900 font-bold text-sm">{activeDetailProject.budget}</strong>
              </div>
              <div>
                <span className="text-stone-400 block mb-1">تحویل</span>
                <strong className="text-stone-900 font-bold text-sm">{activeDetailProject.deadline}</strong>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-stone-900 mb-2">توضیحات و ایده طراحی</h3>
              <p className="text-sm text-stone-600 leading-relaxed bg-stone-50/50 p-4 rounded-2xl border border-stone-200">
                {activeDetailProject.description}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
              <button
                onClick={() => setActiveDetailProject(null)}
                className="px-5 py-2.5 bg-stone-900 text-white font-medium text-xs rounded-xl hover:bg-stone-800 transition-colors"
              >
                بستن پنجره
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-stone-200 p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">حذف پروژه</h3>
            <p className="text-xs text-stone-500">آیا از حذف این پروژه اطمینان دارید؟ این عمل غیرقابل بازگشت است.</p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors"
              >
                انصراف
              </button>
              <button
                onClick={() => {
                  onDeleteProject(deleteConfirmId);
                  setDeleteConfirmId(null);
                  showToast('پروژه با موفقیت حذف شد.');
                }}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-colors"
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
