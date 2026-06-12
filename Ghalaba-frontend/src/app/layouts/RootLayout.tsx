import { Outlet } from "react-router";
import { Header } from "../components/Header";
import { BreakingNewsTicker } from "../components/BreakingNewsTicker";
import { Footer } from "../components/Footer";

export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <BreakingNewsTicker />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
