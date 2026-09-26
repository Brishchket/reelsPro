import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  validateEmail,
  validatePassword,
  validateVideoPayload,
} from "./validation.ts";

describe("validateEmail", () => {
  it("rejects empty and malformed emails", () => {
    assert.equal(validateEmail(""), "Email is required");
    assert.equal(validateEmail("not-an-email"), "Enter a valid email address");
  });

  it("accepts a normal email", () => {
    assert.equal(validateEmail("user@example.com"), null);
  });
});

describe("validatePassword", () => {
  it("enforces length and mixed characters", () => {
    assert.equal(
      validatePassword("short"),
      "Password must be at least 8 characters"
    );
    assert.equal(
      validatePassword("longenough"),
      "Password must include a letter and a number"
    );
    assert.equal(validatePassword("abc12345"), null);
  });
});

describe("validateVideoPayload", () => {
  it("requires title, video URL, and thumbnail URL", () => {
    assert.equal(validateVideoPayload({}), "Title is required");
    assert.equal(
      validateVideoPayload({
        title: "Clip",
        videoUrl: "https://ik.imagekit.io/x/a.mp4",
        thumbnailUrl: "https://ik.imagekit.io/x/a.jpg",
      }),
      null
    );
  });
});
