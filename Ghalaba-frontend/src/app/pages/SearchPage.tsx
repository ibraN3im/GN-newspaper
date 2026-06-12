import { useSearchParams, Link } from "react-router";
import { useLanguage } from "../contexts/LanguageContext";
import { Eye, Calendar, Search as SearchIcon } from "lucide-react";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useState, useEffect } from "react";
import { apiService } from "../services/api";
import { getCategoryName } from "../data/categories";

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { language, t } = useLanguage();
  const locale = language === "ar" ? ar : enUS;

  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const [searchInput, setSearchInput] = useState(query);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, [query, category]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const data = await apiService.getArticles({ limit: 100 });
      setArticles(data.articles || []);
    } catch (error) {
      console.error("Failed to load articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter((article) => {
    const matchesQuery =
      !query ||
      article.title[language].toLowerCase().includes(query.toLowerCase()) ||
      article.summary[language].toLowerCase().includes(query.toLowerCase()) ||
      article.content[language].toLowerCase().includes(query.toLowerCase()) ||
      article.tags.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase()));

    const matchesCategory = !category || article.category === category;

    return matchesQuery && matchesCategory;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  return (
    <div className="container mx-auto px-4 md:py-8 py-4">
      <div className="md:mb-8 mb-4">
        <h1 className="md:text-xl text-sm font-bold mb-4">
          {category
            ? getCategoryName(category, language)
            : query
              ? `${t("نتائج البحث عن:", "Search Results for:")} "${query}"`
              : t("بحث", "Search")}
        </h1>

        <form onSubmit={handleSearch} className="max-w-2xl">
          <div className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t("ابحث في المقالات...", "Search articles...")}
              className="w-full text-sm md:text-base px-4 py-1 md:py-3 pr-12 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-50"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-700 p-2 rounded-lg hover:text-red-700"
            >
              <SearchIcon className="w-5 h-5" />
            </button>
          </div>
        </form>

        <p className="text-gray-600 mt-4">
          {t("وجدنا", "Found")} {filteredArticles.length} {t("مقالة", "articles")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow">
              <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-sm md:text-base font-bold text-gray-700 mb-2">
                {t("لا توجد نتائج", "No Results Found")}
              </h3>
              <p className="text-gray-500">
                {t("جرب البحث بكلمات مختلفة", "Try searching with different keywords")}
              </p>
            </div>
          ) : (
            <div className="space-y-4 md:space-y-6">
              {filteredArticles.map((article: any) => (
                <Link
                  key={article._id}
                  to={`/article/${article.slug}`}
                  className="flex md:gap-4 gap-2 bg-white p-2 md:p-4 rounded-lg shadow hover:shadow-lg transition-shadow group md:flex-row flex-col"
                >
                  <img
                    src={article.featuredImage}
                    alt={article.title[language]}
                    className="w-full h-40 md:h-48 md:w-64 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    {article.isBreaking && (
                      <span className="inline-block bg-red-600 text-white px-2 py-1 rounded text-xs font-bold mb-2">
                        {t("عاجل", "BREAKING")}
                      </span>
                    )}
                    <h3 className="font-bold text-sm md:text-lg mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                      {article.title[language]}
                    </h3>
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
          )}
        </div>

        <aside className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-sm md:text-base font-bold mb-4">{t("التصنيفات", "Categories")}</h3>
            <div className="space-y-2">
              {[
                { ar: "سياسة", en: "Politics" },
                { ar: "اقتصاد", en: "Economy" },
                { ar: "رياضة", en: "Sports" },
                { ar: "ثقافة", en: "Culture" },
                { ar: "تقنية", en: "Technology" },
                { ar: "تعليم", en: "Education" },
                { ar: "صحة", en: "Health" },
              ].map((cat) => {
                const count = articles.filter((a: any) => a.category === cat.ar).length;
                return (
                  <Link
                    key={cat.en}
                    to={`/search?category=${cat.ar}`}
                    className={`block px-4 py-2 rounded transition-colors ${category === cat.ar
                      ? "bg-red-600 text-white"
                      : "bg-gray-50 hover:bg-red-50 hover:text-red-600"
                      }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm md:text-base">{cat[language]}</span>
                      <span className="text-sm">({count})</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {category && (
            <Link
              to="/search"
              className="block bg-gray-100 hover:bg-gray-200 text-center py-3 rounded-lg transition-colors"
            >
              {t("عرض جميع المقالات", "Show All Articles")}
            </Link>
          )}
        </aside>
      </div>
    </div>
  );
}
