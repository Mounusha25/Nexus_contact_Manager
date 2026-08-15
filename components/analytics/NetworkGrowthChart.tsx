"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface NetworkGrowthChartProps {
  data: Array<{ month: string; count: number }>;
}

export function NetworkGrowthChart({ data }: NetworkGrowthChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="border-2 border-gray-800 bg-gradient-to-br from-gray-900 to-black hover:border-yellow-500/30 transition-all">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
            <CardTitle className="text-xl font-bold">Network Growth</CardTitle>
          </div>
          <CardDescription className="text-gray-400">Total contacts over last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3B3F46" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "2px solid #F5B301",
                  borderRadius: "12px",
                  boxShadow: "0 0 20px rgba(245, 179, 1, 0.3)",
                }}
                labelStyle={{ color: "#F5B301", fontWeight: "bold" }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#F5B301" 
                strokeWidth={3}
                dot={{ fill: "#F5B301", strokeWidth: 2, r: 5 }}
                activeDot={{ r: 8, fill: "#FED053" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
