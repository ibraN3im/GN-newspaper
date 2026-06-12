import { Link, useNavigate } from "react-router";
import { useLanguage } from "../contexts/LanguageContext";
import { Search, Menu, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { apiService } from "../services/api";
export function Header() {
  const navigate = useNavigate();
  const { language, toggleLanguage, t, dir } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [siteName, setSiteName] = useState({ ar: "الغلابه", en: "Ghalaba" });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await apiService.getSettings();
      if (settings?.siteName) {
        setSiteName(settings.siteName);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const categories = [
    { ar: "سياسة", en: "Politics" },
    { ar: "اقتصاد", en: "Economy" },
    { ar: "رياضة", en: "Sports" },
    { ar: "ثقافة", en: "Culture" },
    { ar: "تقنية", en: "Technology" },
    { ar: "صحة", en: "Health" },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="border-b border-gray-200">
        <div className="container mx-auto md:px-4 px-2">
          <div className="flex items-center justify-between md:h-20 h-12">
            <Link to="/" className="flex items-center gap-3">
              <div className="md:w-12 md:h-12 w-8 h-8 logo rounded-full flex items-center justify-center">
                {/* <img src="./src/logo/galaba-logo.png" alt="Galaba Logo" className="w-full h-full object-cover" /> */}
              </div>
              <div className="flex flex-col">
                <span className="text-sm md:text-base md:text-2xl font-bold text-red-700">
                  {siteName[language]}
                </span>
                <span className="disc-lable sm:text-sm md:text-base text-gray-500">
                  {t("صحيفه إلكترونية", "Digit-Newspaper")}
                </span>
              </div>
            </Link>

            <form
              onSubmit={handleSearch}
              className="hidden md:flex items-center flex-1 max-w-md mx-8"
            >
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  placeholder={t(
                    "ابحث في الأخبار...",
                    "Search news...",
                  )}
                  className="w-full px-4 py-2 pr-10 border border-blue-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-700 hover:text-blue-800"
                >
                  <Search className="md:w-5 md:h-5 w-3 h-3 " />
                </button>
              </div>
            </form>

            {/* Mobile Search Bar */}
            <form
              onSubmit={handleSearch}
              className="md:hidden flex items-center"
            >
              <div className="relative w-32">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  placeholder={t("ابحث...", "Search...")}
                  className="w-full px-2 py-1 pr-8 text-xs md:text-base border border-blue-300 rounded-full focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-700 hover:text-blue-800"
                >
                  <Search className="w-3 h-3" />
                </button>
              </div>
            </form>

            <div className="flex items-center gap-2 text-red-700">
              <button
                onClick={toggleLanguage}
                className="flex items-center md:gap-1 gap-0.5 md:px-2 py-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Globe className="md:w-5 md:h-5 w-3 h-3 " />
                <span className="text-xs md:text-base font-medium">
                  {language === "ar" ? "EN" : "AR"}
                </span>
              </button>

              <button
                onClick={() =>
                  setMobileMenuOpen(!mobileMenuOpen)
                }
                className="md:hidden md:px-2 py-2 hover:bg-gray-100 rounded-full"
              >
                <Menu className="w-5 h-5 " />
              </button>
            </div>
          </div>
        </div>
      </div>

      <nav className="bg-red-700 text-white">
        <div className="container mx-auto px-4">
          <div className="text-sm md:text-base hidden md:flex items-center justify-center gap-4 h-12">
            <Link
              to="/"
              className="hover:bg-red-800 px-4 py-2 rounded transition-colors"
            >
              {t("الرئيسية", "Home")}
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.en}
                to={`/search?category=${cat.ar}`}
                className="hover:bg-red-800 px-4 py-2 rounded transition-colors"
              >
                {cat[language]}
              </Link>
            ))}
            <Link
              to="/media"
              className="hover:bg-red-800 px-4 py-2 rounded transition-colors"
            >
              {t("الوسائط", "Media")}
            </Link>
          </div>

          {mobileMenuOpen && (
            <div className="text-sm md:text-base md:hidden py-4 space-y-2">
              <Link
                to="/"
                className="block hover:bg-red-800 px-4 py-2 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("الرئيسية", "Home")}
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.en}
                  to={`/search?category=${cat.ar}`}
                  className="block hover:bg-red-800 px-4 py-2 rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {cat[language]}
                </Link>
              ))}
              <Link
                to="/media"
                className="block hover:bg-red-800 px-4 py-2 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("الوسائط", "Media")}
              </Link>

            </div>
          )}
        </div>
      </nav>
    </header>
  );
}