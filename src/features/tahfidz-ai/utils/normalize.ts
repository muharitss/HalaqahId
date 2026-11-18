export const normalizeArabic = (text: string): string => {
  return text
    .replace(/[\u064B-\u065F\u0670]/g, "") // Hilangkan harakat & alif khanjariyah (U+0670)
    .replace(/[إأآا]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[\u06D6-\u06ED]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};
