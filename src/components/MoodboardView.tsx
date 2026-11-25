import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Search, Filter, Sliders, ExternalLink, Download, Check, Eye, X, AlertCircle } from 'lucide-react';
import { RenderItem } from '../types';

interface MoodboardViewProps {
  renders: RenderItem[];
  onToggleLike: (renderId: string) => void;
  onOpenAiDesigner: () => void;
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

export const MoodboardView: React.FC<MoodboardViewProps> = ({ renders, onToggleLike, onOpenAiDesigner }) => {
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [activeModalRender, setActiveModalRender] = useState<RenderItem | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeModalRender) setActiveModalRender(null);
        if (compareMode && compareIds.length > 0) setCompareIds([]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalRender, compareMode, compareIds]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const styles = ['all', 'مدرن گرم ایرانی', 'مینیمال گرم با مصالح بومی', 'صنعتی ایرانی', 'سنتی معاصر'];

  const filteredRenders = renders.filter(r => {
    const matchesStyle = selectedStyle === 'all' || r.style.includes(selectedStyle) || selectedStyle.includes(r.style);
    const norm = normaliseText(debouncedSearch);
    const matchesSearch = !norm || normaliseText(r.title).includes(norm) || normaliseText(r.prompt).includes(norm);
    return matchesStyle && matchesSearch;
  });

  const toggleCompareSelect = (id: string) => {
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter(i => i !== id));
    } else {
      if (compareIds.length >= 2) {
        setCompareIds([compareIds[1], id]);
      } else {
        setCompareIds([...compareIds, id]);
      }
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
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>گالری الهام و رندرهای هوش مصنوعی</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">مادبورد و رندرهای معماری ایرانی</h1>
          <p className="text-sm text-stone-500">مجموعه تصاویر تولید شده با هوش مصنوعی معماریا الهام گرفته از معماری اصیل ایرانی</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setCompareMode(!compareMode);
              if (compareMode) setCompareIds([]);
            }}
            className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              compareMode ? 'bg-amber-600 text-white shadow-md' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{compareMode ? 'خروج از مقایسه' : 'مقایسه رندرها'}</span>
          </button>
          
          <button
            onClick={onOpenAiDesigner}
            className="px-5 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>رندر جدید با هوش مصنوعی</span>
          </button>
        </div>
      </div>

      {/* Search & Style Filter */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-stone-200">
        <div className="relative flex-1">
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input
            type="text"
            placeholder="جستجوی عنوان رندر یا پرامپت (با تطبیق حروف فارسی)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full ps-12 pe-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all text-stone-900 placeholder:text-stone-400"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
          <Filter className="w-4 h-4 text-stone-400 shrink-0 ms-1 me-2 hidden sm:block" />
          {styles.map(sty => (
            <button
              key={sty}
              onClick={() => setSelectedStyle(sty)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedStyle === sty ? 'bg-amber-600 text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {sty === 'all' ? 'همه سبک‌ها' : sty}
            </button>
          ))}
        </div>
      </div>

      {/* Compare Notice */}
      {compareMode && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between text-amber-900 text-xs font-bold">
          <span>لطفاً دو رندر را برای مقایسه کنار هم انتخاب کنید ({compareIds.length}/2)</span>
          {compareIds.length === 2 && (
            <span className="bg-amber-600 text-white px-3 py-1 rounded-xl">آماده مقایسه جانبی</span>
          )}
        </div>
      )}

      {/* Renders Grid */}
      {filteredRenders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-4">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-800">رندری یافت نشد</h3>
          <p className="text-sm text-stone-500 max-w-sm mx-auto">با عبارت جستجو یا سبک انتخابی رندری مطابقت نداشت.</p>
          <button
            onClick={() => { setSelectedStyle('all'); setSearchQuery(''); }}
            className="px-5 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-sm"
          >
            مشاهده همه رندرها
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRenders.map(render => {
            const isSelectedForCompare = compareIds.includes(render.id);
            return (
              <div 
                key={render.id}
                className={`bg-white rounded-3xl border overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                  isSelectedForCompare ? 'border-amber-500 ring-2 ring-amber-400/50' : 'border-stone-200'
                }`}
              >
                <div className="relative aspect-video bg-stone-100 overflow-hidden group">
                  <img 
                    src={render.imageUrl} 
                    alt={render.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  <div className="absolute top-3 start-3">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold border border-white/20">
                      {render.quality}
                    </span>
                  </div>

                  {compareMode ? (
                    <button
                      onClick={() => toggleCompareSelect(render.id)}
                      className={`absolute top-3 end-3 px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-md transition-all flex items-center gap-1.5 ${
                        isSelectedForCompare ? 'bg-amber-600 text-white' : 'bg-white/80 hover:bg-white text-stone-800'
                      }`}
                    >
                      <Check className={`w-3.5 h-3.5 ${isSelectedForCompare ? 'opacity-100' : 'opacity-0'}`} />
                      <span>{isSelectedForCompare ? 'انتخاب شده' : 'انتخاب مقایسه'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        onToggleLike(render.id);
                        showToast('وضعیت پسندیدن رندر به‌روز شد.');
                      }}
                      className={`absolute top-3 end-3 w-9 h-9 rounded-xl backdrop-blur-md flex items-center justify-center transition-all ${
                        render.likes > 0 ? 'bg-rose-500 text-white' : 'bg-black/40 text-white hover:bg-black/60'
                      }`}
                      aria-label="پسندیدن"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  )}
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span className="text-amber-700 font-semibold">{render.style}</span>
                      <span>{render.date}</span>
                    </div>
                    <h3 className="font-extrabold text-stone-900 text-lg">{render.title}</h3>
                    <p className="text-xs text-stone-500 line-clamp-2 bg-stone-50 p-3 rounded-xl border border-stone-100">
                      «{render.prompt}»
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <button
                      onClick={() => setActiveModalRender(render)}
                      className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Eye className="w-4 h-4" />
                      <span>مشاهده در اندازه کامل</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Compare Modal side-by-side if 2 selected */}
      {compareMode && compareIds.length === 2 && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-stone-900">مقایسه دو رندر معماری</h2>
              <button
                onClick={() => setCompareIds([])}
                className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700"
                aria-label="بستن"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {compareIds.map(id => {
                const item = renders.find(r => r.id === id);
                if (!item) return null;
                return (
                  <div key={item.id} className="space-y-4 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <img src={item.imageUrl} alt={item.title} className="w-full aspect-video object-cover rounded-xl" />
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-amber-700">{item.style}</span>
                      <h4 className="font-extrabold text-stone-900 text-base">{item.title}</h4>
                      <p className="text-xs text-stone-500">{item.prompt}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setCompareIds([])}
                className="px-6 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs"
              >
                بستن مقایسه
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Single Full View Modal */}
      {activeModalRender && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveModalRender(null)}
          role="dialog"
          aria-modal="true"
          aria-label="مشاهده رندر"
        >
          <div 
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video bg-black">
              <img src={activeModalRender.imageUrl} alt={activeModalRender.title} className="w-full h-full object-contain" />
              <button
                onClick={() => setActiveModalRender(null)}
                className="absolute top-4 start-4 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 backdrop-blur-md transition-all"
                aria-label="بستن"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-4 overflow-y-auto">
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-700">{activeModalRender.style}</span>
                <h2 className="text-2xl font-extrabold text-stone-900">{activeModalRender.title}</h2>
              </div>
              
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                <span className="text-xs font-bold text-stone-500">پرامپت هوش مصنوعی:</span>
                <p className="text-sm text-stone-700">«{activeModalRender.prompt}»</p>
              </div>

              <div className="flex items-center justify-end pt-4 border-t border-stone-100">
                <button
                  onClick={() => setActiveModalRender(null)}
                  className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs"
                >
                  بستن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
