import { UserProfile, Project, RenderItem, MaterialItem } from '../types';

export const MOCK_USERS: UserProfile[] = [
  {
    id: 'usr-sara',
    name: 'سارا رضایی',
    role: 'owner',
    email: 'sara.rezaei@example.com',
    avatar: '/__l5e/assets-v1/37676bb5-fabf-42e6-97a0-a98cdbd1de16/prototype-workplace.jpg',
    persona: 'sara',
    title: 'صاحبخانه و طراح بازسازی'
  },
  {
    id: 'usr-arash',
    name: 'آرش کیانی',
    role: 'admin',
    email: 'arash.kiani@archflow.ir',
    avatar: '/__l5e/assets-v1/d020c4ee-6d67-45a9-9b78-5888ba632b03/prototype-gaming.jpg',
    persona: 'arash',
    title: 'معمار و طراح ارشد داخلی'
  }
];

export const MOCK_MATERIALS: MaterialItem[] = [
  {
    id: 'mat-1',
    name: 'چوب بلوط ایرانی',
    category: 'wood',
    code: 'IR-WD-104',
    imageUrl: '/__l5e/assets-v1/68ceadfc-b580-4f18-8679-0088dddd218c/prototype-travel.jpg',
    colorHex: '#8C6D53',
    isIranianProduct: true
  },
  {
    id: 'mat-2',
    name: 'سنگ تراورتن کاشان',
    category: 'stone',
    code: 'IR-ST-202',
    imageUrl: '/__l5e/assets-v1/37676bb5-fabf-42e6-97a0-a98cdbd1de16/prototype-workplace.jpg',
    colorHex: '#D9C5B2',
    isIranianProduct: true
  },
  {
    id: 'mat-3',
    name: 'پارچه کتان یزد (خاکی گرم)',
    category: 'fabric',
    code: 'IR-FB-305',
    imageUrl: '/__l5e/assets-v1/ee055612-0d60-456e-b148-d6c54a724bcf/prototype-food.jpg',
    colorHex: '#F4EDE2',
    isIranianProduct: true
  },
  {
    id: 'mat-4',
    name: 'کاشی سنتی فیروزه‌ای اصفهان',
    category: 'tile',
    code: 'IR-TL-401',
    imageUrl: '/__l5e/assets-v1/459d47c5-f16d-4fab-a010-5ab0d6e5f8eb/prototype-education.jpg',
    colorHex: '#2E6F7F',
    isIranianProduct: true
  },
  {
    id: 'mat-5',
    name: 'رنگ اکریلیک سفالی مات',
    category: 'paint',
    code: 'IR-PT-508',
    imageUrl: '/__l5e/assets-v1/223c68d9-64db-4c3c-a572-34b853d2ec54/prototype-commerce.jpg',
    colorHex: '#B87355',
    isIranianProduct: true
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'بازسازی آپارتمان الهیه',
    clientName: 'دکتر علوی',
    style: 'مدرن ایرانی معاصر',
    status: 'active',
    planImage: '/__l5e/assets-v1/37676bb5-fabf-42e6-97a0-a98cdbd1de16/prototype-workplace.jpg',
    materials: [MOCK_MATERIALS[0], MOCK_MATERIALS[1], MOCK_MATERIALS[3]],
    budget: '۱,۴۵۰,۰۰۰,۰۰۰ تومان',
    createdAt: '۱۴۰۲/۱۲/۱۵',
    description: 'بازسازی کامل سالن پذیرایی و آشپزخانه با تلفیق چوب بلوط و کاشی فیروزه ای سنتی.'
  },
  {
    id: 'proj-2',
    title: 'طراحی داخلی ویلای لواسان',
    clientName: 'مهندس تهرانی',
    style: 'مینیمال گرم با مصالح بومی',
    status: 'review',
    planImage: '/__l5e/assets-v1/68ceadfc-b580-4f18-8679-0088dddd218c/prototype-travel.jpg',
    materials: [MOCK_MATERIALS[1], MOCK_MATERIALS[2], MOCK_MATERIALS[4]],
    budget: '۲,۸۰۰,۰۰۰,۰۰۰ تومان',
    createdAt: '۱۴۰۳/۰۱/۱۰',
    description: 'طراحی فضای نشیمن و شومینه با سنگ تراورتن کاشان و رنگ های خاکی.'
  },
  {
    id: 'proj-3',
    title: 'دفتر کار استارتاپی خیابان وزرا',
    clientName: 'شرکت فناوران نوین',
    status: 'completed',
    style: 'صنعتی ایرانی',
    planImage: '/__l5e/assets-v1/223c68d9-64db-4c3c-a572-34b853d2ec54/prototype-commerce.jpg',
    materials: [MOCK_MATERIALS[0], MOCK_MATERIALS[4]],
    budget: '۹۵۰,۰۰۰,۰۰۰ تومان',
    createdAt: '۱۴۰۲/۱۱/۲۰',
    description: 'فضای کار اشتراکی با میزهای چوب بلوط و دیوارهای آجری و سفالی.'
  }
];

export const MOCK_RENDERS: RenderItem[] = [
  {
    id: 'rnd-1',
    projectId: 'proj-1',
    title: 'نشیمن مدرن با چوب بلوط',
    imageUrl: '/__l5e/assets-v1/37676bb5-fabf-42e6-97a0-a98cdbd1de16/prototype-workplace.jpg',
    style: 'مدرن گرم ایرانی',
    date: '۱۴۰۳/۰۱/۱۵',
    likes: 12,
    prompt: 'اتاق نشیمن روشن با نور طبیعی و چوب بلوط طبیعی ایرانی',
    quality: 'HD'
  },
  {
    id: 'rnd-2',
    projectId: 'proj-2',
    title: 'شومینه سنگ تراورتن',
    imageUrl: '/__l5e/assets-v1/68ceadfc-b580-4f18-8679-0088dddd218c/prototype-travel.jpg',
    style: 'مینیمال گرم با مصالح بومی',
    date: '۱۴۰۳/۰۱/۱۸',
    likes: 24,
    prompt: 'طراحی شومینه مدرن با سنگ تراورتن کاشان و دیوارهای کرم خاکی',
    quality: '4K'
  }
];
