import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useEffect } from "react";
import { AdminSidebar } from "../components/AdminSidebar";

export function AdminLayout() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row" dir={useLanguage().dir}>
      <AdminSidebar />
      <main className="flex-1 p-2 sm:p-4 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
