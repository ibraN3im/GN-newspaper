import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { apiService } from "../services/api";
import { FileText, Eye, Users as UsersIcon, AlertCircle, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function AdminDashboard() {
  const { t, language } = useLanguage();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const dashboardStats = await apiService.getDashboardStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalArticles = stats?.totalArticles || 0;
  const totalViews = stats?.totalViews || 0;
  const breakingNewsCount = stats?.breakingNewsCount || 0;
  const visitorStats = stats?.visitorStats || [];
  const todayVisitors = visitorStats.length > 0 ? visitorStats[visitorStats.length - 1]?.count || 0 : 0;

  const topArticles = stats?.topArticles || [];
  const recentArticles = stats?.recentArticles || [];

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-base sm:text-xl md:text-2xl font-bold text-red-800 mb-2">
          {t("الإحصائيات", "Statistics")}
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          {t("نظرة عامة على إحصائيات الموقع", "Overview of site statistics")}
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center">{t("جاري التحميل...", "Loading...")}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white rounded-lg shadow-lg p-2 md:p-4 sm:p-6 stats-card">
              <div className="total">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-base md:text-xl font-bold text-blue-600 mb-1">{totalArticles}</h3>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm">
                {t("إجمالي المقالات", "Total Articles")}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-2 md:p-4 sm:p-6 stats-card">
              <div className="total">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Eye className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                </div>
                <h3 className="text-base md:text-xl font-bold text-green-600 mb-1">{totalViews.toLocaleString()}</h3>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm">
                {t("إجمالي المشاهدات", "Total Views")}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-2 md:p-4 sm:p-6 stats-card">
              <div className="total">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <UsersIcon className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-base md:text-xl font-bold text-purple-600 mb-1">{todayVisitors.toLocaleString()}</h3>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm">
                {t("زوار اليوم", "Today's Visitors")}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-2 md:p-4 sm:p-6 stats-card">
              <div className="total">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 sm:w-6 sm:h-6 text-red-600" />
                  </div>
                </div>
                <h3 className="text-base md:text-xl font-bold text-red-600 mb-1">{breakingNewsCount}</h3>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm">
                {t("أخبار عاجلة", "Breaking News")}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-2 md:p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-red-600" />
              <span className="text-sm sm:text-base">
                {t("الزوار خلال الأيام السبعة الماضية", "Visitors Over Last 7 Days")}
              </span>
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={visitorStats.map((stat: any) => ({ ...stat, date: stat.date.split('T')[0] }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ fontSize: '12px' }} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#dc2626"
                  strokeWidth={2}
                  dot={{ fill: "#dc2626", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <h2 className="text-base sm:text-xl font-bold mb-4">
                {t("المقالات الأكثر قراءة", "Most Read Articles")}
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {topArticles.map((article: any, index: number) => (
                  <div key={article._id} className="flex items-start gap-2 sm:gap-3 pb-3 sm:pb-4 border-b last:border-0">
                    <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium mb-1 text-sm sm:text-base line-clamp-2">
                        {article.title[language]}
                      </h4>
                      <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {article.views.toLocaleString()}
                        </span>
                        <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs whitespace-nowrap">
                          {article.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <h2 className="text-base sm:text-xl font-bold mb-4">
                {t("آخر المقالات المنشورة", "Recently Published Articles")}
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {recentArticles.map((article: any) => (
                  <div key={article._id} className="flex items-start gap-2 sm:gap-3 pb-3 sm:pb-4 border-b last:border-0">
                    <img
                      src={article.featuredImage}
                      alt={article.title[language]}
                      className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium mb-1 text-sm sm:text-base line-clamp-2">
                        {article.title[language]}
                      </h4>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                        {article.isBreaking && (
                          <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap">
                            {t("عاجل", "BREAKING")}
                          </span>
                        )}
                        <span className="text-xs sm:text-sm truncate">{article.author.name}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
