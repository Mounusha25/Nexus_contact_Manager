"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gradient-to-b from-gray-900/50 to-black/50 rounded-lg border-2 border-gray-800">
      <AnimatePresence initial={false}>
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "flex gap-3 items-start",
              message.role === "user" ? "flex-row-reverse" : "flex-row"
            )}
          >
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg",
                message.role === "user"
                  ? "bg-gradient-to-br from-blue-400 to-blue-600"
                  : "bg-gradient-to-br from-yellow-400 to-yellow-600"
              )}
            >
              {message.role === "user" ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Bot className="w-5 h-5 text-black" />
              )}
            </motion.div>

            {/* Message Content */}
            <motion.div
              initial={{ opacity: 0, x: message.role === "user" ? 10 : -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={cn(
                "flex-1 p-4 rounded-2xl max-w-[80%] shadow-lg",
                message.role === "user"
                  ? "bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-2 border-blue-500/50 text-gray-100"
                  : "bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-yellow-500/30 text-gray-200"
              )}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              
              {/* Timestamp */}
              <p className="text-xs text-gray-500 mt-2">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Loading Indicator */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 items-start"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
            <Bot className="w-5 h-5 text-black" />
          </div>
          <div className="flex-1 p-4 rounded-2xl max-w-[80%] bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-yellow-500/30">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />
              <span className="text-sm text-gray-400">Thinking...</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {messages.length === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center h-full text-center p-8"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center mb-4 shadow-lg shadow-yellow-500/50"
          >
            <Bot className="w-10 h-10 text-black" />
          </motion.div>
          <h3 className="text-xl font-bold text-gray-300 mb-2">Ready to Help!</h3>
          <p className="text-gray-500 max-w-md">
            Ask me anything about your contacts, relationships, or get insights about your network.
          </p>
        </motion.div>
      )}
    </div>
  );
}
