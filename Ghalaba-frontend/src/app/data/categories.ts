// خريطة ترجمة التصنيفات (عربي → إنجليزي)
export const categoryMap: Record<string, string> = {
  "سياسة": "Politics",
  "اقتصاد": "Economy",
  "رياضة": "Sports",
  "ثقافة": "Culture",
  "تقنية": "Technology",
  "تعليم": "Education",
  "صحة": "Health",
  "فن": "Art",
  "علوم": "Science",
  "محلي": "Local",
  "عالمي": "World",
};

/**
 * ترجمة اسم التصنيف حسب اللغة المختارة
 * @param category - اسم التصنيف بالعربية (كما هو مخزّن في قاعدة البيانات)
 * @param language - اللغة المطلوبة ("ar" | "en")
 */
export function getCategoryName(category: string, language: "ar" | "en"): string {
  if (language === "ar") return category;
  return categoryMap[category] || category;
}
