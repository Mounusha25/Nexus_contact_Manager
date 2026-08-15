"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Users, UserCheck, Bell, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { NetworkGrowthCard } from "@/components/dashboard/NetworkGrowthCard";
import { RelationshipChartCard } from "@/components/dashboard/RelationshipChartCard";

// TEMPORARY: Hardcoded user ID for testing
const HARDCODED_USER_ID = "js741ht0frav0t82dveqk94cv17ybpe1" as any;

export default function DashboardPage() {
  const analytics = useQuery(api.analytics.getDashboardAnalyticsByUserId, { userId: HARDCODED_USER_ID });
  const relationshipDist = useQuery(api.analytics.getRelationshipDistribution);

  if (!analytics || !relationshipDist) {
    return (
      <div className="space-y-6">
        <DashboardHeader />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse border-2 border-gray-800">
              <div className="h-32 bg-gray-800 rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Create chart data for network growth (mock data based on total contacts)
  const networkGrowthData = [
    { month: "Jul", count: Math.max(0, analytics.totalContacts - 8) },
    { month: "Aug", count: Math.max(0, analytics.totalContacts - 6) },
    { month: "Sep", count: Math.max(0, analytics.totalContacts - 4) },
    { month: "Oct", count: Math.max(0, analytics.totalContacts - 3) },
    { month: "Nov", count: Math.max(0, analytics.totalContacts - 1) },
    { month: "Dec", count: analytics.totalContacts },
  ];

  const metrics = [
    {
      title: "Total Contacts",
      value: analytics.totalContacts,
      icon: Users,
      change: `${analytics.newContacts} new this month`,
      color: "text-blue-400",
    },
    {
      title: "Strong Relationships",
      value: analytics.strongRelationships,
      icon: UserCheck,
      change: `${Math.round((analytics.strongRelationships / (analytics.totalContacts || 1)) * 100)}% of network`,
      color: "text-yellow-400",
    },
    {
      title: "Follow-ups Pending",
      value: analytics.pendingFollowUps,
      icon: Bell,
      change: "Require attention",
      color: "text-orange-400",
    },
    {
      title: "Recent Activity",
      value: analytics.recentInteractions,
      icon: Mail,
      change: "Last 30 days",
      color: "text-green-400",
    },
  ];

  return (
    <div className="space-y-8">
      <DashboardHeader />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={metric.title} {...metric} index={index} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NetworkGrowthCard data={networkGrowthData} />
        <RelationshipChartCard data={relationshipDist} />
      </div>
    </div>
  );
}
