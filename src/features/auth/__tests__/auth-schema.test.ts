import {
  forgotPasswordSchema,
  resetPasswordPublicSchema,
} from "../validation/auth.schema.ts";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

// 1. forgotPasswordSchema validation tests
const emptyRes = forgotPasswordSchema.safeParse({ email: "" });
assert(!emptyRes.success, "Empty email should fail");

const invalidRes = forgotPasswordSchema.safeParse({ email: "invalid-email" });
assert(!invalidRes.success, "Invalid email format should fail");

const validEmailRes = forgotPasswordSchema.safeParse({ email: "user@example.com" });
assert(validEmailRes.success, "Valid email should pass");

// 2. resetPasswordPublicSchema validation tests
const shortPassRes = resetPasswordPublicSchema.safeParse({
  password_baru: "12345",
  confirmPassword: "12345",
});
assert(!shortPassRes.success, "Short password (<8 chars) should fail");

const mismatchRes = resetPasswordPublicSchema.safeParse({
  password_baru: "password123",
  confirmPassword: "different123",
});
assert(!mismatchRes.success, "Mismatched passwords should fail");

const validPassRes = resetPasswordPublicSchema.safeParse({
  password_baru: "supersecret123",
  confirmPassword: "supersecret123",
});
assert(validPassRes.success, "Valid password with matching confirmation should pass");

console.log("Auth schema tests passed successfully!");
