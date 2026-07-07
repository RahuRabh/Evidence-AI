import type {
  ResearchAnswer,
  ChatMessage,
  StoredMessage,
} from "../../types/chat";

export function makeId(): string {
  return crypto.randomUUID();
}

export function isResearchAnswer(content: unknown): content is ResearchAnswer {
  return Boolean(
    content &&
    typeof content === "object" &&
    "conditionOverview" in content &&
    "researchInsights" in content,
  );
}

export function mapStoredMessagesToChatMessages(
  storedMessages: StoredMessage[],
): ChatMessage[] {
  return storedMessages
    .map<ChatMessage | null>((item) => {
      if (item.role === "user" && typeof item.content === "string") {
        return { id: item._id, role: "user", content: item.content };
      }
      if (item.role === "assistant" && isResearchAnswer(item.content)) {
        return {
          id: item._id,
          role: "assistant",
          answer: item.content,
          sources: item.sourcesUsed ?? [],
        };
      }
      return null;
    })
    .filter((item): item is ChatMessage => item !== null);
}
