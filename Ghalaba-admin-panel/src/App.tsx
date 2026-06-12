import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AdminLayout } from "./layouts/AdminLayout";
import { AdminDashboard } from "./pages/AdminDashboard";
import { Login } from "./pages/Login";
import { Articles } from "./pages/Articles";
import { Users } from "./pages/Users";
import { Settings } from "./pages/Settings";
import "./index.css";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to="/admin" replace />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        {
          index: true,
          element: <AdminDashboard />,
        },
        {
          path: "articles",
          element: <Articles />,
        },
        {
          path: "members",
          element: <Users />,
        },
        {
          path: "settings",
          element: <Settings />,
        },
      ],
    },
  ]);

  return (
    <LanguageProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;

// Helper function to use language in route elements
function useLanguage() {
  const { language, t } = { language: "ar", t: (ar: string, en: string) => ar };
  return { language, t };
}
