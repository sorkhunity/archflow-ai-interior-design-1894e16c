import React, { useState } from 'react';
import { Project, MoodboardItem } from '../types';
import { Plus, Trash2, Heart, Sparkles, Image as ImageIcon, Check, RefreshCw, X } from 'lucide-react';

interface MoodboardViewProps {
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  moodboardItems: MoodboardItem[];
  onAddMoodboardItem: (item: Omit<MoodboardItem, 'id'>) => void;
  onDeleteMoodboardItem: (id: string) => void;
}

const sampleImages = [
  { label: 'فضای کاری مدرن', url: '/__l5e/assets-v1/37676bb5-fabf-42e6-97a0-a98cdbd1de16/prototype-workplace.jpg' },
  { label: 'محیط مسکونی', url: '/__l5e/assets-v1/223c68d9-64db-4c3c-a572-34b853d2ec54/prototype-commerce.jpg' },
  { label: 'طبیعت و چوب', url: '/__l5e/assets-v1/68ceadfc-b580-4f18-8679-0088dddd218c/prototype-travel.jpg' },
  { label: 'دیزاین غذاخوری', url: '/__l5e/assets-v1/ee055612-0d60-456e-b148-d6c54a724bcf/prototype-food.jpg' },
];

export const MoodboardView: React.FC<MoodboardViewProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  moodboardItems,
  onAddMoodboardItem,
  onDeleteMoodboardItem,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('معماری داخلی');
  const [imageUrl, setImageUrl] = useState('/__l5e/assets-v1/37676bb5-fabf-42e6-97a0-a98cdbd1de16/prototype-workplace.jpg');
  const [colorHex, setColorHex] = useState('#8C6D53');
  const [notes, setNotes] = useState('');

  const currentProject = projects.find(p => p.id === activeProjectId) || projects[0];

  const filteredItems = moodboardItems.filter(item => {
    if (selectedTag === 'all') return true;
    return item.tag === selectedTag;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddMoodboardItem({
      projectId: currentProject?.id || '1',
      title,
      tag,
      imageUrl,
      colorHex,
      notes,
    });
    setTitle('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12" dir="rtl">
      {/* Header & Project Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">موس‌بورد تخصصی طراحی</h1>
          <p className="text-sm text-stone-500 mt-1">
            ترکیب رنگ‌ها، بافت‌ها و تصاویر الهام‌بخش پروژه {currentProject?.title}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={activeProjectId}
            onChange={(e) => onSelectProject(e.target.value)}
            aria-label="انتخاب پروژه"
            className="px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-600"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.title} ({p.clientName})</option>
            ))}
          </select>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>افزودن الهام‌بخش</span>
          </button>
        </div>
      </div>

      {/* Filter Tags */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['all', 'متریال', 'رنگ و پالت', 'نورپردازی', 'مبلمان'].map(t => (
          <button
            key={t}
            onClick={() => setSelectedTag(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap ${
              selectedTag === t
                .replace('all', 'all')
                .replace('متریال', 'متریال')
                .replace('رنگ و پالت', 'رنگ و پالت')
                .replace('نورپردازی', 'نورپردازی')
                .replace('مبلمان', 'مبلمان') && (selectedTag === t)
                ? 'bg-stone-900 text-white shadow-sm'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {t === 'all' ? 'همه موارد' : t}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-4">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-700">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">موردی در این دسته یافت نشد</h3>
          <p className="text-sm text-stone-500 max-w-md mx-auto">
            می‌توانید تصاویر، رنگ‌ها و متریال‌های الهام‌بخش جدیدی به موس‌بورد پروژه اضافه کنید.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 bg-amber-700 text-white font-medium rounded-xl hover:bg-amber-800 transition"
          >
            افزودن آیتم جدید
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div 
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition group flex flex-col"
            >
              <div className="relative h-56 overflow-hidden bg-stone-100">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-medium">
                  {item.tag}
                </div>
                {item.colorHex && (
                  <div 
                    className="absolute bottom-3 left-3 w-8 h-8 rounded-full border-2 border-white shadow-md"
                    style={{ backgroundColor: item.colorHex }}
                    title={`کد رنگ: ${item.colorHex}`}
                  />
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <h3 className="font-bold text-stone-900 text-lg">{item.title}</h3>
                  {item.notes && (
                    <p className="text-xs text-stone-500 leading-relaxed line-clamp-2">{item.notes}</p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                  <span className="text-xs text-stone-400 font-mono">شناسه: {item.id}</span>
                  <button
                    onClick={() => onDeleteMoodboardItem(item.id)}
                    className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                    title="حذف از موس‌بورد"
                    aria-label="حذف از موس‌بورد"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in duration-200"
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="افزودن آیتم جدید به موس‌بورد"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900">افزودن آیتم جدید به موس‌بورد</h3>
                  <p className="text-xs text-stone-500">تصویر، پالت رنگی یا ایده طراحی جدید</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100"
                aria-label="بستن"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">عنوان آیتم <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="مثال: سنگ مرمریت مهجام"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 text-stone-900"
                  required
                  autoFocus
                  maxLength={60}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">دسته‌بندی</label>
                  <select
                    value={tag}
                    onChange={e => setTag(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 text-stone-900"
                  >
                    <option value="معماری داخلی">معماری داخلی</option>
                    <option value="متریال">متریال</option>
                    <option value="رنگ و پالت">رنگ و پالت</option>
                    <option value="نورپردازی">نورپردازی</option>
                    <option value="مبلمان">مبلمان</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">رنگ شاخص</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={colorHex}
                      onChange={e => setColorHex(e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer border border-stone-200 p-0.5 bg-stone-50"
                    />
                    <input
                      type="text"
                      value={colorHex}
                      onChange={e => setColorHex(e.target.value)}
                      className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono uppercase text-stone-900"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">انتخاب تصویر نمونه</label>
                <div className="grid grid-cols-2 gap-2">
                  {sampleImages.map((img, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setImageUrl(img.url)}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-right transition text-xs ${
                        imageUrl === img.url
                          ? 'border-amber-600 bg-amber-50/50 text-amber-900 font-semibold'
                          : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <img src={img.url} alt={img.label} className="w-8 h-8 rounded-lg object-cover" />
                      <span className="truncate">{img.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">توضیحات و ایده طراحی</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="توضیحات کوتاه درباره کاربرد این متریال یا رنگ در پروژه..."
                  rows={3}
                  maxLength={200}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 text-stone-900 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 border border-stone-200 text-stone-700 hover:bg-stone-100 rounded-xl text-sm font-medium transition"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-sm font-medium transition shadow-sm"
                >
                  ثبت در موس‌بورد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
