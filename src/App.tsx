import React, { useState, useEffect } from 'react';
import { 
  Home, Sparkles, Box, Layout, ShieldCheck, 
  Plus, CheckCircle2, AlertCircle, X, Check, Eye 
} from 'lucide-react';
import { Project, MaterialItem, RenderItem, UserProfile } from './types';
import { MOCK_USERS, MOCK_PROJECTS, MOCK_MATERIALS, MOCK_RENDERS } from './data/mockData';

// Subcomponents with named exports
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { AiDesignerView } from './components/AiDesignerView';
import { MoodboardView } from './components/MoodboardView';
import { ProjectsView } from './components/ProjectsView';
import { MaterialsView } from './components/MaterialsView';
import { NewProjectModal } from './components/NewProjectModal';
import { AiModal } from './components/AiModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(MOCK_USERS[0]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ai_designer' | 'moodboard' | 'projects' | 'materials'>('dashboard');
  
  // Database / state collections
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [materials, setMaterials] = useState<MaterialItem[]>(MOCK_MATERIALS);
  const [renders, setRenders] = useState<RenderItem[]>(MOCK_RENDERS);
  
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Modals
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // URL hash sync
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      if (['dashboard', 'ai_designer', 'moodboard', 'projects', 'materials'].includes(hash)) {
        setActiveTab(hash as any);
      }
    };

    if (window.location.hash) {
      handleHashChange();
    } else {
      window.location.hash = '#/dashboard';
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const changeTab = (tab: any) => {
    setActiveTab(tab);
    window.location.hash = `#/${tab}`;
  };

  useEffect(() => {
    document.title = 'معماریا | سامانه هوشمند طراحی داخلی و معماری';
  }, []);

  const handleAddProject = (newProj: Project) => {
    setProjects(prev => [newProj, ...prev]);
    setSuccessToast('پروژه جدید با موفقیت ایجاد شد.');
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    setSuccessToast('پروژه با موفقیت حذف شد.');
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleAddRender = (newRnd: RenderItem) => {
    setRenders(prev => [newRnd, ...prev]);
    setSuccessToast('رندر هوش مصنوعی با موفقیت ذخیره شد.');
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleToggleLike = (renderId: string) => {
    setRenders(prev => prev.map(r => r.id === renderId ? { ...r, likes: r.likes + 1 } : r));
    setSuccessToast('به‌عنوان طرح برگزیده نشان‌گذاری شد.');
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="min-h-dvh bg-stone-50 text-stone-800 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-900" dir="rtl">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 left-6 z-50 bg-stone-900 text-white px-5 py-3.5 rounded-2xl shadow-xl border border-stone-800 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="text-sm font-medium">{successToast}</span>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={changeTab}
        currentUser={currentUser}
        onOpenNewProject={() => setIsNewProjectModalOpen(true)}
        onOpenAiDesigner={() => changeTab('ai_designer')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            currentUser={currentUser}
            projects={projects}
            renders={renders}
            materials={materials}
            setActiveTab={changeTab}
            onOpenNewProject={() => setIsNewProjectModalOpen(true)}
            onOpenAiDesigner={() => changeTab('ai_designer')}
          />
        )}

        {activeTab === 'ai_designer' && (
          <AiDesignerView
            renders={renders}
            onAddRender={handleAddRender}
          />
        )}

        {activeTab === 'moodboard' && (
          <MoodboardView
            renders={renders}
            onToggleLike={handleToggleLike}
            onOpenAiDesigner={() => changeTab('ai_designer')}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsView
            projects={projects}
            materials={materials}
            onAddProject={handleAddProject}
            onDeleteProject={handleDeleteProject}
            onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
          />
        )}

        {activeTab === 'materials' && (
          <MaterialsView
            materials={materials}
          />
        )}
      </main>

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onAddProject={handleAddProject}
        materials={materials}
      />

      {/* AI Modal Assistant */}
      <AiModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onAddRender={handleAddRender}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800">معماریا (Archflow)</span>
            <span>© ۱۴۰۳ تمامی حقوق محفوظ است.</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => changeTab('materials')} className="hover:text-stone-800">بانک مصالح</button>
            <button onClick={() => changeTab('moodboard')} className="hover:text-stone-800">مادبورد</button>
            <button onClick={() => changeTab('ai_designer')} className="hover:text-stone-800">طراح هوشمند</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
