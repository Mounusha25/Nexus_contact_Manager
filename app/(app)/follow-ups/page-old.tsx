"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, X, Calendar, TrendingDown, AlertCircle } from "lucide-react";
import { getScoreColor, getScoreBgColor, formatDate, cn } from "@/lib/utils";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";

// TEMPORARY: Hardcoded user ID for testing
const HARDCODED_USER_ID = "js741ht0frav0t82dveqk94cv17ybpe1" as any;

export default function FollowUpsPage() {
  const followUps = useQuery(api.followUps.getFollowUpsForToday);
  const markDone = useMutation(api.followUps.markFollowUpDone);
  const skipFollowUp = useMutation(api.followUps.skipFollowUp);

  if (!followUps) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Follow-ups</h1>
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-32 bg-surface-light rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const handleMarkDone = async (id: Id<"followUps">) => {
    await markDone({ id });
  };

  const handleSkip = async (id: Id<"followUps">) => {
    await skipFollowUp({ id });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Follow-ups</h1>
        <p className="text-gray-400 mt-1">
          {followUps.length} {followUps.length === 1 ? "contact needs" : "contacts need"} your attention
        </p>
      </div>

      {/* Today's Follow-ups */}
      {followUps.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <AlertCircle className="h-6 w-6 text-accent mr-2" />
            Due Today
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {followUps.map((followUp) => (
              <Card key={followUp._id} className="border-l-4 border-l-accent">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Contact Info */}
                      <Link
                        href={`/contacts/${followUp.contactId}`}
                        className="group inline-block"
                      >
                        <h3 className="text-xl font-semibold group-hover:text-accent transition-colors">
                          {followUp.contact?.name || "Unknown Contact"}
                        </h3>
                      </Link>

                      <div className="flex items-center space-x-3 mt-2 mb-3">
                        {followUp.contact && (
                          <>
                            <span
                              className={cn(
                                "px-3 py-1 rounded-full text-xs font-medium border",
                                getScoreBgColor(followUp.contact.relationshipScore)
                              )}
                            >
                              Score: {followUp.contact.relationshipScore}
                            </span>
                            {followUp.contact.company && (
                              <span className="text-sm text-gray-400">
                                {followUp.contact.company}
                              </span>
                            )}
                            {followUp.contact.autoType && (
                              <span className="px-2 py-1 rounded-md text-xs bg-accent/20 text-accent border border-accent/30">
                                {followUp.contact.autoType}
                              </span>
                            )}
                          </>
                        )}
                      </div>

                      {/* Reason */}
                      <div className="flex items-start space-x-2 p-4 bg-surface-light rounded-lg mb-4">
                        <TrendingDown className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-white mb-1">Why follow up?</p>
                          <p className="text-sm text-gray-300">{followUp.reason}</p>
                        </div>
                      </div>

                      {/* Last Interaction */}
                      {followUp.contact?.lastInteractionAt && (
                        <p className="text-sm text-gray-400">
                          <Calendar className="inline h-4 w-4 mr-1" />
                          Last contact: {formatDate(followUp.contact.lastInteractionAt)}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => handleMarkDone(followUp._id)}
                        className="whitespace-nowrap"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Done
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleSkip(followUp._id)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Skip
                      </Button>
                      <Link href={`/contacts/${followUp.contactId}`}>
                        <Button size="sm" variant="ghost" className="w-full">
                          View Contact
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {followUps.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">All caught up!</h3>
              <p className="text-gray-400 mb-4">
                You don't have any follow-ups due today. Great work maintaining your relationships!
              </p>
              <Link href="/contacts">
                <Button variant="secondary">
                  View All Contacts
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
