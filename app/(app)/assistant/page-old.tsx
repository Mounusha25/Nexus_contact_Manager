"use client";

import { useState } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Sparkles, Database } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
  role: "user" | "assistant";
  content: string;
};

// TEMPORARY: Hardcoded user ID for testing
const HARDCODED_USER_ID = "js741ht0frav0t82dveqk94cv17ybpe1" as any;

const EXAMPLE_QUERIES = [
  "Who should I reconnect with this week?",
  "Show me all dormant contacts in tech",
  "How many recruiters do I have?",
  "Draft a follow-up email for my top contact",
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatWithAssistant = useAction(api.aiAssistant.chatWithAssistant);
  
  // Load contacts and analytics for context
  const contacts = useQuery(api.contacts.getContactsByUserId, { userId: HARDCODED_USER_ID });
  const analytics = useQuery(api.analytics.getDashboardAnalyticsByUserId, { userId: HARDCODED_USER_ID });

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
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-accent rounded-xl">
            <Bot className="h-6 w-6 text-black" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">AI Assistant</h1>
            <p className="text-gray-400 mt-1">Your networking intelligence coach</p>
          </div>
          {contacts && analytics && (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
              <Database className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-500">
                {contacts.length} contacts loaded
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Chat Container */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Welcome Message */}
          {messages.length === 0 && (
            <div className="text-center py-12">
              <Sparkles className="h-16 w-16 text-accent mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-4">How can I help you today?</h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                I can help you identify who to reconnect with, draft emails, analyze your network,
                and provide insights about your relationships.
              </p>

              {/* Example Queries */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
                {EXAMPLE_QUERIES.map((query) => (
                  <button
                    key={query}
                    onClick={() => handleExampleClick(query)}
                    className="p-4 text-left bg-surface-light hover:bg-surface border border-border hover:border-accent/50 rounded-xl transition-all group"
                  >
                    <p className="text-sm group-hover:text-accent transition-colors">{query}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex items-start space-x-3",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                  <Bot className="h-5 w-5 text-black" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3",
                  message.role === "user"
                    ? "bg-accent text-black"
                    : "bg-surface-light text-white border border-border"
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.role === "user" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-light flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
              )}
            </div>
          ))}

          {/* Loading */}
          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                <Bot className="h-5 w-5 text-black" />
              </div>
              <div className="bg-surface-light rounded-2xl px-4 py-3 border border-border">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {/* Input Area */}
        <div className="border-t border-border p-4">
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Ask me anything about your network..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button onClick={() => handleSend()} disabled={!input.trim() || isLoading} size="md">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Try commands like: /followups, /draft-email, /cold-contacts, /summary
          </p>
        </div>
      </Card>
    </div>
  );
}
