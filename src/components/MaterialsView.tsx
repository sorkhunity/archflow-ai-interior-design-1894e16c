import React, { useState } from 'react';
import { 
  ShieldCheck, Search, Filter, Box, CheckCircle2, 
  ExternalLink, Sparkles, X, Layers, Check 
} from 'lucide-react';
import { MaterialItem } from '../types';

interface MaterialsViewProps {
  materials: MaterialItem[];
}

export const MaterialsView: React.FC<MaterialsViewProps> = ({ materials }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialItem | null>(null);

  const categories = [
    { id: 'all', label: 'همه مصالح' },
    { id: 'wood', label: 'چوب و MDF' },
    { id: 'stone', label: 'سنگ طبیعی' },
    { id: 'fabric', label: 'پارچه و الیاف' },
    { id: 'tile', label: 'کاشی و سرامیک' },
    { id: 'paint', label: 'رنگ و پوشش' },
  ];

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || m.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>بانک مصالح اصیل ایرانی</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">مصالح و متریال‌های بومی معماری</h1>
          <p className="text-sm text-stone-500">مجموعه تایید شده چوب بلوط، سنگ‌های معادن ایران، کاشی اصفهان و پارچه‌های یزد برای هوش مصنوعی.</p>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 px-4 py-2.5 rounded-2xl text-sm font-bold">
          <Sparkles className="w-4 h-4 text-amber-700" />
          <span>هماهنگ با هوش مصنوعی معماریا</span>
        </div>
      </div>

      {/* Search & Categories */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در نام متریال یا کد کالا..."
            className="w-full pr-12 pl-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                categoryFilter === cat.id
                  ? 'bg-amber-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Materials Grid */}
      {filteredMaterials.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center mx-auto text-xl font-bold">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">متریالی یافت نشد</h3>
          <p className="text-sm text-stone-500 max-w-md mx-auto">هیچ متریالی با این مشخصات در جستجوی شما پیدا نشد.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((mat) => (
            <div 
              key={mat.id} 
              onClick={() => setSelectedMaterial(mat)}
              className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group"
            >
              <div>
                <div className="relative h-52 overflow-hidden bg-stone-100">
                  <img
                    src={mat.imageUrl}
                    alt={mat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-stone-900 text-xs font-bold shadow-xs">
                      {mat.code}
                    </span>
                  </div>
                  {mat.isIranianProduct && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-amber-900 text-white text-xs font-bold shadow-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>تولید ملی ایران</span>
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-stone-900">{mat.name}</h3>
                    <div 
                      className="w-6 h-6 rounded-full border border-stone-300 shadow-xs shrink-0" 
                      style={{ backgroundColor: mat.colorHex }}
                      title={`کد رنگ: ${mat.colorHex}`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
                    <span>دسته‌بندی: <strong className="text-stone-800">{mat.category}</strong></span>
                    <span className="text-amber-800 font-medium">مشاهده جزئیات متریال</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Material Detail Modal */}
      {selectedMaterial && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedMaterial(null)}
              className="absolute left-6 top-6 p-2 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="rounded-2xl overflow-hidden h-64 bg-stone-100 border border-stone-200">
              <img src={selectedMaterial.imageUrl} alt={selectedMaterial.name} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full">
                  کد کالا: {selectedMaterial.code}
                </span>
                {selectedMaterial.isIranianProduct && (
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>تولید اصیل ایران</span>
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-extrabold text-stone-900">{selectedMaterial.name}</h2>
            </div>

            <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-100 text-sm text-stone-600">
              <div className="flex items-center justify-between">
                <span className="text-stone-400">دسته‌بندی تخصصی:</span>
                <span className="font-bold text-stone-800">{selectedMaterial.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400">کد رنگ پایه:</span>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border border-stone-300" style={{ backgroundColor: selectedMaterial.colorHex }} />
                  <span className="font-mono font-bold text-stone-800">{selectedMaterial.colorHex}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedMaterial(null)}
                className="px-6 py-2.5 rounded-xl bg-stone-900 text-white text-sm font-bold w-full sm:w-auto"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
