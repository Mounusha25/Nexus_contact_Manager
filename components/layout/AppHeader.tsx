"use client";

import { motion } from "framer-motion";
import { GlobalSearch } from "@/components/layout/GlobalSearch";
import { QuickActions } from "@/components/layout/QuickActions";

export function AppHeader() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 border-b border-gray-800 h-16 flex items-center px-6 justify-between relative overflow-hidden"
    >
      {/* Animated background glow */}
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <GlobalSearch />
      <QuickActions />

      {/* Top border accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
    </motion.header>
  );
}
