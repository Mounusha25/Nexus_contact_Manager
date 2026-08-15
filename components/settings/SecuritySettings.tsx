"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Key, Lock } from "lucide-react";

export function SecuritySettings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="border-2 border-gray-800 bg-gradient-to-br from-gray-900 to-black hover:border-yellow-500/30 transition-all">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <Shield className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Security & Privacy</CardTitle>
              <CardDescription className="text-gray-400">Manage your account security</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <motion.div 
            className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-yellow-500/30 transition-all"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-sm font-semibold text-gray-200">Change Password</p>
                  <p className="text-xs text-gray-500">Update your login credentials</p>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="sm" variant="outline" className="border-gray-700">
                  Update
                </Button>
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-yellow-500/30 transition-all"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-sm font-semibold text-gray-200">Two-Factor Authentication</p>
                  <p className="text-xs text-gray-500">Add an extra layer of security</p>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="sm" variant="outline" className="border-gray-700">
                  Enable
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
