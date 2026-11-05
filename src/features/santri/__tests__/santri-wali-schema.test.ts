import { santriWaliSchema } from "../validation/santri-wali.schema.ts";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

// 1. Required fields
const emptyName = santriWaliSchema.safeParse({
  nama_wali: "",
  hubungan: "AYAH",
});
assert(!emptyName.success, "Empty nama_wali should fail");

// 2. Invalid hubungan
const invalidHubungan = santriWaliSchema.safeParse({
  nama_wali: "Ahmad",
  hubungan: "TEMAN",
});
assert(!invalidHubungan.success, "Invalid hubungan should fail");

// 3. Valid minimal data
const validMinimal = santriWaliSchema.safeParse({
  nama_wali: "Hendra Gunawan",
  hubungan: "AYAH",
});
assert(validMinimal.success, "Valid minimal data should pass");

// 4. Invalid phone number
const shortPhone = santriWaliSchema.safeParse({
  nama_wali: "Hendra Gunawan",
  hubungan: "AYAH",
  no_telepon: "12345",
});
assert(!shortPhone.success, "Short phone should fail");

// 5. Valid phone number
const validPhone = santriWaliSchema.safeParse({
  nama_wali: "Hendra Gunawan",
  hubungan: "AYAH",
  no_telepon: "081234567890",
});
assert(validPhone.success, "Valid phone should pass");

// 6. Invalid email
const invalidEmail = santriWaliSchema.safeParse({
  nama_wali: "Hendra Gunawan",
  hubungan: "AYAH",
  email: "bukan-email",
});
assert(!invalidEmail.success, "Invalid email should fail");

// 7. Full valid data
const fullValid = santriWaliSchema.safeParse({
  nama_wali: "Hendra Gunawan",
  hubungan: "AYAH",
  no_telepon: "081234567890",
  email: "wali@example.com",
  is_primary_contact: true,
});
assert(fullValid.success, "Full valid data should pass");

console.log("Santri wali schema tests passed successfully!");
