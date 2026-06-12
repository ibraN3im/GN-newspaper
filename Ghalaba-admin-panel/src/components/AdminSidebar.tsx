import { Link, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

export function AdminSidebar() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  const menuItems = [
    {
      path: "/admin",
      icon: LayoutDashboard,
      label: t("الإحصائيات", "Statistics"),
      exact: true,
    },
    {
      path: "/admin/articles",
      icon: FileText,
      label: t("المقالات", "Articles"),
    },
    {
      path: "/admin/members",
      icon: Users,
      label: t("الأعضاء", "Members"),
      adminOnly: true,
    },
    {
      path: "/admin/settings",
      icon: Settings,
      label: t("الإعدادات", "Settings"),
      adminOnly: true,
    },
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-full md:w-48 bg-gray-900 text-white flex flex-col md:min-h-screen">
      <div className="p-4 md:p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold">غ</span>
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-sm md:text-base truncate">لوحة التحكم</h2>
            <p className="text-xs md:text-sm text-blue-400 truncate pt-2"><span className="text-white">مدير:</span> {user?.name}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-2 md:p-4 space-y-1 overflow-x-auto">


        {menuItems.map((item) => {
          if (item.adminOnly && user?.role !== "admin") {
            return null;
          }

          const Icon = item.icon;
          const active = isActive(item.path, item.exact);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-colors whitespace-nowrap ${active
                ? "bg-red-600 text-white"
                : "text-gray-300 text-sm md:text-base hover:bg-gray-800 hover:text-white"
                }`}
            >
              <Icon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
              <span className="text-sm md:text-base">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-2 md:p-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 p-1 md:p-2 rounded-lg hover:bg-gray-800 hover:text-white transition-colors whitespace-nowrap cursor-pointer"
        >
          <LogOut className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 text-red-800" />
          <span className="text-xs sm:text-sm md:text-base">تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
