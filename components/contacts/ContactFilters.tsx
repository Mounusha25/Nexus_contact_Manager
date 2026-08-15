"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ContactFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const filters = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "New", value: "new" },
  { label: "Dormant", value: "dormant" },
];

export function ContactFilters({ activeFilter, onFilterChange }: ContactFiltersProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map((filter) => (
        <motion.button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all border-2",
            activeFilter === filter.value
              ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black border-yellow-400 shadow-lg shadow-yellow-500/50"
              : "bg-gray-900 text-gray-300 border-gray-700 hover:border-yellow-500/50"
          )}
        >
          {filter.label}
        </motion.button>
      ))}
    </div>
  );
}
