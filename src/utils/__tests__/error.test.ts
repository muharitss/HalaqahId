import { describe, it, expect } from "vitest";
import { getErrorMessage } from "../error";

describe("getErrorMessage", () => {
  it("returns plain string message from data.message", () => {
    const error = { response: { data: { message: "Invalid credentials" } } };
    expect(getErrorMessage(error, "Fallback")).toBe("Invalid credentials");
  });

  it("joins array messages from validation errors", () => {
    const error = { response: { data: { message: ["Email invalid", "Password too short"] } } };
    expect(getErrorMessage(error, "Fallback")).toBe("Email invalid, Password too short");
  });

  it("extracts message from error object", () => {
    const error = { response: { data: { error: { message: "Account locked" } } } };
    expect(getErrorMessage(error, "Fallback")).toBe("Account locked");
  });

  it("handles string error and Error instance", () => {
    expect(getErrorMessage("String error", "Fallback")).toBe("String error");
    expect(getErrorMessage(new Error("Standard error"), "Fallback")).toBe("Standard error");
  });

  it("returns fallback for null or empty errors", () => {
    expect(getErrorMessage(null, "Fallback")).toBe("Fallback");
    expect(getErrorMessage({}, "Fallback")).toBe("Fallback");
  });
});
