import React, { useState, useEffect } from 'react';
import { X, Sparkles, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { RenderItem } from '../types';

interface AiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRender: (render: RenderItem) => void;
}

export default function AiModal({ isOpen, onClose, onAddRender }: AiModalProps) {
  const [prompt, setPrompt] = useState('طراحی اتاق نشیمن مدرن با چوب بلوط ایرانی و نور طبیعی ملایم');
  const [roomType, setRoomType] = useState('نشیمن');
  const [style, setStyle] = useState('مدرن گرم ایرانی');
  const [isGenerating, setIsGenerating] = useState(false);
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

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setErrorMsg('لطفاً پرامپت رندر را وارد کنید.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);

    try {
      await new Promise(r => setTimeout(r, 2000));
      const newRnd: RenderItem = {
        id: `rnd-${Date.now()}`,
        projectId: 'proj-1',
        title: `${roomType} ${style}`,
        imageUrl: '/__l5e/assets-v1/37676bb5-fabf-42e6-97a0-a98cdbd1de16/prototype-workplace.jpg',
        style: style,
        date: new Date().toLocaleDateString('fa-IR'),
        likes: 1,
        prompt: prompt,
        quality: 'HD'
      };

      onAddRender(newRnd);
      onClose();
    } catch (err) {
      setErrorMsg('خطا در تولید هوش مصنوعی. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsGenerating(false);
    }
  };

  const suggestions = [
    'نشیمن با شومینه سنگ تراورتن و چوب بلوط',
    'آشپزخانه مینیمال با کاشی فیروزه‌ای سنتی',
    'اتاق خواب دنج با پارچه کتان یزد و نور ملایم'
  ];

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="ai-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90dvh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 bg-amber-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 id="ai-modal-title" className="text-lg font-extrabold text-stone-900">طراح هوشمند سریع AI</h2>
              <p className="text-xs text-stone-500">تولید فوری رندر سه‌بعدی با هوش مصنوعی معماریا</p>
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

        <form onSubmit={handleGenerate} className="p-6 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="ai-room" className="block text-xs font-bold text-stone-700">نوع فضا</label>
              <select
                id="ai-room"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full px-3 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-white"
              >
                <option value="نشیمن">نشیمن و پذیرایی</option>
                <option value="آشپزخانه">آشپزخانه</option>
                <option value="اتاق خواب">اتاق خواب اصلی</option>
                <option value="دفتر کار">دفتر کار خانگی</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="ai-style" className="block text-xs font-bold text-stone-700">سبک معماری</label>
              <select
                id="ai-style"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-3 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-white"
              >
                <option value="مدرن گرم ایرانی">مدرن گرم ایرانی</option>
                <option value="مینیمال گرم با مصالح بومی">مینیمال گرم با مصالح بومی</option>
                <option value="سنتی معاصر">سنتی معاصر</option>
                <option value="صنعتی ایرانی">صنعتی ایرانی</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="ai-prompt" className="block text-xs font-bold text-stone-700">توصیف پرامپت طراحی *</label>
            <textarea
              id="ai-prompt"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
              placeholder="جزئیات متریال، نورپردازی، رنگ‌ها و مبلمان..."
              className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm resize-none"
            />
          </div>

          <div className="space-y-2">
            <span className="block text-xs font-bold text-stone-500">پیشنهادهای آماده:</span>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(s)}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-medium transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
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
              disabled={isGenerating}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold shadow-md shadow-amber-600/30 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>در حال رندر هوش مصنوعی...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>تولید رندر سه‌بعدی</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
