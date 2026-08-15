"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ContactTypeStatsProps {
  recruiters: number;
  clients: number;
  investors: number;
  strongRelationships: number;
}

export function ContactTypeStats({ recruiters, clients, investors, strongRelationships }: ContactTypeStatsProps) {
  const stats = [
    { label: "Recruiters", value: recruiters, color: "text-yellow-400", bgColor: "bg-yellow-400/10" },
    { label: "Clients", value: clients, color: "text-blue-400", bgColor: "bg-blue-400/10" },
    { label: "Investors", value: investors, color: "text-purple-400", bgColor: "bg-purple-400/10" },
    { label: "Strong Bonds", value: strongRelationships, color: "text-green-400", bgColor: "bg-green-400/10" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="border-2 border-gray-800 bg-gradient-to-br from-gray-900 to-black">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
            <CardTitle className="text-xl font-bold">Contact Type Breakdown</CardTitle>
          </div>
          <CardDescription className="text-gray-400">How your network is categorized</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`text-center p-6 ${stat.bgColor} rounded-xl border-2 border-gray-800 hover:border-yellow-500/30 transition-all cursor-pointer`}
              >
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-gray-400 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
