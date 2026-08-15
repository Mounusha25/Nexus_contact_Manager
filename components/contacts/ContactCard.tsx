"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Building, Tag, Mail, MapPin, TrendingUp, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ContactCardProps {
  contact: {
    _id: string;
    name: string;
    relationshipScore: number;
    lifecycleStage: string;
    company?: string;
    title?: string;
    emails: string[];
    location?: string;
    autoType?: string;
    tags: string[];
    lastInteractionAt?: number;
    aiNotesSummary?: string;
  };
  index: number;
}

export function ContactCard({ contact, index }: ContactCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link href={`/contacts/${contact._id}`}>
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="relative"
        >
          <Card className="border-2 border-gray-800 hover:border-yellow-500/50 transition-all group bg-gradient-to-br from-gray-900 to-black overflow-hidden">
            {/* Glow effect on hover */}
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent pointer-events-none"
              />
            )}
            
            <CardContent className="pt-6 relative z-10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Name and Score */}
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-xl font-bold group-hover:text-yellow-400 transition-colors">
                      {contact.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="relative group/score"
                      >
                        <span
                          className={cn(
                            "px-4 py-1.5 rounded-full text-sm font-bold border-2 shadow-lg cursor-help",
                            contact.relationshipScore > 70
                              ? "bg-gradient-to-r from-green-400 to-emerald-600 text-white border-green-400"
                              : contact.relationshipScore > 40
                              ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black border-yellow-400"
                              : "bg-gradient-to-r from-red-400 to-red-600 text-white border-red-400"
                          )}
                        >
                          {contact.relationshipScore}
                        </span>
                        {/* Score Tooltip */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover/score:opacity-100 transition-opacity pointer-events-none z-50">
                          <div className="bg-gray-900 border-2 border-yellow-500 rounded-lg p-3 shadow-xl shadow-yellow-500/20 whitespace-nowrap">
                            <p className="text-xs font-bold text-yellow-400 mb-1">Relationship Strength</p>
                            <p className="text-xs text-gray-300">
                              {contact.relationshipScore > 70 
                                ? "🔥 Strong Connection" 
                                : contact.relationshipScore > 40 
                                ? "👍 Growing Bond" 
                                : "💡 Needs Attention"}
                            </p>
                            <div className="text-xs text-gray-400 mt-1">
                              Based on interaction frequency & quality
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                    <span
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide border",
                        contact.lifecycleStage === "active"
                          ? "bg-green-500/20 text-green-400 border-green-500/50"
                          : contact.lifecycleStage === "new"
                          ? "bg-blue-500/20 text-blue-400 border-blue-500/50"
                          : "bg-gray-500/20 text-gray-400 border-gray-500/50"
                      )}
                    >
                      {contact.lifecycleStage}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-300 mb-4">
                    {contact.company && (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/50">
                        <Building className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                        <span className="truncate font-medium">{contact.company}</span>
                      </div>
                    )}
                    {contact.title && (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/50">
                        <Tag className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                        <span className="truncate">{contact.title}</span>
                      </div>
                    )}
                    {contact.emails[0] && (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/50">
                        <Mail className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                        <span className="truncate text-xs">{contact.emails[0]}</span>
                      </div>
                    )}
                    {contact.location && (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/50">
                        <MapPin className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                        <span className="truncate">{contact.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags and Last Interaction */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {contact.autoType && (
                        <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 text-yellow-400 border border-yellow-500/30">
                          {contact.autoType}
                        </span>
                      )}
                      {contact.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-lg text-xs bg-gray-800 text-gray-300 border border-gray-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {contact.lastInteractionAt && (
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {formatDate(contact.lastInteractionAt)}
                      </p>
                    )}
                  </div>

                  {/* AI Summary */}
                  {contact.aiNotesSummary && (
                    <div className="mt-4 p-3 bg-gradient-to-r from-yellow-500/10 to-transparent rounded-lg border border-yellow-500/30">
                      <p className="text-sm text-gray-300 line-clamp-2">
                        <Sparkles className="w-4 h-4 inline mr-2 text-yellow-400" />
                        {contact.aiNotesSummary}
                      </p>
                    </div>
                  )}
                </div>

                {/* Hover indicator */}
                <motion.div
                  className="absolute right-6 top-1/2 -translate-y-1/2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Link>
    </motion.div>
  );
}
