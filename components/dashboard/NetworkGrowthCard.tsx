"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

interface NetworkGrowthCardProps {
  data: Array<{ month: string; count: number }>;
}

export function NetworkGrowthCard({ data }: NetworkGrowthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="border-2 border-gray-800 bg-gradient-to-br from-gray-900 to-black hover:border-yellow-500/30 transition-all">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                <TrendingUp className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Network Growth</CardTitle>
                <CardDescription className="text-gray-400">Last 6 months</CardDescription>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-yellow-400">{data[data.length - 1]?.count || 0}</p>
              <p className="text-xs text-gray-500">Total Contacts</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
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
