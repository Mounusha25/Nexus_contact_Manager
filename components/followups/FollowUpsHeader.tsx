"use client";

import { motion } from "framer-motion";
import { Bell } from "lucide-react";

interface FollowUpsHeaderProps {
  count: number;
}

export function FollowUpsHeader({ count }: FollowUpsHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 mb-6"
    >
      <motion.div
        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/50 relative"
        whileHover={{ scale: 1.05, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Bell className="w-8 h-8 text-black" />
        {count > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-gray-900"
          >
            {count}
          </motion.div>
        )}
      </motion.div>
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          Follow-ups
        </h1>
        <p className="text-gray-400 mt-1">
          {count === 0 ? "You're all caught up!" : `${count} ${count === 1 ? "contact needs" : "contacts need"} your attention`}
        </p>
      </div>
    </motion.div>
  );
}
