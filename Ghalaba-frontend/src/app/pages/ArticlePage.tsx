import { useParams, Link } from "react-router";
import { useLanguage } from "../contexts/LanguageContext";
import { apiService } from "../services/api";
import { Eye, Calendar, User, Tag, Share2, Facebook, X, ChevronRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useEffect, useState } from "react";
import { getCategoryName } from "../data/categories";
import { useMetaTags } from "../hooks/useMetaTags";

export function ArticlePage() {
  const { slug } = useParams();
  const { language, t } = useLanguage();
  const locale = language === "ar" ? ar : enUS;
  const [article, setArticle] = useState<any>(null);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticle();
  }, [slug]);

  // Update meta tags when article is loaded
  useMetaTags(article ? {
    title: `${article.title[language]} - ${language === 'ar' ? 'صحيفة الغلابه' : 'Ghalaba Newspaper'}`,
    description: article.summary[language],
    image: article.featuredImage.startsWith('http') ? article.featuredImage : `${window.location.origin}${article.featuredImage}`,
    url: `${window.location.origin}/article/${article.slug}`,
    type: 'article',
    siteName: language === 'ar' ? 'صحيفة الغلابه' : 'Ghalaba Newspaper',
    locale: language === 'ar' ? 'ar_AR' : 'en_US',
    author: article.author.name,
    publishedTime: article.publishedAt,
    category: article.category,
    tags: article.tags,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: article.title[language],
      description: article.summary[language],
      image: [article.featuredImage.startsWith('http') ? article.featuredImage : `${window.location.origin}${article.featuredImage}`],
      datePublished: article.publishedAt,
      dateModified: article.updatedAt || article.publishedAt,
      author: {
        '@type': 'Person',
        name: article.author.name
      },
      publisher: {
        '@type': 'Organization',
        name: language === 'ar' ? 'صحيفة الغلابه' : 'Ghalaba Newspaper',
        logo: {
          '@type': 'ImageObject',
          url: `${window.location.origin}/logo.png`
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${window.location.origin}/article/${article.slug}`
      }
    }
  } : {});

  const loadArticle = async () => {
    try {
      setLoading(true);
      const data = await apiService.getArticle(slug!);
      setArticle(data);

      // Load related articles
      const allArticles = await apiService.getArticles({ category: data.category, limit: 10 });
      setRelatedArticles(
        (allArticles.articles || []).filter((a: any) => a._id !== data._id).slice(0, 3)
      );
    } catch (error) {
      console.error('Failed to load article:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto md:px-4 px-2 py-16 text-center">
        <div className="text-xl">{t("جاري التحميل...", "Loading...")}</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto md:px-4 px-2 py-16 text-center">
        <h1 className="text-sm md:text-xl font-bold mb-4">
          {t("المقال غير موجود", "Article Not Found")}
        </h1>
        <Link to="/" className="text-sm md:text-base text-red-600 hover:underline">
          {t("العودة للرئيسية", "Back to Home")}
        </Link>
      </div>
    );
  }

  const getYouTubeEmbedUrl = (url: string) => {
    // Check if it's already an embed URL
    if (url.includes('youtube.com/embed/')) {
      return url;
    }

    // Extract video ID from various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // If not a YouTube URL, return as is
    return url;
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = article.title[language];
    const description = article.summary[language];
    const siteName = language === 'ar' ? 'صحيفة الغلابه' : 'Ghalaba Newspaper';
    const imageUrl = article.featuredImage.startsWith('http') ? article.featuredImage : `${window.location.origin}${article.featuredImage}`;

    // Create enhanced share text with emojis and better formatting
    const shareText = `📰 ${siteName}\n\n📌 ${title} 📌\n\n${description}\n\n ${url}`;

    const urls: { [key: string]: string } = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(`${title}\n\n${description}\n\n${siteName}`)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`${title} - ${siteName}`)}&via=AlGhalabaNews`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
    };

    if (urls[platform]) {
      if (platform === 'whatsapp') {
        window.open(urls[platform], "_blank");
      } else {
        window.open(urls[platform], "_blank", "width=600,height=400");
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto md:px-6 px-4 md:py-8 py-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-red-600">
            {t("الرئيسية", "Home")}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={`/search?category=${article.category}`} className="hover:text-red-600">
            {getCategoryName(article.category, language)}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">{t("المقال", "Article")}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-4 rounded-md">
          <article className="lg:col-span-2 bg-white rounded-lg shadow-lg overflow-hidden">
            {article.isBreaking && (
              <div className="bg-red-600 text-white px-6 py-2 font-bold">
                {t("خبر عاجل", "BREAKING NEWS")}
              </div>
            )}

            <div className="p-2 md:p-4">
              <h1 className="md:text-base text-sm font-bold mb-4">{article.title[language]}</h1>

              <div className="flex flex-wrap items-center md:gap-4 gap-2 text-sm text-gray-600 mb-4 md:mb-6 pb-4 md:pb-6 border-b">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {article.author.name}
                </span>
                <span className="text-xs md:text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {format(article.publishedAt, "PPP", { locale })}
                </span>
                <span className="text-xs md:text-sm flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  {article.views.toLocaleString()} {t("مشاهدة", "views")}
                </span>
                <span className="text-xs md:text-sm bg-red-100 text-red-700 px-3 py-1 rounded">
                  {getCategoryName(article.category, language)}
                </span>
              </div>

              <p className="md:text-base text-sm text-gray-700 mb-6 leading-relaxed">
                {article.summary[language]}
              </p>

              <img
                src={article.featuredImage}
                alt={article.title[language]}
                className="w-full h-64 md:h-96 object-cover rounded-lg mb-6"
              />

              <div className="prose prose-lg max-w-none mb-8">
                {article.content[language].split('\n').map((paragraph: string, index: number) => (
                  <p key={index} className="mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {article.videoUrl && (
                <div className="mb-8">
                  <h3 className="text-sm md:text-base font-bold mb-4">
                    {t("فيديو مرتبط", "Related Video")}
                  </h3>
                  <div className="aspect-video">
                    <iframe
                      src={getYouTubeEmbedUrl(article.videoUrl)}
                      className="w-full h-full rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {article.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap mb-6">
                  <Tag className="w-4 h-4 text-gray-600" />
                  {article.tags.map((tag: string, index: number) => (
                    <Link
                      key={tag + index}
                      to={`/search?q=${tag}`}
                      className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}

              <div className="border-t border-gray-200 pt-6">
                <h3 className="md:text-lg text-sm font-bold mb-4 flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  {t("شارك المقال", "Share Article")}
                </h3>
                <div className="flex text-sm gap-4 md:gap-6">
                  <button
                    onClick={() => handleShare("facebook")}
                    className="flex items-center gap-2 bg-blue-600 text-white py-1 px-2 md:px-4 rounded hover:bg-blue-700 transition-colors"
                  >
                    <Facebook className="w-4 h-4" />

                  </button>
                  <button
                    onClick={() => handleShare("twitter")}
                    className="flex items-center gap-2 bg-sky-500 text-white py-1 px-2 md:px-4 rounded hover:bg-sky-600 transition-colors"
                  >
                    <X className="w-4 h-4" />

                  </button>
                  <button
                    onClick={() => handleShare("whatsapp")}
                    className="flex items-center gap-2 bg-green-600 text-white py-1 px-2 md:px-4 rounded hover:bg-green-700 transition-colors"
                  >
                    <FaWhatsapp className="w-4 h-4" />

                  </button>
                </div>
              </div>
            </div>
          </article>

          <aside className="space-y-6 mt-10">
            {relatedArticles.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-sm md:text-base font-bold mb-4">
                  {t("مقالات ذات صلة", "Related Articles")}
                </h3>
                <div className="space-y-4">
                  {relatedArticles.map((relArticle) => (
                    <Link
                      key={relArticle.id}
                      to={`/article/${relArticle.slug}`}
                      className="block group"
                    >
                      <img
                        src={relArticle.featuredImage}
                        alt={relArticle.title[language]}
                        className="w-full h-32 object-cover rounded-lg mb-2 group-hover:shadow-lg transition-shadow"
                      />
                      <h4 className="text-sm md:text-base font-medium group-hover:text-red-600 transition-colors line-clamp-2">
                        {relArticle.title[language]}
                      </h4>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <Eye className="w-3 h-3" />
                        {relArticle.views.toLocaleString()}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-red-600 to-red-800 text-white rounded-lg shadow-lg p-6">
              <h3 className="text-sm md:text-base font-bold mb-4">
                {t("اشترك في النشرة الإخبارية", "Subscribe to Newsletter")}
              </h3>
              <p className="text-sm mb-4">
                {t(
                  "احصل على آخر الأخبار مباشرة في بريدك الإلكتروني",
                  "Get the latest news directly in your email"
                )}
              </p>
              <input
                type="email"
                placeholder={t("بريدك الإلكتروني", "Your email")}
                className="w-full px-4 py-2 rounded mb-3 text-gray-900"
              />
              <button className="w-full bg-white text-red-600 py-2 rounded font-bold hover:bg-gray-100 transition-colors cursor-not-allowed">
                {t("اشترك الآن", "Subscribe Now")}
              </button>
            </div>



          </aside>


        </div>
      </div>
    </div>
  );
}