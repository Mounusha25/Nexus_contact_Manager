export type InteractionType = "email" | "call" | "meeting" | "dm" | "other";
export type Direction = "inbound" | "outbound";
export type LifecycleStage = "new" | "active" | "dormant" | "archived";
export type ContactType = "recruiter" | "client" | "investor" | "friend" | "other";

export interface ScoredInteraction {
  type: InteractionType;
  direction: Direction;
  timestamp: number;
}

export interface DuplicateContact {
  name: string;
  emails: string[];
  phones: string[];
  company?: string;
}

export interface DuplicateScore {
  confidence: number;
  reasons: string[];
}

const DAY_MS = 24 * 60 * 60 * 1000;

const CHANNEL_WEIGHTS: Record<InteractionType, number> = {
  meeting: 10,
  call: 7,
  email: 4,
  dm: 3,
  other: 2,
};

function recencyWeight(ageDays: number): number {
  if (ageDays <= 30) return 1;
  if (ageDays <= 60) return 0.65;
  if (ageDays <= 90) return 0.35;
  return 0;
}

/**
 * Deterministic 0-100 relationship score.
 *
 * The score combines channel quality, 30/60/90-day recency decay, a frequency
 * multiplier capped at 1.5x, and a 20% two-way communication bonus. Interactions
 * from the future are treated as current and records older than 90 days do not
 * contribute to the active relationship score.
 */
export function calculateRelationshipScore(
  interactions: ScoredInteraction[],
  now = Date.now(),
): number {
  const recent = interactions.filter(({ timestamp }) => timestamp >= now - 90 * DAY_MS);
  if (recent.length === 0) return 0;

  const weightedActivity = recent.reduce((total, interaction) => {
    const ageDays = Math.max(0, (now - interaction.timestamp) / DAY_MS);
    return total + CHANNEL_WEIGHTS[interaction.type] * recencyWeight(ageDays);
  }, 0);

  const frequencyMultiplier = Math.min(1.5, 1 + Math.max(0, recent.length - 1) * 0.05);
  const directions = new Set(recent.map(({ direction }) => direction));
  const bidirectionalMultiplier = directions.size === 2 ? 1.2 : 1;

  return Math.min(100, Math.round(weightedActivity * frequencyMultiplier * bidirectionalMultiplier));
}

export function levenshteinDistance(left: string, right: string): number {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const current = [leftIndex];
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const substitution = previous[rightIndex - 1] +
        (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1);
      current[rightIndex] = Math.min(
        previous[rightIndex] + 1,
        current[rightIndex - 1] + 1,
        substitution,
      );
    }
    previous.splice(0, previous.length, ...current);
  }

  return previous[right.length];
}

export function similarityScore(left: string, right: string): number {
  const normalizedLeft = left.trim().toLowerCase();
  const normalizedRight = right.trim().toLowerCase();
  const maxLength = Math.max(normalizedLeft.length, normalizedRight.length);
  if (maxLength === 0) return 1;
  return 1 - levenshteinDistance(normalizedLeft, normalizedRight) / maxLength;
}

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function normalizePhone(value: string): string {
  return value.replace(/\D/g, "");
}

function overlaps(left: string[], right: string[], normalize: (value: string) => string): boolean {
  const rightValues = new Set(right.map(normalize).filter(Boolean));
  return left.map(normalize).filter(Boolean).some((value) => rightValues.has(value));
}

export function calculateDuplicateScore(
  contact: DuplicateContact,
  candidate: DuplicateContact,
): DuplicateScore {
  let confidence = 0;
  const reasons: string[] = [];
  const nameSimilarity = similarityScore(contact.name, candidate.name);

  if (overlaps(contact.emails, candidate.emails, normalizeEmail)) {
    confidence += 0.8;
    reasons.push("Same email");
  }
  if (nameSimilarity > 0.85) {
    confidence += 0.6 * nameSimilarity;
    reasons.push("Similar name");
  }
  if (
    contact.company &&
    candidate.company &&
    contact.company.trim().toLowerCase() === candidate.company.trim().toLowerCase() &&
    nameSimilarity > 0.7
  ) {
    confidence += 0.5;
    reasons.push("Same company");
  }
  if (overlaps(contact.phones, candidate.phones, normalizePhone)) {
    confidence += 0.7;
    reasons.push("Same phone");
  }

  return { confidence: Math.min(confidence, 1), reasons };
}

export function classifyContact(title?: string, company?: string): ContactType {
  const normalizedTitle = title?.trim().toLowerCase() ?? "";
  const normalizedCompany = company?.trim().toLowerCase() ?? "";

  if (
    normalizedTitle.includes("recruiter") ||
    normalizedTitle.includes("talent") ||
    normalizedTitle.includes("hiring") ||
    normalizedCompany.includes("recruiting")
  ) return "recruiter";

  if (
    normalizedTitle.includes("investor") ||
    normalizedTitle.includes("venture") ||
    /\bvc\b/.test(normalizedTitle) ||
    (normalizedTitle.includes("partner") && normalizedCompany.includes("capital"))
  ) return "investor";

  if (normalizedTitle.includes("client") || normalizedTitle.includes("customer")) {
    return "client";
  }

  return "other";
}

export function determineLifecycleStage(input: {
  currentStage: LifecycleStage;
  lastInteractionAt?: number;
  recentInteractionCount: number;
  relationshipScore: number;
  now?: number;
}): { stage: LifecycleStage; explanation: string } {
  const now = input.now ?? Date.now();
  const daysSinceInteraction = input.lastInteractionAt === undefined
    ? undefined
    : Math.floor((now - input.lastInteractionAt) / DAY_MS);

  if (input.lastInteractionAt === undefined && input.recentInteractionCount === 0) {
    return { stage: "new", explanation: "New contact with no interactions" };
  }
  if (daysSinceInteraction !== undefined && daysSinceInteraction >= 365) {
    return { stage: "archived", explanation: "No contact in over 1 year" };
  }
  if (daysSinceInteraction !== undefined && daysSinceInteraction >= 60) {
    return { stage: "dormant", explanation: `No contact in ${daysSinceInteraction} days` };
  }
  if (input.recentInteractionCount >= 2) {
    return {
      stage: "active",
      explanation: `${input.recentInteractionCount} interactions in last 60 days`,
    };
  }
  if (input.recentInteractionCount === 1) {
    return input.relationshipScore > 50
      ? { stage: "active", explanation: "Recent interaction with good relationship score" }
      : { stage: "new", explanation: "Limited interaction history" };
  }

  return { stage: input.currentStage, explanation: "No lifecycle change" };
}

export function mergeUnique(...groups: string[][]): string[] {
  const seen = new Set<string>();
  const merged: string[] = [];
  for (const value of groups.flat()) {
    const normalized = value.trim().toLowerCase();
    if (normalized && !seen.has(normalized)) {
      seen.add(normalized);
      merged.push(value.trim());
    }
  }
  return merged;
}
