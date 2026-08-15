"use client";

import { motion } from "framer-motion";
import { UserButton, useUser } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";

export function UserSection() {
  const { user } = useUser();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex-shrink-0 border-t border-gray-800 p-4"
    >
      <motion.div
        className="flex items-center w-full p-3 rounded-xl bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700 hover:border-yellow-500/50 transition-all group cursor-pointer"
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="relative">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-10 h-10 ring-2 ring-yellow-400/50 ring-offset-2 ring-offset-gray-900",
              },
            }}
          />
          {/* Online indicator */}
          <motion.div
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        <div className="ml-3 flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate flex items-center gap-1">
            {user?.fullName || user?.firstName || "User"}
            <Sparkles className="w-3 h-3 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </p>
          <p className="text-xs text-gray-400 truncate">
            {user?.primaryEmailAddress?.emailAddress || "Manage account"}
          </p>
        </div>

        {/* Hover indicator */}
        <motion.div
          className="w-2 h-2 rounded-full bg-yellow-400 opacity-0 group-hover:opacity-100"
          initial={false}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
    </motion.div>
  );
}
