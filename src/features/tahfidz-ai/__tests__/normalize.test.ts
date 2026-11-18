import { describe, it, expect } from "vitest";
import { normalizeArabic } from "../utils/normalize";

describe("normalizeArabic", () => {
  it("strips harakat and normalizes alef, ta marbuta, and alif maksura to ya", () => {
    expect(normalizeArabic("إِلَىٰ عَلَىٰ مُوسَىٰ")).toBe("الي علي موسي");
    expect(normalizeArabic("رَحْمَةُ اللَّهِ")).toBe("رحمه الله");
    expect(normalizeArabic("أَنْتَ   آدَمُ")).toBe("انت ادم");
  });
});
