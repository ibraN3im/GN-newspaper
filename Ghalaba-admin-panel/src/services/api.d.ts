export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'editor';
}

export interface Article {
    _id: string;
    slug: string;
    title: { ar: string; en: string };
    summary: { ar: string; en: string };
    content: { ar: string; en: string };
    featuredImage: string;
    videoUrl?: string;
    category: string;
    tags: string[];
    isBreaking: boolean;
    views: number;
    publishedAt: string;
    author: { id: string; name: string };
    status: 'draft' | 'published' | 'archived';
    createdAt: string;
    updatedAt: string;
}

export interface Media {
    _id: string;
    url: string;
    type: 'image' | 'video';
    title: string;
    altText: string;
    size: number;
    uploadedBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface Settings {
    _id: string;
    siteName: { ar: string; en: string };
    contactEmail: string;
    description: { ar: string; en: string };
    socialLinks: {
        facebook: string;
        twitter: string;
        youtube: string;
    };
    tickerSpeed: number;
    articlesPerPage: number;
    enableComments: boolean;
    maintenanceMode: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface VisitorStat {
    _id: string;
    date: string;
    count: number;
    uniqueVisitors: number;
    pageViews: number;
}

export interface DashboardStats {
    totalArticles: number;
    totalViews: number;
    breakingNewsCount: number;
    topArticles: Article[];
    recentArticles: Article[];
    visitorStats: VisitorStat[];
}

export interface ApiServiceType {
    getToken(): string | null;
    logout(): void;
    login(email: string, password: string): Promise<{ token: string; user: User }>;
    getCurrentUser(): Promise<User>;
    getArticles(params?: any): Promise<{ articles: Article[]; total: number }>;
    getArticle(slug: string): Promise<Article>;
    getLatestArticles(limit?: number): Promise<Article[]>;
    getPopularArticles(limit?: number): Promise<Article[]>;
    createArticle(articleData: Partial<Article>): Promise<Article>;
    updateArticle(id: string, articleData: Partial<Article>): Promise<Article>;
    deleteArticle(id: string): Promise<void>;
    getUsers(): Promise<User[]>;
    createUser(userData: any): Promise<User>;
    updateUser(id: string, userData: any): Promise<User>;
    deleteUser(id: string): Promise<void>;
    getMedia(params?: any): Promise<{ media: Media[]; total: number }>;
    createMedia(mediaData: any): Promise<Media>;
    deleteMedia(id: string): Promise<void>;
    getSettings(): Promise<Settings>;
    updateSettings(settingsData: any): Promise<any>;

    // Stats
    getDashboardStats(): Promise<DashboardStats>;
    getVisitorStats(days?: number): Promise<VisitorStat[]>;
    trackVisitor(): Promise<{ success: boolean }>;
}

declare module '../services/api.js' {
    export const apiService: ApiServiceType;
}
