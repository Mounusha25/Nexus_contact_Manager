"use client";

import { motion } from "framer-motion";
import { UsersIcon } from "lucide-react";

interface ContactListHeaderProps {
  totalContacts: number;
}

export function ContactListHeader({ totalContacts }: ContactListHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        <motion.div
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/50"
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <UsersIcon className="w-8 h-8 text-black" />
        </motion.div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Your Network
          </h1>
          <p className="text-gray-400 mt-1">
            {totalContacts} {totalContacts === 1 ? 'contact' : 'contacts'} in your professional network
          </p>
        </div>
      </div>
    </motion.div>
  );
}
