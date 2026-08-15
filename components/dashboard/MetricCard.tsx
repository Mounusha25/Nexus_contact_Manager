"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  change: string;
  color: string;
  index: number;
}

export const MetricCard = memo(function MetricCard({ title, value, icon: Icon, change, color, index }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -5 }}
    >
      <Card className="border-2 border-gray-800 hover:border-yellow-500/50 bg-gradient-to-br from-gray-900 to-black transition-all group relative overflow-hidden">
        {/* Background glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
          initial={false}
        />
        
        <CardContent className="pt-6 relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-400 mb-2">{title}</p>
              <motion.p 
                className="text-3xl font-bold"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
              >
                {value}
              </motion.p>
              <div className="flex items-center gap-2 mt-3">
                <div className={cn("w-2 h-2 rounded-full", color.replace('text-', 'bg-'))} />
                <p className={cn("text-sm font-semibold", color)}>{change}</p>
              </div>
            </div>
            <motion.div 
              className={cn("p-4 rounded-2xl bg-gray-800/50 border-2 border-gray-700 group-hover:border-yellow-500/50 transition-all", color)}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Icon className="h-6 w-6" />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});
