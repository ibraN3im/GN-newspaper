import { useLanguage } from "../contexts/LanguageContext";
import { Link } from "react-router";
import { AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { apiService } from "../services/api";

export function BreakingNewsTicker() {
  const { language, t } = useLanguage();
  const [breakingNews, setBreakingNews] = useState<any[]>([]);
  const [showTicker, setShowTicker] = useState(true);

  useEffect(() => {
    loadBreakingNews();
    loadSettings();

    // Refresh breaking news every 30 seconds to check for expiration
    const interval = setInterval(() => {
      loadBreakingNews();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadBreakingNews = async () => {
    try {
      const data = await apiService.getArticles({ limit: 100 });
      const breaking = (data.articles || []).filter((a: any) =>
        a.isBreaking && (!a.breakingExpiresAt || new Date(a.breakingExpiresAt) > new Date())
      );
      setBreakingNews(breaking);
    } catch (error) {
      console.error("Failed to load breaking news:", error);
    }
  };

  const loadSettings = async () => {
    try {
      const settings = await apiService.getSettings();
      if (settings && settings.showBreakingTicker !== undefined) {
        setShowTicker(settings.showBreakingTicker);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  if (!showTicker || breakingNews.length === 0) return null;

  return (
    <div className="bg-red-600 text-white overflow-hidden">
      <div className="container mx-auto px-4 h-10 flex items-center">
        <div className="flex items-center gap-2 bg-red-800 px-1 md:px-4 py-1 rounded font-bold whitespace-nowrap text-sm md:text-base">
          <AlertCircle className="w-4 h-4" />
          <span>{t("عاجل", "BREAKING")}</span>
        </div>
        <div className="flex-1 overflow-hidden mx-2">
          <div className="animate-ticker flex gap-6 md:gap-8">
            {breakingNews.map((article) => (
              <Link
                key={article._id}
                to={`/article/${article.slug}`}
                className="whitespace-nowrap hover:underline text-sm md:text-base"
              >
                • {article.title[language]}
              </Link>
            ))}
            {breakingNews.map((article) => (
              <Link
                key={`${article._id}-2`}
                to={`/article/${article.slug}`}
                className="whitespace-nowrap hover:underline text-sm md:text-lg"
              >
                • {article.title[language]}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
