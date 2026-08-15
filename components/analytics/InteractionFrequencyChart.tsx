"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface InteractionFrequencyChartProps {
  data: Array<{ type: string; count: number }>;
}

export function InteractionFrequencyChart({ data }: InteractionFrequencyChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="border-2 border-gray-800 bg-gradient-to-br from-gray-900 to-black hover:border-yellow-500/30 transition-all">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
            <CardTitle className="text-xl font-bold">Interaction Frequency</CardTitle>
          </div>
          <CardDescription className="text-gray-400">Communication channels used</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#3B3F46" />
              <XAxis type="number" stroke="#9CA3AF" />
              <YAxis dataKey="type" type="category" stroke="#9CA3AF" width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "2px solid #F5B301",
                  borderRadius: "12px",
                  boxShadow: "0 0 20px rgba(245, 179, 1, 0.3)",
                }}
                labelStyle={{ color: "#F5B301", fontWeight: "bold" }}
              />
              <Bar 
                dataKey="count" 
                fill="url(#yellowGradient)" 
                radius={[0, 8, 8, 0]}
              />
              <defs>
                <linearGradient id="yellowGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#F5B301" />
                  <stop offset="100%" stopColor="#FED053" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
