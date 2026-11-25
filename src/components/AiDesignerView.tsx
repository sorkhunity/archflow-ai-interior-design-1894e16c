import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertCircle, RefreshCw, Layers, ThumbsUp } from 'lucide-react';
import { RenderItem } from '../types';

interface AiDesignerViewProps {
  renders: RenderItem[];
  onAddRender: (newRender: RenderItem) => void;
}

export const AiDesignerView: React.FC<AiDesignerViewProps> = ({ renders, onAddRender }) => {
  const [prompt, setPrompt] = useState('طراحی اتاق نشیمن مدرن با چوب بلوط ایرانی و نور طبیعی ملایم');
  const [roomType, setRoomType] = useState('نشیمن');
  const [style, setStyle] = useState('مدرن گرم ایرانی');
  const [quality, setQuality] = useState<'HD' | '4K' | 'Draft'>('HD');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setErrorMsg('لطفاً پرامپت طراحی را وارد کنید.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // Simulate AI generation delay
      await new Promise((r) => setTimeout(r, 2200));

      const newRender: RenderItem = {
        id: `rnd-${Date.now()}`,
        projectId: 'proj-1',
        title: `${roomType} ${style}`,
        imageUrl: '/__l5e/assets-v1/37676bb5-fabf-42e6-97a0-a98cdbd1de16/prototype-workplace.jpg',
        style: style,
        date: new Date().toLocaleDateString('fa-IR'),
        likes: 1,
        prompt: prompt,
        quality: quality
      };

      onAddRender(newRender);
      setSuccessMsg('رندر هوش مصنوعی با موفقیت تولید شد و به گالری افزوده شد.');
    } catch (err: any) {
      setErrorMsg('خطا در تولید تصویر هوش مصنوعی. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>AI Interior Generator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">طراح هوشمند داخلی معماریا</h1>
          <p className="text-sm text-stone-500">متریال‌های ایرانی و سبک دلخواه خود را توصیف کنید تا رندر سه‌بعدی حرفه‌ای دریافت کنید.</p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Generator Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-stone-900">تنظیمات پرامپت و رندر</h2>

          <form onSubmit={handleGenerate} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="ai-room-type" className="block text-xs font-bold text-stone-700">نوع فضا</label>
              <select
                id="ai-room-type"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-amber-600 text-stone-900 text-sm font-medium"
              >
                <option value="نشیمن">اتاق نشیمن و پذیرایی</option>
                <option value="آشپزخانه">آشپزخانه مدرن ایرانی</option>
                <option value="اتاق خواب">اتاق خواب مستر</option>
                <option value="دفتر کار">دفتر کار خانگی</option>
                <option value="لابی">لابی ساختمان مسکونی</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="ai-style-select" className="block text-xs font-bold text-stone-700">سبک معماری</label>
              <select
                id="ai-style-select"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-amber-600 text-stone-900 text-sm font-medium"
              >
                <option value="مدرن گرم ایرانی">مدرن گرم ایرانی (با چوب و آجر)</option>
                <option value="سنتی لوکس">سنتی لوکس (کاشی فیروزه‌ای و گچ‌بری)</option>
                <option value="مینیمال اسکاندیناوی">مینیمال گرم</option>
                <option value="کلاسیک ایرانی">کلاسیک اصیل</option>
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="ai-prompt-input" className="block text-xs font-bold text-stone-700">شرح جزئیات فضا (پرامپت)</label>
                <span className="text-xs text-stone-400">{prompt.length}/300</span>
              </div>
              <textarea
                id="ai-prompt-input"
                rows={4}
                maxLength={300}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="توصیف جزئیات نور، رنگ، متریال..."
                className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-amber-600 text-stone-900 text-sm font-medium resize-none"
              ></textarea>
            </div>

            <div className="space-y-2">
              <label htmlFor="ai-quality-select" className="block text-xs font-bold text-stone-700">کیفیت رندر</label>
              <select
                id="ai-quality-select"
                value={quality}
                onChange={(e) => setQuality(e.target.value as any)}
                className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-amber-600 text-stone-900 text-sm font-medium"
              >
                <option value="HD">کیفیت HD (سریع)</option>
                <option value="4K">کیفیت فوق‌العاده 4K (ویژه ارائه)</option>
                <option value="Draft">پیش‌نویس سریع</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-4 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>درحال پردازش هوش مصنوعی...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>تولید رندر هوشمند</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results preview area */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-stone-900">گالری خروجی‌های هوش مصنوعی</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {renders.map((item) => (
              <div key={item.id} className="group rounded-2xl overflow-hidden border border-stone-200 bg-stone-50 shadow-xs space-y-3 pb-4">
                <div className="relative h-48 overflow-hidden">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 end-3 px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-white text-xs font-semibold">
                    {item.quality}
                  </span>
                </div>
                <div className="px-4 space-y-1">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span className="text-amber-800 font-semibold">{item.style}</span>
                    <span>{item.date}</span>
                  </div>
                  <h3 className="font-bold text-stone-900">{item.title}</h3>
                  <p className="text-xs text-stone-500 line-clamp-2">{item.prompt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
