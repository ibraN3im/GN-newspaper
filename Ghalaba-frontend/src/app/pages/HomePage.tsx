import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { apiService } from "../services/api";
import { Link } from "react-router";
import { Eye, Calendar, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { getCategoryName } from "../data/categories";
import { useMetaTags } from "../hooks/useMetaTags";


export function HomePage() {
  const { language, t } = useLanguage();
  const locale = language === "ar" ? ar : enUS;
  const [articles, setArticles] = useState<any[]>([]);
  const [popularArticles, setPopularArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Set meta tags for home page
  useMetaTags({
    title: language === 'ar' ? 'صحيفة الغلابه - أخبار عاجلة ومقالات' : 'Al-Ghalaba News - Breaking News & Articles',
    description: language === 'ar'
      ? 'صحيفة الغلابه، مصدرك للأخبار العاجلة والمقالات المتنوعة في السياسة والاقتصاد والرياضة والثقافة'
      : 'Al-Ghalaba News, your source for breaking news and diverse articles in politics, economy, sports, and culture',
    url: window.location.origin,
    type: 'website',
    siteName: language === 'ar' ? 'صحيفة الغلابه' : 'Al-Ghalaba News',
    locale: language === 'ar' ? 'ar_AR' : 'en_US',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'NewsMediaOrganization',
      name: language === 'ar' ? 'صحيفة الغلابه' : 'Al-Ghalaba News',
      url: window.location.origin,
      description: language === 'ar'
        ? 'صحيفة إلكترونية شاملة تغطي الأخبار العاجلة والمقالات المتنوعة'
        : 'Comprehensive digital newspaper covering breaking news and diverse articles'
    }
  });

  useEffect(() => {
    loadData();
    // Track visitor
    apiService.trackVisitor().catch(console.error);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [articlesRes, popularRes] = await Promise.all([
        apiService.getArticles({ limit: 20 }),
        apiService.getPopularArticles(5)
      ]);
      setArticles(articlesRes.articles || []);
      setPopularArticles(popularRes || []);
    } catch (error) {
      console.error('Failed to load articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortedArticles = [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const featuredArticle = sortedArticles[0];
  const recentArticles = sortedArticles.slice(1, 5);

  return (
    <div className="container mx-auto md:px-6 px-4 md:py-8 py-4">
      {loading ? (
        <div className="text-center py-12">{t("جاري التحميل...", "Loading...")}</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Article */}
            {featuredArticle && (
              <Link
                to={`/article/${featuredArticle.slug}`}
                className="block group relative overflow-hidden rounded-xl shadow-lg"
              >
                <img
                  src={featuredArticle.featuredImage}
                  alt={featuredArticle.title[language]}
                  className="w-full h-64 md:h-96 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  {featuredArticle.isBreaking && (
                    <span className="inline-block bg-red-600 text-white px-3 py-1 rounded text-sm font-bold mb-3">
                      {t("عاجل", "BREAKING")}
                    </span>
                  )}
                  <h2 className="md:text-xl text-base font-bold mb-3 group-hover:text-red-400 transition-colors">
                    {featuredArticle.title[language]}
                  </h2>
                  <p className="text-gray-200 mb-4 line-clamp-2">
                    {featuredArticle.summary[language]}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-300">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(featuredArticle.publishedAt, "PPP", { locale })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {featuredArticle.views.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Recent Articles */}
            <div>
              <h3 className="md:text-xl text-sm font-bold mb-6 flex items-center gap-2">
                <div className="w-1 h-8 bg-red-600" />
                {t("آخر الأخبار", "Latest News")}
              </h3>
              <div className="md:space-y-6 space-y-4">
                {recentArticles.map((article: any) => (
                  <Link
                    key={article._id}
                    to={`/article/${article.slug}`}
                    className="flex flex-col md:flex-row md:gap-4 gap-2 group hover:bg-gray-50 py-4 px-2 rounded-lg transition-colors card-shadow"
                  >
                    <img
                      src={article.featuredImage}
                      alt={article.title[language]}
                      className="w-full md:w-48 h-32 md:h-auto object-cover rounded-lg group-hover:shadow-lg transition-shadow"
                    />
                    <div className="flex-1">
                      {article.isBreaking && (
                        <span className="inline-block bg-red-600 text-white px-2 py-1 rounded text-xs font-bold mb-2">
                          {t("عاجل", "BREAKING")}
                        </span>
                      )}
                      <h4 className="md:text-lg text-sm font-bold mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                        {article.title[language]}
                      </h4>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {article.summary[language]}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded">
                          {getCategoryName(article.category, language)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(article.publishedAt, "PP", { locale })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {article.views.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* More Articles Grid */}
            <div>
              <h3 className="md:text-xl text-sm font-bold md:mb-6 mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-red-600" />
                {t("المزيد من الأخبار", "More News")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedArticles.slice(5).map((article: any) => (
                  <Link
                    key={article._id}
                    to={`/article/${article.slug}`}
                    className="group bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    <img
                      src={article.featuredImage}
                      alt={article.title[language]}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-4">
                      <h4 className="text-sm md:text-base font-bold mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                        {article.title[language]}
                      </h4>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {article.summary[language]}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded">
                          {getCategoryName(article.category, language)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {article.views.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Popular Articles */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="md:text-xl text-sm font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-red-600" />
                {t("الأكثر قراءة", "Most Read")}
              </h3>
              <div className="space-y-4">
                {popularArticles.map((article: any, index) => (
                  <Link
                    key={article._id}
                    to={`/article/${article.slug}`}
                    className="flex gap-3 group"
                  >
                    <div className="flex-shrink-0 text-xs md:text-base md:w-8 md:h-8 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h4 className="text-sm md:text-base font-medium group-hover:text-red-600 transition-colors line-clamp-2 mb-1">
                        {article.title[language]}
                      </h4>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {article.views.toLocaleString()} {t("مشاهدة", "views")}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="md:text-xl text-sm font-bold mb-4">
                {t("التصنيفات", "Categories")}
              </h3>
              <div className="space-y-2">
                {[
                  { ar: "سياسة", en: "Politics" },
                  { ar: "اقتصاد", en: "Economy" },
                  { ar: "رياضة", en: "Sports" },
                  { ar: "ثقافة", en: "Culture" },
                  { ar: "تقنية", en: "Technology" },
                  { ar: "تعليم", en: "Education" },
                  { ar: "صحة", en: "Health" },
                ].map((cat) => (
                  <Link
                    key={cat.en}
                    to={`/search?category=${cat.ar}`}
                    className="block px-4 py-2 bg-gray-50 hover:bg-red-50 hover:text-red-600 rounded transition-colors"
                  >
                    {cat[language]}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
