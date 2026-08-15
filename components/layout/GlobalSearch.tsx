"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function GlobalSearch() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 max-w-2xl"
    >
      <div className="relative group">
        <motion.div
          animate={{
            scale: isFocused ? 1.02 : 1,
          }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-yellow-400 transition-colors z-10" />
          <Input
            type="search"
            placeholder="Search people, companies, notes..."
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="pl-10 w-full bg-gray-900 border-gray-800 focus:border-yellow-500 focus:ring-yellow-500/20 text-white placeholder:text-gray-500 transition-all"
          />
        </motion.div>

        {/* Search glow effect */}
        {isFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 -z-10 blur-xl bg-yellow-500/20 rounded-lg"
          />
        )}
      </div>
    </motion.div>
  );
}
