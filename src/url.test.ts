import { expect, it, describe } from "vitest";
import { isExternalLink } from "./url";

it("isExternalLink", () => {
  expect(isExternalLink(undefined)).toBe(false);
  expect(isExternalLink(null)).toBe(false);
  expect(isExternalLink("")).toBe(false);
  expect(isExternalLink("path/to/page")).toBe(false);
  expect(isExternalLink("https://example.com/path/to/page")).toBe(true);
  expect(isExternalLink("http://example.com?query=param")).toBe(true);
  expect(isExternalLink("//example.com/path?query=param#hash")).toBe(true);
});
