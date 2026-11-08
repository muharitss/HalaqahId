import { describe, it, expect, afterEach } from "vitest";
import { getTenantSlugFromUrl } from "../tenant";

describe("getTenantSlugFromUrl", () => {
  const originalWindow = (globalThis as any).window;

  const setLocation = (hostname: string, search: string = "") => {
    (globalThis as any).window = {
      location: {
        hostname,
        search,
      },
    };
  };

  afterEach(() => {
    (globalThis as any).window = originalWindow;
  });

  it("should extract tenant from query param ?tenant=pesantren-a", () => {
    setLocation("halaqah-id.vercel.app", "?tenant=pesantren-a");
    expect(getTenantSlugFromUrl()).toBe("pesantren-a");
  });

  it("should ignore Vercel platform hostname halaqah-id.vercel.app and fallback to default", () => {
    setLocation("halaqah-id.vercel.app");
    expect(getTenantSlugFromUrl()).toBe("default");
  });

  it("should ignore backend host halaqahid-be.vercel.app and fallback to default", () => {
    setLocation("halaqahid-be.vercel.app");
    expect(getTenantSlugFromUrl()).toBe("default");
  });

  it("should resolve tenant subdomain on custom domain pesantren-a.halaqah.id", () => {
    setLocation("pesantren-a.halaqah.id");
    expect(getTenantSlugFromUrl()).toBe("pesantren-a");
  });

  it("should fallback to default on root custom domain halaqah.id", () => {
    setLocation("halaqah.id");
    expect(getTenantSlugFromUrl()).toBe("default");
  });

  it("should resolve localhost subdomain pesantren-a.localhost", () => {
    setLocation("pesantren-a.localhost");
    expect(getTenantSlugFromUrl()).toBe("pesantren-a");
  });

  it("should fallback to default on localhost", () => {
    setLocation("localhost");
    expect(getTenantSlugFromUrl()).toBe("default");
  });

  it("should ignore reserved subdomains like admin.halaqah.id and fallback to default", () => {
    setLocation("admin.halaqah.id");
    expect(getTenantSlugFromUrl()).toBe("default");
  });
});
