import { 
  Search, 
  GraduationCap, 
  LayoutDashboard, 
  Building2, 
  Banknote, 
  Globe2, 
  Scale, 
  FileText, 
  Activity 
} from 'lucide-react';
import { ROUTES } from './routes';

export const FEATURES_CONFIG = [
  {
    id: 'feature-finder',
    title: 'University Finder',
    description: 'Get AI-powered recommendations based on your CGPA, budget, and career goals.',
    icon: Search,
    buttonLabel: 'Explore Universities',
    destinationRoute: ROUTES.UNIVERSITIES,
  },
  {
    id: 'feature-scholarships',
    title: 'Scholarships',
    description: 'Find global funding opportunities tailored to your academic profile.',
    icon: GraduationCap,
    buttonLabel: 'Browse Scholarships',
    destinationRoute: ROUTES.SCHOLARSHIPS,
  },
  {
    id: 'feature-tracker',
    title: 'Application Tracker',
    description: 'Manage your documents, deadlines, and application statuses in one place.',
    icon: LayoutDashboard,
    buttonLabel: 'Start Tracking',
    destinationRoute: ROUTES.LOGIN,
  }
];

export const STATS_CONFIG = [
  {
    id: 'stat-uni',
    value: 500,
    suffix: '+',
    label: 'Global Universities',
    icon: Building2,
  },
  {
    id: 'stat-fund',
    value: 10,
    suffix: 'M+',
    label: 'In Scholarships',
    icon: Banknote,
  },
  {
    id: 'stat-country',
    value: 50,
    suffix: '+',
    label: 'Countries Supported',
    icon: Globe2,
  }
];

export const TIMELINE_CONFIG = [
  {
    order: 1,
    title: 'Discover',
    description: 'Enter your profile and preferences to discover matching global universities.',
    icon: Search,
  },
  {
    order: 2,
    title: 'Compare',
    description: 'Weigh your options side-by-side using our advanced comparison tool.',
    icon: Scale,
  },
  {
    order: 3,
    title: 'Secure Funding',
    description: 'Find and apply for scholarships that perfectly match your academic background.',
    icon: Banknote,
  },
  {
    order: 4,
    title: 'Track Applications',
    description: 'Use the integrated tracker to manage deadlines and document submissions.',
    icon: Activity,
  }
];

export const TESTIMONIALS_CONFIG = [
  {
    id: 'test-1',
    name: 'Sarah Jenkins',
    role: 'Masters Student, UK',
    content: 'UniCoFinder transformed my study abroad journey. I found a scholarship I didn\'t even know existed and tracked all my applications effortlessly.',
  },
  {
    id: 'test-2',
    name: 'David Chen',
    role: 'Undergraduate, Canada',
    content: 'The AI recommendations were spot on. It matched me with a university that perfectly aligned with my budget and career aspirations.',
  },
  {
    id: 'test-3',
    name: 'Aisha Patel',
    role: 'PhD Candidate, Australia',
    content: 'Having all my deadlines and document requirements in one dashboard saved me so much stress during the application season.',
  }
];

export const FAQ_CONFIG = [
  {
    id: 'faq-1',
    question: 'How does the University Finder work?',
    answer: 'Our smart algorithm matches your academic profile (like CGPA and test scores), budget constraints, and preferred study destinations against a global database to recommend the best fit universities for you.'
  },
  {
    id: 'faq-2',
    question: 'Are the scholarship listings verified?',
    answer: 'Yes, our team constantly updates and verifies the scholarship listings to ensure they are active and accurate. We source opportunities directly from university portals and trusted government programs.'
  },
  {
    id: 'faq-3',
    question: 'Is UniCoFinder free to use?',
    answer: 'Core features like university discovery, scholarship browsing, and basic application tracking are completely free. We also offer premium features for personalized AI advising and unlimited tracking.'
  },
  {
    id: 'faq-4',
    question: 'Can I track applications for multiple countries?',
    answer: 'Absolutely. The Application Tracker is designed to handle multiple universities across different countries, helping you manage varying deadlines and document requirements seamlessly.'
  }
];
