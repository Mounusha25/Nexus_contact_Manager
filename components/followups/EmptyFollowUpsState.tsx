"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export function EmptyFollowUpsState() {
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
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              All Caught Up!
            </h3>
            <p className="text-gray-400">
              No pending follow-ups. Great job maintaining your network!
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
