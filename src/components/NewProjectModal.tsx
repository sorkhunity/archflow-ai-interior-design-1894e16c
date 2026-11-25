import React, { useState, useEffect } from 'react';
import { X, Layout, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Project, MaterialItem } from '../types';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (project: Project) => void;
  materials: MaterialItem[];
}

export default function NewProjectModal({
  isOpen,
  onClose,
  onAddProject,
  materials
}: NewProjectModalProps) {
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [style, setStyle] = useState('مدرن ایرانی معاصر');
  const [budget, setBudget] = useState('۱,۲۰۰,۰۰۰,۰۰۰ تومان');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('لطفاً عنوان پروژه را وارد کنید.');
      return;
    }

    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: title.trim(),
      clientName: clientName.trim() || 'مشتری گرامی',
      style: style,
      status: 'active',
      planImage: '/__l5e/assets-v1/37676bb5-fabf-42e6-97a0-a98cdbd1de16/prototype-workplace.jpg',
      materials: materials.slice(0, 3),
      budget: budget || '۱,۰۰۰,۰۰۰,۰۰۰ تومان',
      createdAt: new Date().toLocaleDateString('fa-IR'),
      description: description.trim() || 'پروژه جدید طراحی داخلی و بازسازی با هوش مصنوعی معماریا.'
    };

    onAddProject(newProj);
    setTitle('');
    setClientName('');
    setDescription('');
    setErrorMsg(null);
    onClose();
  };

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="new-project-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90dvh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 bg-stone-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-stone-900 text-white flex items-center justify-center shadow-md">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <h2 id="new-project-modal-title" className="text-lg font-extrabold text-stone-900">ایجاد پروژه جدید</h2>
              <p className="text-xs text-stone-500">ثبت اطلاعات بازسازی و طراحی داخلی در سامانه</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            aria-label="بستن پنجره"
            className="w-9 h-9 rounded-full bg-stone-200/60 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="proj-title" className="block text-xs font-bold text-stone-700">عنوان پروژه *</label>
            <input
              id="proj-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="مثلا: بازسازی پنتهاوس زعفرانیه"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="proj-client" className="block text-xs font-bold text-stone-700">نام کارفرما</label>
              <input
                id="proj-client"
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="مثلا: دکتر مهدوی"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="proj-budget" className="block text-xs font-bold text-stone-700">برآورد بودجه</label>
              <input
                id="proj-budget"
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="مثلا: ۱,۵۰۰,۰۰۰,۰۰۰ تومان"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="proj-style" className="block text-xs font-bold text-stone-700">سبک طراحی</label>
            <select
              id="proj-style"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full px-3 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-white"
            >
              <option value="مدرن ایرانی معاصر">مدرن ایرانی معاصر</option>
              <option value="مینیمال گرم با مصالح بومی">مینیمال گرم با مصالح بومی</option>
              <option value="سنتی معاصر">سنتی معاصر</option>
              <option value="صنعتی ایرانی">صنعتی ایرانی</option>
            </select>
          </div>

          <div className="space-y-1">
            <label htmlFor="proj-desc" className="block text-xs font-bold text-stone-700">توضیحات و اهداف بازسازی</label>
            <textarea
              id="proj-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="شرح جزئیات فضاها، انتظارات کارفرما..."
              className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-sm font-medium transition-all"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-950 text-white text-sm font-bold shadow-md shadow-amber-900/25 transition-all"
            >
              ثبت و ایجاد پروژه
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
