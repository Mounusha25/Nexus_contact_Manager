"use client";

import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

interface ExampleQueriesProps {
  queries: string[];
  onSelect: (query: string) => void;
  disabled: boolean;
}

export function ExampleQueries({ queries, onSelect, disabled }: ExampleQueriesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-6"
    >
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-5 h-5 text-yellow-400" />
        <h3 className="text-sm font-semibold text-gray-300">Try asking:</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {queries.map((query, index) => (
          <motion.button
            key={query}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(query)}
            disabled={disabled}
            className="text-left p-3 rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-gray-700 hover:border-yellow-500/50 text-sm text-gray-300 hover:text-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              {query}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
