"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCircle, Mail, Building, Calendar } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export function AccountSection() {
  const { user } = useUser();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-2 border-gray-800 bg-gradient-to-br from-gray-900 to-black hover:border-yellow-500/30 transition-all">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <UserCircle className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Account Information</CardTitle>
              <CardDescription className="text-gray-400">Your personal details</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <motion.div 
            className="p-4 rounded-lg bg-gray-800/50 border border-gray-700"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Mail className="w-4 h-4 text-yellow-400" />
              <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
            </div>
            <p className="text-sm font-semibold text-gray-200">
              {user?.primaryEmailAddress?.emailAddress || "Not available"}
            </p>
          </motion.div>

          <motion.div 
            className="p-4 rounded-lg bg-gray-800/50 border border-gray-700"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <UserCircle className="w-4 h-4 text-yellow-400" />
              <p className="text-xs text-gray-500 uppercase tracking-wide">Full Name</p>
            </div>
            <p className="text-sm font-semibold text-gray-200">
              {user?.fullName || "Not set"}
            </p>
          </motion.div>

          <motion.div 
            className="p-4 rounded-lg bg-gray-800/50 border border-gray-700"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-4 h-4 text-yellow-400" />
              <p className="text-xs text-gray-500 uppercase tracking-wide">Member Since</p>
            </div>
            <p className="text-sm font-semibold text-gray-200">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
            </p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              variant="outline" 
              className="w-full border-yellow-500/50 hover:bg-yellow-500/10 hover:border-yellow-500 text-yellow-400 font-semibold"
            >
              Edit Profile
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
