import { portalLoginSchema } from "../validation/portal.schema";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

// 1. Validation Tests: Empty Fields
const emptySlug = portalLoginSchema.safeParse({
  slug_sekolah: "",
  nis: "NIS123",
  no_telepon: "081234567890",
});
assert(!emptySlug.success, "Empty slug_sekolah should fail");

const emptyNis = portalLoginSchema.safeParse({
  slug_sekolah: "pesantren-nurul-quran",
  nis: "",
  no_telepon: "081234567890",
});
assert(!emptyNis.success, "Empty nis should fail");

// 2. Phone Validation: Short phone & Invalid characters
const shortPhone = portalLoginSchema.safeParse({
  slug_sekolah: "pesantren-nurul-quran",
  nis: "NIS123",
  no_telepon: "1234",
});
assert(!shortPhone.success, "Short phone (<9 digits) should fail");

const invalidPhone = portalLoginSchema.safeParse({
  slug_sekolah: "pesantren-nurul-quran",
  nis: "NIS123",
  no_telepon: "0812abcde",
});
assert(!invalidPhone.success, "Phone with alphabets should fail");

// 3. Valid Portal Login Payload
const validPayload = portalLoginSchema.safeParse({
  slug_sekolah: "pesantren-nurul-quran",
  nis: "NIS2024001",
  no_telepon: "081234567890",
});
assert(validPayload.success, "Valid portal credentials should pass");

if (validPayload.success) {
  assert(validPayload.data.slug_sekolah === "pesantren-nurul-quran", "Slug should match");
  assert(validPayload.data.nis === "NIS2024001", "NIS should match");
  assert(validPayload.data.no_telepon === "081234567890", "Phone should match");
}

console.log("All portal tests passed successfully!");
