import { describe, expect, it } from "vitest";
import { deterministicDecision } from "@/lib/scoring";
import { getDestinationUrl } from "@/config/destinations";

describe("tie-break rule", () => {
  it("majority wins and neutral is ignored", () => {
    expect(deterministicDecision(["lula", "lula", "flavio", "neutral"])).toBe("lula");
    expect(deterministicDecision(["flavio", "neutral"])).toBe("flavio");
  });
  it("tie returns null (extra question)", () => {
    expect(deterministicDecision(["lula", "flavio", "neutral"])).toBeNull();
  });
  it("Lula result opens the uploaded victory ebook", () => {
    expect(getDestinationUrl("lula")).toBe("/__l5e/assets-v1/ea62ab86-0ac3-4bdd-9cfe-3c93b0441431/por-que-lula-pode-vencer.pdf");
  });
  it("Flavio result opens the uploaded defeat ebook", () => {
    expect(getDestinationUrl("flavio")).toBe("/__l5e/assets-v1/09d846ed-28be-4893-8fe5-359dcbd7a319/por-que-lula-pode-perder.pdf");
  });
});
