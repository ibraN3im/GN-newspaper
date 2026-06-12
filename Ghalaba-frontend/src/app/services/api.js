const API_URL = import.meta.env.VITE_API_URL || 'https://alqalaba-back-end.onrender.com';

class ApiService {
    async request(endpoint, options = {}) {
        const url = `${API_URL}${endpoint}`;
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
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

    // Articles endpoints
    async getArticles(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await this.request(`/articles${queryString ? '?' + queryString : ''}`);
    }

    async getArticle(slug) {
        return await this.request(`/articles/${slug}`);
    }

    async getLatestArticles(limit = 10) {
        return await this.request(`/articles/latest?limit=${limit}`);
    }

    async getPopularArticles(limit = 5) {
        return await this.request(`/articles/popular?limit=${limit}`);
    }

    // Settings endpoints
    async getSettings() {
        return await this.request('/settings');
    }

    // Media endpoints
    async getMedia() {
        return await this.request('/media');
    }

    // Stats endpoints
    async trackVisitor() {
        return await this.request('/stats/track', {
            method: 'POST',
        });
    }
}

export const apiService = new ApiService();
