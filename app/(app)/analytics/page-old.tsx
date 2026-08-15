"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#F5B301", "#FED053", "#3B3F46", "#2A2E34", "#F97316"];

// TEMPORARY: Hardcoded user ID for testing
const HARDCODED_USER_ID = "js741ht0frav0t82dveqk94cv17ybpe1" as any;

export default function AnalyticsPage() {
  const analytics = useQuery(api.analytics.getDashboardAnalyticsByUserId, { userId: HARDCODED_USER_ID });
  const relationshipDist = useQuery(api.analytics.getRelationshipDistribution);

  if (!analytics || !relationshipDist) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-80 bg-surface-light rounded"></div>
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-gray-400 mt-1">Deep insights into your professional network</p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Network Growth */}
        <Card>
          <CardHeader>
            <CardTitle>Network Growth</CardTitle>
            <CardDescription>Total contacts over last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={networkGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3B3F46" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#2A2E34",
                    border: "1px solid #3B3F46",
                    borderRadius: "8px",
                  }}
                />
                <Line type="monotone" dataKey="count" stroke="#F5B301" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Relationship Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Relationship Strength</CardTitle>
            <CardDescription>Distribution by relationship score</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={relationshipDist}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {relationshipDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#2A2E34",
                    border: "1px solid #3B3F46",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Industry Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Top Industries</CardTitle>
            <CardDescription>Where your contacts work</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.industryDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3B3F46" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#2A2E34",
                    border: "1px solid #3B3F46",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="value" fill="#F5B301" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Lifecycle Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Lifecycle Stages</CardTitle>
            <CardDescription>Contact engagement levels</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: "New", value: analytics.newContacts },
                    { name: "Active", value: analytics.activeContacts },
                    { name: "Dormant", value: analytics.dormantContacts },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[0, 1, 2].map((index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index + 2]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#2A2E34",
                    border: "1px solid #3B3F46",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Contact Type Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Type Breakdown</CardTitle>
          <CardDescription>How your network is categorized</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-surface-light rounded-xl">
              <p className="text-3xl font-bold text-accent">{analytics.recruiters}</p>
              <p className="text-sm text-gray-400 mt-2">Recruiters</p>
            </div>
            <div className="text-center p-6 bg-surface-light rounded-xl">
              <p className="text-3xl font-bold text-blue-400">{analytics.clients}</p>
              <p className="text-sm text-gray-400 mt-2">Clients</p>
            </div>
            <div className="text-center p-6 bg-surface-light rounded-xl">
              <p className="text-3xl font-bold text-purple-400">{analytics.investors}</p>
              <p className="text-sm text-gray-400 mt-2">Investors</p>
            </div>
            <div className="text-center p-6 bg-surface-light rounded-xl">
              <p className="text-3xl font-bold text-green-400">{analytics.strongRelationships}</p>
              <p className="text-sm text-gray-400 mt-2">Strong Bonds</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
