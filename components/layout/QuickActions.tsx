"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center space-x-3 ml-4"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold hover:shadow-lg hover:shadow-yellow-500/50 transition-all relative overflow-hidden group">
          {/* Animated shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <Plus className="h-4 w-4 mr-2 relative z-10" />
          <span className="relative z-10">Add Contact</span>
        </Button>
      </motion.div>
    </motion.div>
  );
}
