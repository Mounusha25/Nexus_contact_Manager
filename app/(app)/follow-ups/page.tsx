"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { FollowUpsHeader } from "@/components/followups/FollowUpsHeader";
import { FollowUpCard } from "@/components/followups/FollowUpCard";
import { EmptyFollowUpsState } from "@/components/followups/EmptyFollowUpsState";
import { Id } from "@/convex/_generated/dataModel";

export default function FollowUpsPage() {
  const followUps = useQuery(api.followUps.getFollowUpsForToday);
  const markDone = useMutation(api.followUps.markFollowUpDone);
  const skipFollowUp = useMutation(api.followUps.skipFollowUp);

  if (!followUps) {
    return (
      <div className="space-y-6">
        <FollowUpsHeader count={0} />
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse border-2 border-gray-800">
              <div className="h-40 bg-gray-800 rounded"></div>
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
      <FollowUpsHeader count={followUps.length} />

      {followUps.length > 0 ? (
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 gap-4">
            {followUps.map((followUp, index) => (
              <FollowUpCard
                key={followUp._id}
                followUp={followUp}
                index={index}
                onMarkDone={handleMarkDone}
                onSkip={handleSkip}
              />
            ))}
          </div>
        </AnimatePresence>
      ) : (
        <EmptyFollowUpsState />
      )}
    </div>
  );
}
