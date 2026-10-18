import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  calculateDuplicateScore,
  calculateRelationshipScore,
  classifyContact,
  determineLifecycleStage,
  levenshteinDistance,
  mergeUnique,
  similarityScore,
} from "../lib/crm/contact-intelligence.ts";

const DAY_MS = 24 * 60 * 60 * 1000;
const NOW = Date.UTC(2026, 9, 18);

describe("relationship scoring", () => {
  it("returns zero without recent interactions", () => {
    assert.equal(calculateRelationshipScore([], NOW), 0);
    assert.equal(calculateRelationshipScore([
      { type: "meeting", direction: "inbound", timestamp: NOW - 91 * DAY_MS },
    ], NOW), 0);
  });

  it("weights higher-quality channels more strongly", () => {
    const meeting = calculateRelationshipScore([
      { type: "meeting", direction: "outbound", timestamp: NOW },
    ], NOW);
    const email = calculateRelationshipScore([
      { type: "email", direction: "outbound", timestamp: NOW },
    ], NOW);
    assert.ok(meeting > email);
  });

  it("applies recency decay at 30, 60, and 90 days", () => {
    const current = calculateRelationshipScore([
      { type: "meeting", direction: "outbound", timestamp: NOW - 5 * DAY_MS },
    ], NOW);
    const aging = calculateRelationshipScore([
      { type: "meeting", direction: "outbound", timestamp: NOW - 45 * DAY_MS },
    ], NOW);
    const stale = calculateRelationshipScore([
      { type: "meeting", direction: "outbound", timestamp: NOW - 75 * DAY_MS },
    ], NOW);
    assert.ok(current > aging && aging > stale);
  });

  it("rewards bidirectional communication", () => {
    const oneWay = calculateRelationshipScore([
      { type: "call", direction: "outbound", timestamp: NOW },
      { type: "call", direction: "outbound", timestamp: NOW },
    ], NOW);
    const twoWay = calculateRelationshipScore([
      { type: "call", direction: "outbound", timestamp: NOW },
      { type: "call", direction: "inbound", timestamp: NOW },
    ], NOW);
    assert.ok(twoWay > oneWay);
  });

  it("caps scores at 100", () => {
    const interactions = Array.from({ length: 30 }, (_, index) => ({
      type: "meeting" as const,
      direction: index % 2 ? "inbound" as const : "outbound" as const,
      timestamp: NOW,
    }));
    assert.equal(calculateRelationshipScore(interactions, NOW), 100);
  });
});

describe("duplicate detection", () => {
  it("calculates edit distance and safe empty-string similarity", () => {
    assert.equal(levenshteinDistance("kitten", "sitting"), 3);
    assert.equal(similarityScore("", ""), 1);
  });

  it("normalizes email case and phone formatting", () => {
    const result = calculateDuplicateScore(
      { name: "Maya Patel", emails: ["MAYA@example.com"], phones: ["+1 (415) 555-0199"] },
      { name: "Maya Patel", emails: ["maya@example.com"], phones: ["14155550199"] },
    );
    assert.equal(result.confidence, 1);
    assert.deepEqual(result.reasons, ["Same email", "Similar name", "Same phone"]);
  });

  it("does not flag unrelated contacts", () => {
    const result = calculateDuplicateScore(
      { name: "Maya Patel", emails: ["maya@example.com"], phones: [], company: "Acme" },
      { name: "Jordan Lee", emails: ["jordan@example.org"], phones: [], company: "Northwind" },
    );
    assert.equal(result.confidence, 0);
    assert.deepEqual(result.reasons, []);
  });

  it("deduplicates merged fields case-insensitively", () => {
    assert.deepEqual(
      mergeUnique(["Maya@example.com", "first"], ["maya@example.com", "second"]),
      ["Maya@example.com", "first", "second"],
    );
  });
});

describe("contact classification", () => {
  it("classifies recruiters", () => assert.equal(classifyContact("Senior Talent Partner", "Acme"), "recruiter"));
  it("classifies investors", () => assert.equal(classifyContact("Partner", "North Capital"), "investor"));
  it("classifies clients", () => assert.equal(classifyContact("Customer Success Lead", "Acme"), "client"));
  it("uses other as a safe default", () => assert.equal(classifyContact(undefined, undefined), "other"));
});

describe("lifecycle classification", () => {
  it("keeps untouched contacts new", () => {
    assert.equal(determineLifecycleStage({ currentStage: "active", recentInteractionCount: 0, relationshipScore: 80, now: NOW }).stage, "new");
  });

  it("archives contacts inactive for a year", () => {
    assert.equal(determineLifecycleStage({ currentStage: "active", lastInteractionAt: NOW - 366 * DAY_MS, recentInteractionCount: 0, relationshipScore: 80, now: NOW }).stage, "archived");
  });

  it("marks contacts inactive for 60 days dormant", () => {
    assert.equal(determineLifecycleStage({ currentStage: "active", lastInteractionAt: NOW - 61 * DAY_MS, recentInteractionCount: 0, relationshipScore: 80, now: NOW }).stage, "dormant");
  });

  it("marks repeatedly contacted relationships active", () => {
    assert.equal(determineLifecycleStage({ currentStage: "new", lastInteractionAt: NOW - DAY_MS, recentInteractionCount: 2, relationshipScore: 20, now: NOW }).stage, "active");
  });

  it("requires relationship strength for a single interaction", () => {
    assert.equal(determineLifecycleStage({ currentStage: "new", lastInteractionAt: NOW - DAY_MS, recentInteractionCount: 1, relationshipScore: 51, now: NOW }).stage, "active");
    assert.equal(determineLifecycleStage({ currentStage: "active", lastInteractionAt: NOW - DAY_MS, recentInteractionCount: 1, relationshipScore: 50, now: NOW }).stage, "new");
  });
});
