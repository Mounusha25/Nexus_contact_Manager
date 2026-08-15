"use client";

import { useState, useEffect, useRef } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AssistantHeader } from "@/components/assistant/AssistantHeader";
import { ExampleQueries } from "@/components/assistant/ExampleQueries";
import { ChatMessages } from "@/components/assistant/ChatMessages";
import { ChatInput } from "@/components/assistant/ChatInput";

type Message = {
  role: "user" | "assistant";
  content: string;
};

// TEMPORARY: Hardcoded user ID for testing
const HARDCODED_USER_ID = "js741ht0frav0t82dveqk94cv17ybpe1" as any;

const EXAMPLE_QUERIES = [
  "Who should I reconnect with this week?",
  "Show me all dormant contacts in tech",
  "How many recruiters are in my network?",
  "Draft a follow-up email for my top contact",
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const chatWithAssistant = useAction(api.aiAssistant.chatWithAssistant);
  
  // Load contacts and analytics for context
  const contacts = useQuery(api.contacts.getContactsByUserId, { userId: HARDCODED_USER_ID });
  const analytics = useQuery(api.analytics.getDashboardAnalyticsByUserId, { userId: HARDCODED_USER_ID });

  const contextLoaded = !!contacts && !!analytics;

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (message?: string) => {
    const userMessage = message || input.trim();
    if (!userMessage || isLoading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await chatWithAssistant({ 
        messages: newMessages,
        userId: HARDCODED_USER_ID 
      });
      setMessages([...newMessages, response]);
    } catch (error) {
      console.error("Error chatting with assistant:", error);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (query: string) => {
    setInput(query);
    handleSend(query);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <AssistantHeader contextLoaded={contextLoaded} />

      {messages.length === 0 && (
        <ExampleQueries 
          queries={EXAMPLE_QUERIES}
          onSelect={handleExampleClick}
          disabled={isLoading || !contextLoaded}
        />
      )}

      <div className="flex-1 flex flex-col min-h-0">
        <ChatMessages messages={messages} isLoading={isLoading} />
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4">
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={() => handleSend()}
          disabled={isLoading || !contextLoaded}
        />
      </div>
    </div>
  );
}
