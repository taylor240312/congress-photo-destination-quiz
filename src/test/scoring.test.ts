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
  it("empty destination url is not used", () => {
    expect(getDestinationUrl("lula")).toBeNull();
  });
});
