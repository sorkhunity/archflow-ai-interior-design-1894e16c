import React, { useState, useEffect } from 'react';
import { 
  Home, Sparkles, Box, Layout, ShieldCheck, 
  Plus, CheckCircle2, AlertCircle, X, Check, Eye 
} from 'lucide-react';
import { Project, MaterialItem, RenderItem, UserProfile, MoodboardItem } from './types';
import { MOCK_USERS, MOCK_PROJECTS, MOCK_MATERIALS, MOCK_RENDERS } from './data/mockData';

import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { AiDesignerView } from './components/AiDesignerView';
import { MoodboardView } from './components/MoodboardView';
import { ProjectsView } from './components/ProjectsView';
import { MaterialsView } from './components/MaterialsView';
import NewProjectModal from './components/NewProjectModal';
import AiModal from './components/AiModal';

const MOCK_MOODBOARD_INITIAL: MoodboardItem[] = [
  {
    id: 'm1',
    projectId: 'proj-1',
    title: 'چوب بلوط طبیعی',
    tag: 'متریال',
    imageUrl: '/__l5e/assets-v1/68ceadfc-b580-4f18-8679-0088dddd218c/prototype-travel.jpg',
    colorHex: '#C8A278',
    notes: 'گرم و مناسب برای کفپوش و دیوارپوش پذیرایی'
  },
  {
    id: 'm2',
    projectId: 'proj-1',
    title: 'پالت رنگی گرم و خنثی',
    tag: 'رنگ و پالت',
    imageUrl: '/__l5e/assets-v1/37676bb5-fabf-42e6-97a0-a98cdbd1de16/prototype-workplace.jpg',
    colorHex: '#8C6D53',
    notes: 'ترکیب بژ، کرم و قهوه‌ای سوخته'
  },
  {
    id: 'm3',
    projectId: 'proj-2',
    title: 'نورپردازی خطی مخفی',
    tag: 'نورپردازی',
    imageUrl: '/__l5e/assets-v1/223c68d9-64db-4c3c-a572-34b853d2ec54/prototype-commerce.jpg',
    colorHex: '#F5EBE6',
    notes: 'دمای رنگ 3000 کلوین ملایم'
  }
];

export default function App() {
  const [currentUser] = useState<UserProfile>(MOCK_USERS[0]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ai_designer' | 'moodboard' | 'projects' | 'materials'>('dashboard');
  
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [materials] = useState<MaterialItem[]>(MOCK_MATERIALS);
  const [renders, setRenders] = useState<RenderItem[]>(MOCK_RENDERS);
  const [moodboardItems, setMoodboardItems] = useState<MoodboardItem[]>(MOCK_MOODBOARD_INITIAL);
  const [activeProjectId, setActiveProjectId] = useState<string>(MOCK_PROJECTS[0]?.id || 'proj-1');
  
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

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

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleAddProject = (newProj: Project) => {
    setProjects(prev => [newProj, ...prev]);
    setActiveProjectId(newProj.id);
    showToast('پروژه جدید با موفقیت ایجاد شد.');
  };

  const handleDeleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    showToast('پروژه با موفقیت حذف شد.');
  };

  const handleAddRender = (newRender: RenderItem) => {
    setRenders(prev => [newRender, ...prev]);
    showToast('رندر هوش مصنوعی با موفقیت ذخیره شد.');
  };

  const handleAddMoodboardItem = (itemData: Omit<MoodboardItem, 'id'>) => {
    const newItem: MoodboardItem = {
      ...itemData,
      id: `mb-${Date.now()}`
    };
    setMoodboardItems(prev => [newItem, ...prev]);
    showToast('آیتم جدید به مادبورد افزوده شد.');
  };

  const handleDeleteMoodboardItem = (id: string) => {
    setMoodboardItems(prev => prev.filter(i => i.id !== id));
    showToast('آیتم از مادبورد حذف شد.');
  };

  return (
    <div className="min-h-dvh bg-stone-100 text-stone-900 font-sans flex flex-col selection:bg-amber-500 selection:text-white" dir="rtl">
      
      {successToast && (
        <div className="fixed bottom-6 start-6 z-50 bg-stone-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl text-sm flex items-center gap-3 animate-fadeIn border border-stone-800">
          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      <Navbar
        activeTab={activeTab}
        setActiveTab={changeTab}
        currentUser={currentUser}
        onOpenNewProject={() => setIsNewProjectModalOpen(true)}
        onOpenAiDesigner={() => setIsAiModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            currentUser={currentUser}
            projects={projects}
            renders={renders}
            materials={materials}
            setActiveTab={changeTab}
            onOpenNewProject={() => setIsNewProjectModalOpen(true)}
            onOpenAiDesigner={() => setIsAiModalOpen(true)}
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
            projects={projects}
            activeProjectId={activeProjectId}
            onSelectProject={setActiveProjectId}
            moodboardItems={moodboardItems}
            onAddMoodboardItem={handleAddMoodboardItem}
            onDeleteMoodboardItem={handleDeleteMoodboardItem}
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

      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onAddProject={handleAddProject}
        materials={materials}
      />

      <AiModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onAddRender={handleAddRender}
      />

      <footer className="bg-white border-t border-stone-200 py-8 text-center text-xs text-stone-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© ۱۴۰۳ معماریا — سامانه هوشمند طراحی داخلی و معماری ایرانی.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-stone-900 cursor-pointer" onClick={() => changeTab('materials')}>بانک مصالح</span>
            <span className="hover:text-stone-900 cursor-pointer" onClick={() => changeTab('ai_designer')}>هوش مصنوعی</span>
            <span className="hover:text-stone-900 cursor-pointer" onClick={() => changeTab('projects')}>پروژه‌ها</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
