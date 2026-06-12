import { createBrowserRouter } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { HomePage } from "./pages/HomePage";
import { ArticlePage } from "./pages/ArticlePage";
import { SearchPage } from "./pages/SearchPage";
import { MediaGalleryPage } from "./pages/MediaGalleryPage";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "article/:slug", Component: ArticlePage },
      { path: "search", Component: SearchPage },
      { path: "media", Component: MediaGalleryPage },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
