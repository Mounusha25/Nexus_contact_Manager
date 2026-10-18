"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AnalyticsHeader } from "@/components/analytics/AnalyticsHeader";
import { NetworkGrowthChart } from "@/components/analytics/NetworkGrowthChart";
import { RelationshipDistributionChart } from "@/components/analytics/RelationshipDistributionChart";
import { IndustryDistributionChart } from "@/components/analytics/IndustryDistributionChart";
import { LifecycleDistributionChart } from "@/components/analytics/LifecycleDistributionChart";
import { ContactTypeStats } from "@/components/analytics/ContactTypeStats";
import { Card } from "@/components/ui/card";

export default function AnalyticsPage() {
  const analytics = useQuery(api.analytics.getDashboardAnalytics);
  const relationshipDist = useQuery(api.analytics.getRelationshipDistribution);

  if (!analytics || !relationshipDist) {
    return (
      <div className="space-y-6">
        <AnalyticsHeader />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse border-2 border-gray-800">
              <div className="h-80 bg-gray-800 rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const networkGrowthData = analytics.networkGrowth;

  // Transform industry distribution data
  const industryData = analytics.industryDistribution.map(item => ({
    industry: item.name,
    count: item.value
  }));

  return (
    <div className="space-y-8">
      <AnalyticsHeader />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NetworkGrowthChart data={networkGrowthData} />
        <RelationshipDistributionChart data={relationshipDist} />
        <IndustryDistributionChart data={industryData} />
        <LifecycleDistributionChart 
          newContacts={analytics.newContacts}
          activeContacts={analytics.activeContacts}
          dormantContacts={analytics.dormantContacts}
        />
      </div>

      {/* Contact Type Stats */}
      <ContactTypeStats 
        recruiters={analytics.recruiters}
        clients={analytics.clients}
        investors={analytics.investors}
        strongRelationships={analytics.strongRelationships}
      />
    </div>
  );
}
