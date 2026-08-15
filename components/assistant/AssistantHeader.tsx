"use client";

import { motion } from "framer-motion";
import { Bot, Sparkles } from "lucide-react";

interface AssistantHeaderProps {
  contextLoaded: boolean;
}

export function AssistantHeader({ contextLoaded }: AssistantHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="flex items-center gap-4">
        <motion.div
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/50 relative overflow-hidden"
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Bot className="w-8 h-8 text-black relative z-10" />
          {contextLoaded && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          )}
        </motion.div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Smart Assistant
            </h1>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </motion.div>
          </div>
          <p className="text-gray-400 mt-1">
            {contextLoaded 
              ? "Powered by your network data • Ask me anything!" 
              : "Loading your network context..."}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
