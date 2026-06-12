const API_URL = import.meta.env.VITE_API_URL || 'https://alqalaba-back-end.onrender.com/api';

class ApiService {
    constructor() {
        this.token = localStorage.getItem('token');
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    getToken() {
        return this.token;
    }

    logout() {
        this.token = null;
        localStorage.removeItem('token');
    }

    async request(endpoint, options = {}) {
        const url = `${API_URL}${endpoint}`;
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(this.token && { Authorization: `Bearer ${this.token}` }),
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth endpoints
    async login(email, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        this.setToken(data.token);
        return data;
    }

    async getCurrentUser() {
        return await this.request('/auth/me');
    }

    // Articles endpoints
    async getArticles(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await this.request(`/articles${queryString ? '?' + queryString : ''}`);
    }

    async getArticle(slug) {
        return await this.request(`/articles/${slug}`);
    }

    async getLatestArticles(limit = 5) {
        return await this.request(`/articles/latest?limit=${limit}`);
    }

    async getPopularArticles(limit = 5) {
        return await this.request(`/articles/popular?limit=${limit}`);
    }

    async createArticle(articleData) {
        return await this.request('/articles', {
            method: 'POST',
            body: JSON.stringify(articleData),
        });
    }

    async updateArticle(id, articleData) {
        return await this.request(`/articles/${id}`, {
            method: 'PUT',
            body: JSON.stringify(articleData),
        });
    }

    async deleteArticle(id) {
        return await this.request(`/articles/${id}`, {
            method: 'DELETE',
        });
    }

    // Users endpoints
    async getUsers() {
        return await this.request('/users');
    }

    async createUser(userData) {
        return await this.request('/users', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async updateUser(id, userData) {
        return await this.request(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    }

    async deleteUser(id) {
        return await this.request(`/users/${id}`, {
            method: 'DELETE',
        });
    }

    // Media endpoints
    async getMedia(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await this.request(`/media${queryString ? '?' + queryString : ''}`);
    }

    async createMedia(mediaData) {
        return await this.request('/media', {
            method: 'POST',
            body: JSON.stringify(mediaData),
        });
    }

    async deleteMedia(id) {
        return await this.request(`/media/${id}`, {
            method: 'DELETE',
        });
    }

    // Settings endpoints
    async getSettings() {
        return await this.request('/settings');
    }

    async updateSettings(settingsData) {
        return await this.request('/settings', {
            method: 'PUT',
            body: JSON.stringify(settingsData),
        });
    }

    // Stats endpoints
    async getDashboardStats() {
        return await this.request('/stats/dashboard');
    }

    async getVisitorStats(days = 7) {
        return await this.request(`/stats/visitors?days=${days}`);
    }

    async trackVisitor() {
        return await this.request('/stats/track', {
            method: 'POST',
        });
    }
}

export const apiService = new ApiService();
