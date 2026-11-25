export interface UserProfile {
  id: string;
  name: string;
  role: 'owner' | 'admin' | 'member';
  email: string;
  avatar: string;
  persona: 'sara' | 'arash' | 'other';
  title?: string;
}

export interface MaterialItem {
  id: string;
  name: string;
  category: 'wood' | 'fabric' | 'stone' | 'paint' | 'tile';
  code: string;
  imageUrl: string;
  colorHex: string;
  isIranianProduct: boolean;
}

export interface Project {
  id: string;
  title: string;
  clientName: string;
  style: string;
  status: 'active' | 'review' | 'completed' | 'draft';
  planImage: string;
  materials: MaterialItem[];
  budget: string;
  createdAt: string;
  description: string;
}

export interface RenderItem {
  id: string;
  projectId: string;
  title: string;
  imageUrl: string;
  style: string;
  date: string;
  likes: number;
  prompt: string;
  quality: 'HD' | '4K' | 'Draft';
}

export interface MoodboardItem {
  id: string;
  projectId: string;
  title: string;
  tag: string;
  imageUrl: string;
  colorHex: string;
  notes?: string;
}
