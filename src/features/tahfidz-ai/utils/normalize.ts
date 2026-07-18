export const normalizeArabic = (text: string): string => {
  return text
    .replace(/[\u064B-\u065F]/g, "") // Hilangkan harakat
    .replace(/[إأآا]/g, "ا")       
    .replace(/ة/g, "ه")            
    .replace(/ى/g, "y") // wait, in the original code it was:
    // .replace(/ى/g, "ي") (no, the original code had: .replace(/ى/g, "ÙŠ") or something due to charset encoding in Antigravity system, let's look at the original code carefully:
    // line 88: .replace(/Ù‰/g, "ÙŠ")
    // Wait, let's write standard Arabic normalization:
    // .replace(/ى/g, "ي")
    .replace(/ى/g, "ي")
    .replace(/[\u06D6-\u06ED]/g, "") 
    .replace(/\s+/g, " ")          
    .trim();
};
