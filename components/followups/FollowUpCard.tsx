"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, X, Calendar, AlertCircle, Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";

interface FollowUpCardProps {
  followUp: {
    _id: Id<"followUps">;
    contactId: Id<"contacts">;
    reason: string;
    dueAt: number;
    status: string;
    contact?: {
      name: string;
      relationshipScore: number;
      lifecycleStage: string;
      company?: string;
      title?: string;
    };
  };
  index: number;
  onMarkDone: (id: Id<"followUps">) => Promise<void>;
  onSkip: (id: Id<"followUps">) => Promise<void>;
}

export function FollowUpCard({ followUp, index, onMarkDone, onSkip }: FollowUpCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleAction = async (action: "done" | "skip") => {
    setIsProcessing(true);
    try {
      if (action === "done") {
        await onMarkDone(followUp._id);
      } else {
        await onSkip(followUp._id);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const isOverdue = followUp.dueAt < Date.now();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className={cn(
        "border-2 transition-all group bg-gradient-to-br from-gray-900 to-black overflow-hidden relative",
        isOverdue 
          ? "border-red-500/50 hover:border-red-500" 
          : "border-yellow-500/30 hover:border-yellow-500/50"
      )}>
        {/* Glow effect on hover */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "absolute inset-0 pointer-events-none",
              isOverdue 
                ? "bg-gradient-to-r from-red-500/10 to-transparent" 
                : "bg-gradient-to-r from-yellow-500/10 to-transparent"
            )}
          />
        )}

        <CardContent className="pt-6 relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {/* Contact Info */}
              <Link
                href={`/contacts/${followUp.contactId}`}
                className="group/link inline-block"
              >
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-bold group-hover/link:text-yellow-400 transition-colors">
                    {followUp.contact?.name || "Unknown Contact"}
                  </h3>
                  {followUp.contact && (
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold border",
                          followUp.contact.relationshipScore > 70
                            ? "bg-green-400/20 text-green-400 border-green-500/50"
                            : followUp.contact.relationshipScore > 40
                            ? "bg-yellow-400/20 text-yellow-400 border-yellow-500/50"
                            : "bg-red-400/20 text-red-400 border-red-500/50"
                        )}
                      >
                        Score: {followUp.contact.relationshipScore}
                      </span>
                    </div>
                  )}
                </div>
              </Link>

              {/* Contact Details */}
              {followUp.contact && (
                <div className="flex flex-wrap gap-2 mb-3 text-sm text-gray-400">
                  {followUp.contact.company && (
                    <span className="px-2 py-1 bg-gray-800 rounded">{followUp.contact.company}</span>
                  )}
                  {followUp.contact.title && (
                    <span className="px-2 py-1 bg-gray-800 rounded">{followUp.contact.title}</span>
                  )}
                </div>
              )}

              {/* Reason */}
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg mb-3">
                <p className="text-sm text-gray-300 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span className="font-medium">{followUp.reason}</span>
                </p>
              </div>

              {/* Due Date */}
              <div className="flex items-center gap-2 text-sm">
                <Clock className={cn("w-4 h-4", isOverdue ? "text-red-400" : "text-gray-400")} />
                <span className={cn(isOverdue ? "text-red-400 font-semibold" : "text-gray-400")}>
                  {isOverdue ? "Overdue: " : "Due: "}
                  {formatDate(followUp.dueAt)}
                </span>
                {isOverdue && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="sm"
                  onClick={() => handleAction("done")}
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-green-400 to-green-600 text-white font-bold hover:shadow-lg hover:shadow-green-500/50 transition-all"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Done
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAction("skip")}
                  disabled={isProcessing}
                  className="border-gray-700 hover:border-yellow-500/50 hover:bg-yellow-500/10"
                >
                  <X className="h-4 w-4 mr-1" />
                  Skip
                </Button>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
