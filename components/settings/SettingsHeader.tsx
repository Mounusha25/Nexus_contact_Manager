"use client";

import { motion } from "framer-motion";
import { Settings } from "lucide-react";

export function SettingsHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 mb-8"
    >
      <motion.div
        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/50"
        whileHover={{ scale: 1.05, rotate: 180 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Settings className="w-8 h-8 text-black" />
      </motion.div>
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-gray-400 mt-1">Manage your account and preferences</p>
      </div>
    </motion.div>
  );
}
