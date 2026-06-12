import { useLanguage } from "../contexts/LanguageContext";
import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Masonry from "react-responsive-masonry";
import { apiService } from "../services/api";

export function MediaGalleryPage() {
  const { t } = useLanguage();
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      setLoading(true);
      // Load articles and extract their featured images
      const data = await apiService.getArticles({ limit: 100 });
      const articles = Array.isArray(data) ? data : (data?.articles || []);

      // Extract unique images from articles
      const uniqueImages = articles.reduce((acc: any[], article: any) => {
        if (article.featuredImage && !acc.find(img => img.url === article.featuredImage)) {
          acc.push({
            _id: article._id,
            url: article.featuredImage,
            title: article.title?.ar || article.title?.en || 'Untitled',
            type: 'image',
            altText: article.title?.ar || article.title?.en || 'Article image',
            size: 0,
            articleSlug: article.slug,
            articleTitle: article.title
          });
        }
        return acc;
      }, []);

      setMedia(uniqueImages);
    } catch (error) {
      console.error("Failed to load media:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMedia =
    filter === "all" ? media : media.filter((m) => m.type === filter);

  const openLightbox = (url: string, index: number) => {
    setSelectedImage(url);
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: "prev" | "next") => {
    const newIndex =
      direction === "next"
        ? (selectedIndex + 1) % filteredMedia.length
        : (selectedIndex - 1 + filteredMedia.length) % filteredMedia.length;
    setSelectedIndex(newIndex);
    setSelectedImage(filteredMedia[newIndex].url);
  };

  return (
    <div className="container mx-auto px-4 md:py-8 py-4">
      <div className="mb-8">
        <h1 className="text-sm md:text-lg lg:text-xl font-bold mb-4">
          {t("صور المقالات", "Article Images Gallery")}
        </h1>
        <p className="text-xs md:text-sm lg:text-base text-gray-600 mb-6">
          {t(
            "استعرض جميع الصور المستخدمة في مقالات الموقع",
            "Browse all images used in site articles"
          )}
        </p>

        {loading ? (
          <div className="text-center md:py-8 py-4">{t("جاري التحميل...", "Loading...")}</div>
        ) : (
          <>
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setFilter("all")}
                className={`text-xs md:text-sm lg:text-base px-2 md:px-6 py-2 rounded-lg font-medium transition-colors ${filter === "all"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
                  }`}
              >
                {t("الكل", "All")} ({media.length})
              </button>
              <button
                onClick={() => setFilter("image")}
                className={`text-xs md:text-sm lg:text-base px-2 md:px-6 py-2 rounded-lg font-medium transition-colors ${filter === "image"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
                  }`}
              >
                {t("صور المقالات", "Article Images")} ({media.filter((m) => m.type === "image").length})
              </button>
            </div>

            <Masonry columnsCount={3} gutter="1rem">
              {filteredMedia.map((mediaItem, index) => (
                <div
                  key={mediaItem._id}
                  className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                  onClick={() => openLightbox(mediaItem.url, index)}
                >
                  <img
                    src={mediaItem.url}
                    alt={mediaItem.title}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-medium block">
                        {mediaItem.title}
                      </span>
                      <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs block mt-1">
                        {t("مقال", "Article")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </Masonry>
          </>
        )}
      </div>

      {
        selectedImage && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox();
              }}
              className="absolute top-4 right-4 text-white hover:text-red-500 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage("prev");
              }}
              className="absolute left-4 text-white hover:text-red-500 transition-colors"
            >
              <ChevronLeft className="w-12 h-12" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage("next");
              }}
              className="absolute right-4 text-white hover:text-red-500 transition-colors"
            >
              <ChevronRight className="w-12 h-12" />
            </button>

            <img
              src={selectedImage}
              alt="Gallery"
              className="max-w-[90vw] max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white">
              {selectedIndex + 1} / {filteredMedia.length}
            </div>
          </div>
        )
      }
    </div >
  );
}
