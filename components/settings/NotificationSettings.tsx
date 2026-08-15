"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, Mail, MessageSquare } from "lucide-react";

export function NotificationSettings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="border-2 border-gray-800 bg-gradient-to-br from-gray-900 to-black hover:border-yellow-500/30 transition-all">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <Bell className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Notifications</CardTitle>
              <CardDescription className="text-gray-400">Manage how you receive updates</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <motion.div 
            className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-yellow-500/30 transition-all"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-400" />
              <div>
                <Label htmlFor="email-notifs" className="text-sm font-semibold text-gray-200">
                  Email Notifications
                </Label>
                <p className="text-xs text-gray-500">Receive updates via email</p>
              </div>
            </div>
            <Switch id="email-notifs" defaultChecked />
          </motion.div>

          <motion.div 
            className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-yellow-500/30 transition-all"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-yellow-400" />
              <div>
                <Label htmlFor="follow-up-reminders" className="text-sm font-semibold text-gray-200">
                  Follow-up Reminders
                </Label>
                <p className="text-xs text-gray-500">Get reminded about pending follow-ups</p>
              </div>
            </div>
            <Switch id="follow-up-reminders" defaultChecked />
          </motion.div>

          <motion.div 
            className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-yellow-500/30 transition-all"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-green-400" />
              <div>
                <Label htmlFor="insights" className="text-sm font-semibold text-gray-200">
                  Weekly Insights
                </Label>
                <p className="text-xs text-gray-500">Receive weekly network insights</p>
              </div>
            </div>
            <Switch id="insights" defaultChecked />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
