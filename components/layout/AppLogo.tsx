"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function AppLogo() {
  return (
    <Link href="/dashboard" className="flex items-center h-16 px-6 border-b border-gray-800">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="flex items-center space-x-3 group"
      >
        {/* Animated Logo Icon */}
        <motion.div
          className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/50 overflow-hidden"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {/* Animated background shine */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          <span className="text-black font-bold text-xl relative z-10">N</span>
        </motion.div>

        {/* App Name */}
        <div className="flex flex-col">
          <motion.span
            className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            Nexus
          </motion.span>
          <motion.span
            className="text-xs text-gray-500 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Smart Network
          </motion.span>
        </div>
      </motion.div>
    </Link>
  );
}
