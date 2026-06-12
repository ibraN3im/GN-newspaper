import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { X } from "lucide-react";

interface AddArticleModalProps {
    onClose: () => void;
    onAdd: (article: any) => void;
    articleData?: any;
}

export function AddArticleModal({ onClose, onAdd, articleData }: AddArticleModalProps) {
    const { t } = useLanguage();
    const isEditMode = !!articleData;

    const [formData, setFormData] = useState({
        title: { ar: '', en: '' },
        summary: { ar: '', en: '' },
        content: { ar: '', en: '' },
        featuredImage: '',
        videoUrl: '',
        category: '',
        tags: [] as string[],
        hashtags: [] as string[],
        isBreaking: false,
        breakingDurationHours: 1,
        publishedAt: new Date().toISOString(),
        author: { id: '1', name: 'Admin' },
        status: 'published' as 'draft' | 'published' | 'archived'
    });

    // Load article data for editing
    useEffect(() => {
        if (articleData) {
            let initialHours = 1;
            if (articleData.breakingExpiresAt) {
                const diffMs = new Date(articleData.breakingExpiresAt).getTime() - Date.now();
                const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
                initialHours = diffHours > 0 ? diffHours : 1;
            }
            setFormData({
                title: articleData.title || { ar: '', en: '' },
                summary: articleData.summary || { ar: '', en: '' },
                content: articleData.content || { ar: '', en: '' },
                featuredImage: articleData.featuredImage || '',
                videoUrl: articleData.videoUrl || '',
                category: articleData.category || '',
                tags: articleData.tags || [],
                hashtags: articleData.hashtags || [],
                isBreaking: articleData.isBreaking || false,
                breakingDurationHours: initialHours,
                publishedAt: articleData.publishedAt ? new Date(articleData.publishedAt).toISOString() : new Date().toISOString(),
                author: articleData.author || { id: '1', name: 'Admin' },
                status: articleData.status || 'published'
            } as any);
        }
    }, [articleData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const submissionData = { ...formData } as any;
        if (submissionData.isBreaking) {
            const expireDate = new Date(Date.now() + submissionData.breakingDurationHours * 60 * 60 * 1000);
            submissionData.breakingExpiresAt = expireDate.toISOString();
        } else {
            submissionData.breakingExpiresAt = null;
        }
        delete submissionData.breakingDurationHours;
        onAdd(submissionData);
    };

    const updateField = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    const updateLocalizedField = (field: string, lang: 'ar' | 'en', value: string) => {
        setFormData({
            ...formData,
            [field]: {
                ...(formData as any)[field],
                [lang]: value
            }
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full my-8 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-sm md:text-base font-bold">
                        {isEditMode
                            ? t("تعديل المقال", "Edit Article")
                            : t("مقال جديد", "Add Article")}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                        <X className="w-4 h-4 md:w-6 md:h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                    {/* Author Info - Read only for editors */}
                    {articleData && (
                        <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-sm text-gray-600">
                                {t("الكاتب:", "Author:")} <span className="font-semibold">{articleData.author?.name}</span>
                            </p>
                            <p className="text-xs md:text-base text-gray-500 mt-1">
                                {t("تم النشر في:", "Published on:")} {new Date(articleData.publishedAt).toLocaleDateString()}
                            </p>
                        </div>
                    )}

                    {/* Titles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t("العنوان (عربي)", "Title (Arabic)")}
                            </label>
                            <input
                                type="text"
                                value={formData.title.ar}
                                onChange={(e) => updateLocalizedField('title', 'ar', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t("العنوان (إنجليزي)", "Title (English)")}
                            </label>
                            <input
                                type="text"
                                value={formData.title.en}
                                onChange={(e) => updateLocalizedField('title', 'en', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                            />
                        </div>
                    </div>

                    {/* Summaries */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t("الملخص (عربي)", "Summary (Arabic)")}
                            </label>
                            <textarea
                                value={formData.summary.ar}
                                onChange={(e) => updateLocalizedField('summary', 'ar', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                                rows={3}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t("الملخص (إنجليزي)", "Summary (English)")}
                            </label>
                            <textarea
                                value={formData.summary.en}
                                onChange={(e) => updateLocalizedField('summary', 'en', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t("المحتوى (عربي)", "Content (Arabic)")}
                            </label>
                            <textarea
                                value={formData.content.ar}
                                onChange={(e) => updateLocalizedField('content', 'ar', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                                rows={6}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t("المحتوى (إنجليزي)", "Content (English)")}
                            </label>
                            <textarea
                                value={formData.content.en}
                                onChange={(e) => updateLocalizedField('content', 'en', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                                rows={6}
                            />
                        </div>
                    </div>

                    {/* Media & Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t("صورة بارزة", "Featured Image")}
                            </label>
                            <input
                                type="url"
                                value={formData.featuredImage}
                                onChange={(e) => updateField('featuredImage', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                                dir="ltr"
                                placeholder="https://..."
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t("رابط الفيديو (اختياري)", "Video URL (Optional)")}
                            </label>
                            <input
                                type="url"
                                value={formData.videoUrl}
                                onChange={(e) => updateField('videoUrl', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                                dir="ltr"
                                placeholder="https://youtube.com/..."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t("التصنيف", "Category")}
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => updateField('category', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 bg-white"
                                required
                            >
                                <option value="">{t("اختر التصنيف", "Select Category")}</option>
                                <option value="سياسة">{t("سياسة", "Politics")}</option>
                                <option value="اقتصاد">{t("اقتصاد", "Economy")}</option>
                                <option value="رياضة">{t("رياضة", "Sports")}</option>
                                <option value="ثقافة">{t("ثقافة", "Culture")}</option>
                                <option value="تقنية">{t("تقنية", "Technology")}</option>
                                <option value="صحة">{t("صحة", "Health")}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t("الكلمات المفتاحية (Tags)", "Keywords (Tags)")}
                            </label>
                            <input
                                type="text"
                                value={formData.tags.join(', ')}
                                onChange={(e) => updateField('tags', e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                                placeholder={t("تقنية, ذكاء اصطناعي, مستقبل", "technology, AI, future")}
                            />
                        </div>
                    </div>

                    {/* Hashtags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("الهاشتاقات", "Hashtags")}
                        </label>
                        <input
                            type="text"
                            value={formData.hashtags.join(', ')}
                            onChange={(e) => updateField('hashtags', e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                            placeholder={t("#تقنية, #ذكاء_اصطناعي, #مستقبل", "#technology, #AI, #future")}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {t("أدخل الهاشتاقات مفصولة بفاصلة", "Enter hashtags separated by commas")}
                        </p>
                    </div>

                    {/* Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t("خبر عاجل", "Breaking News")}
                            </label>
                            <div className="flex items-center gap-2 mt-2">
                                <input
                                    type="checkbox"
                                    id="isBreaking"
                                    checked={formData.isBreaking}
                                    onChange={(e) => updateField('isBreaking', e.target.checked)}
                                    className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                                />
                                <label htmlFor="isBreaking" className="text-sm text-gray-700">
                                    {t("عاجل", "Breaking")}
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Breaking News Expiry */}
                    {formData.isBreaking && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t("مدة العاجل (بالساعات)", "Breaking News Expiry Time (Hours)")}
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={formData.breakingDurationHours}
                                onChange={(e) => updateField('breakingDurationHours', parseInt(e.target.value) || 1)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                                dir="ltr"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {t("سيتم إخفاء الخبر العاجل تلقائياً بعد هذا الوقت", "The breaking news will be automatically hidden after this time")}
                            </p>
                        </div>
                    )}
                    <br />
                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium cursor-pointer"
                        >
                            {t("نشر", "Publish")}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors font-medium cursor-pointer"
                        >
                            {t("إلغاء", "Cancel")}
                        </button>
                    </div>
                </form >
            </div >
        </div >
    );
}
