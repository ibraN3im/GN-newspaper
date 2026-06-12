import { Link } from "react-router";
import { useLanguage } from "../contexts/LanguageContext";
import { Home, Search } from "lucide-react";

export function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-sm md:text-xl font-bold text-red-600 mb-4">404</h1>
        <h2 className="text-sm md:text-xl font-bold text-gray-900 mb-4">
          {t("الصفحة غير موجودة", "Page Not Found")}
        </h2>
        <p className="text-sm md:text-base text-gray-600 mb-8 max-w-md mx-auto">
          {t(
            "عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى عنوان آخر",
            "Sorry, the page you are looking for does not exist or has been moved to another address"
          )}
        </p>
        <div className="text-xs md:text-base flex gap-4 justify-center">
          <Link
            to="/"
            className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            {t("العودة للرئيسية", "Back to Home")}
          </Link>
          <Link
            to="/search"
            className="flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <Search className="w-5 h-5" />
            {t("البحث", "Search")}
          </Link>
        </div>
      </div>
    </div>
  );
}
