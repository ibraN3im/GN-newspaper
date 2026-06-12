import { useLanguage } from "../contexts/LanguageContext";
import { Facebook, Youtube, Mail, X } from "lucide-react";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import { apiService } from "../services/api";

export function Footer() {
  const { language, t } = useLanguage();
  const [siteName, setSiteName] = useState({ ar: "الغلابه", en: "Ghalaba" });
  const [description, setDescription] = useState({ ar: "جريدة إلكترونية شاملة تقدم آخر الأخبار والتحليلات من مختلف المجالات", en: "Comprehensive digital newspaper providing latest news and analysis from various fields" });
  const [contactEmail, setContactEmail] = useState("info@ghalaba.com");
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    twitter: "",
    youtube: ""
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await apiService.getSettings();
      if (settings?.siteName) {
        setSiteName(settings.siteName);
      }
      if (settings?.description) {
        setDescription(settings.description);
      }
      if (settings?.contactEmail) {
        setContactEmail(settings.contactEmail);
      }
      if (settings?.socialLinks) {
        setSocialLinks(settings.socialLinks);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-white text-sm md:text-base font-bold">
              {siteName[language]}
            </h3>
            <p className="text-sm">
              {description[language]}
            </p>
          </div>

          <div>
            <h4 className="text-sm md:text-base text-white font-bold mb-4">
              {t("أقسام الموقع", "Site Sections")}
            </h4>
            <ul className="space-y-2 text-sm md:text-base">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  {t("الرئيسية", "Home")}
                </Link>
              </li>
              <li>
                <Link to="/search?category=سياسة" className="hover:text-white transition-colors">
                  {t("سياسة", "Politics")}
                </Link>
              </li>
              <li>
                <Link to="/search?category=اقتصاد" className="hover:text-white transition-colors">
                  {t("اقتصاد", "Economy")}
                </Link>
              </li>
              <li>
                <Link to="/search?category=رياضة" className="hover:text-white transition-colors">
                  {t("رياضة", "Sports")}
                </Link>
              </li>
              <li>
                <Link to="/search?category=ثقافة" className="hover:text-white transition-colors">
                  {t("ثقافة", "Culture")}
                </Link>
              </li>
              <li>
                <Link to="/search?category=تقنية" className="hover:text-white transition-colors">
                  {t("تقنية", "Technology")}
                </Link>
              </li>
              <li>
                <Link to="/search?category=تعليم" className="hover:text-white transition-colors">
                  {t("تعليم", "Education")}
                </Link>
              </li>
              <li>
                <Link to="/search?category=صحة" className="hover:text-white transition-colors">
                  {t("صحة", "Health")}
                </Link>
              </li>
              <li>
                <Link to="/media" className="hover:text-white transition-colors">
                  {t("معرض الوسائط", "Media Gallery")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm md:text-base text-white font-bold mb-4">{t("اتصل بنا", "Contact Us")}</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="w-6 h-6 md:w-10 md:h-10" />
                <a
                  href={`mailto:${contactEmail}`}
                  className="hover:text-white transition-colors"
                >
                  {contactEmail}
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm md:text-base text-white font-bold mb-4">
              {t("تابعنا على", "Follow Us")}
            </h4>
            <div className="flex gap-4">
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  <Facebook className="w-6 h-6 md:w-10 md:h-10 bg-blue-500 rounded-lg p-1 md:p-2" />
                </a>
              )}
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors bg-gray-800 rounded-lg"
                >
                  <X className="w-6 h-6 md:w-10 md:h-10 p-1 md:p-2" />
                </a>
              )}

              {socialLinks.youtube && (
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  <Youtube className="w-6 h-6 md:w-10 md:h-10 bg-red-600 rounded-lg p-1 md:p-2" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>
            © 2026 {siteName[language]}. {t("جميع الحقوق محفوظة", "All rights reserved")}.
          </p>
        </div>
      </div>
    </footer>
  );
}
