"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { PieChartIcon } from "lucide-react";

const COLORS = ["#10B981", "#F5B301", "#EF4444", "#6B7280"];

interface RelationshipChartCardProps {
  data: Array<{ name: string; value: number }>;
}

export function RelationshipChartCard({ data }: RelationshipChartCardProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6 }}
    >
      <Card className="border-2 border-gray-800 bg-gradient-to-br from-gray-900 to-black hover:border-yellow-500/30 transition-all">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <PieChartIcon className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Relationship Distribution</CardTitle>
              <CardDescription className="text-gray-400">Connection strength breakdown</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                wrapperStyle={{ color: "#9CA3AF", fontSize: "12px" }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">Total: <span className="font-bold text-yellow-400">{total}</span> relationships tracked</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
