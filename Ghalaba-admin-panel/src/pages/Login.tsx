import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate } from "react-router";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate("/admin");
      } else {
        setError(t("البريد الإلكتروني أو كلمة المرور غير صحيحة", "Invalid email or password"));
      }
    } catch (err) {
      setError(t("حدث خطأ ما، يرجى المحاولة مرة أخرى", "An error occurred, please try again"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8" dir={useLanguage().dir}>
      <div className="max-w-md w-full md:space-y-6 space-y-2">
        <div>
          <div className="mx-auto h-12 w-12 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">غ</span>
          </div>
          <h2 className="mt-6 text-center text-base text-xl font-bold text-red-600">
            {t("صحيفة الغلابه", "Ghalaba Newspaper")}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t("لوحة تحكم موقع الغلابه الإخباري", "Ghalaba Newspaper Admin Panel")}
          </p>
        </div>

        <form className="mt-8 space-y-4 md:space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm">
            <div className="mb-2 md:mb-4">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm md:text-base"
                placeholder={("User Name")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                dir="ltr"
              />
            </div>

            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm md:text-base"
                placeholder={("Password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                dir="ltr"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center p-2">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full text-sm md:text-base flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                t("جاري تسجيل الدخول...", "Signing in...")
              ) : (
                t("تسجيل الدخول", "Sign in")
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
