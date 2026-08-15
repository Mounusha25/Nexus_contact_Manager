"use client";

import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
}

export function ChatInput({ value, onChange, onSend, disabled }: ChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 p-4 bg-gradient-to-r from-gray-900 to-black rounded-lg border-2 border-gray-800"
    >
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Ask about your contacts, relationships, or insights..."
        disabled={disabled}
        className="flex-1 bg-gray-900 border-gray-700 focus:border-yellow-500 focus:ring-yellow-500/20 text-white placeholder:text-gray-500"
      />
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={onSend}
          disabled={disabled || !value.trim()}
          className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold hover:shadow-lg hover:shadow-yellow-500/50 transition-all disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
