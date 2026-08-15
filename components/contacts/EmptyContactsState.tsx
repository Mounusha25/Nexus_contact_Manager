"use client";

import { motion } from "framer-motion";
import { Plus, Users as UsersIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EmptyContactsStateProps {
  searchQuery: string;
}

export function EmptyContactsState({ searchQuery }: EmptyContactsStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-2 border-gray-800">
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <UsersIcon className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              No contacts found
            </h3>
            <p className="text-gray-400 mb-2 text-lg">
              {searchQuery
                ? "Try adjusting your search filters or criteria"
                : "Get started by adding your first contact"}
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Build and manage your professional network effectively
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold">
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
