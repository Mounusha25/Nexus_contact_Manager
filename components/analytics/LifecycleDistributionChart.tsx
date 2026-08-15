"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#3B82F6", "#10B981", "#EF4444"];

interface LifecycleDistributionChartProps {
  newContacts: number;
  activeContacts: number;
  dormantContacts: number;
}

export function LifecycleDistributionChart({ newContacts, activeContacts, dormantContacts }: LifecycleDistributionChartProps) {
  const data = [
    { name: "New", value: newContacts },
    { name: "Active", value: activeContacts },
    { name: "Dormant", value: dormantContacts },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
    >
      <Card className="border-2 border-gray-800 bg-gradient-to-br from-gray-900 to-black hover:border-yellow-500/30 transition-all">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
            <CardTitle className="text-xl font-bold">Lifecycle Stages</CardTitle>
          </div>
          <CardDescription className="text-gray-400">Contact engagement levels</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "2px solid #F5B301",
                  borderRadius: "12px",
                  boxShadow: "0 0 20px rgba(245, 179, 1, 0.3)",
                }}
              />
              <Legend 
                wrapperStyle={{ color: "#9CA3AF" }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
