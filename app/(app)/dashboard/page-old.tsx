"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, TrendingUp, Bell, Mail } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { getScoreColor, getScoreBgColor, formatDate, cn } from "@/lib/utils";
import Link from "next/link";

const COLORS = ["#F5B301", "#FED053", "#3B3F46", "#2A2E34"];

// TEMPORARY: Hardcoded user ID for testing
const HARDCODED_USER_ID = "js741ht0frav0t82dveqk94cv17ybpe1" as any;

export default function DashboardPage() {
  // Use hardcoded userId version for testing
  const analytics = useQuery(api.analytics.getDashboardAnalyticsByUserId, { userId: HARDCODED_USER_ID });
  const relationshipDist = useQuery(api.analytics.getRelationshipDistribution);

  if (!analytics) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-24 bg-surface-light rounded"></div>
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
      change: `${analytics.newContacts} new`,
      color: "text-blue-400",
    },
    {
      title: "Strong Relationships",
      value: analytics.strongRelationships,
      icon: UserCheck,
      change: `${Math.round((analytics.strongRelationships / (analytics.totalContacts || 1)) * 100)}%`,
      color: "text-accent",
    },
    {
      title: "Follow-ups Pending",
      value: analytics.pendingFollowUps,
      icon: Bell,
      change: "Due today",
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back! Here's your network overview.</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">{metric.title}</p>
                    <p className="text-3xl font-bold mt-2">{metric.value}</p>
                    <p className={cn("text-sm mt-2", metric.color)}>{metric.change}</p>
                  </div>
                  <div className={cn("p-3 rounded-xl bg-surface-light", metric.color)}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Network Growth */}
        <Card>
          <CardHeader>
            <CardTitle>Network Growth</CardTitle>
            <CardDescription>Total contacts over last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
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
                <Line type="monotone" dataKey="count" stroke="#F5B301" strokeWidth={2} />
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
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={relationshipDist || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(relationshipDist || []).map((entry, index) => (
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
            <CardDescription>Distribution of contacts by industry</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
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

        {/* At-Risk Relationships */}
        <Card>
          <CardHeader>
            <CardTitle>At-Risk Relationships</CardTitle>
            <CardDescription>Valuable contacts needing attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.atRiskContacts.slice(0, 5).map((contact) => (
                <Link
                  key={contact._id}
                  href={`/contacts/${contact._id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-light transition-all group"
                >
                  <div className="flex-1">
                    <p className="font-medium group-hover:text-accent transition-colors">
                      {contact.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {contact.company || "No company"} • {contact.lifecycleStage}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium border",
                        getScoreBgColor(contact.relationshipScore)
                      )}
                    >
                      {contact.relationshipScore}
                    </span>
                  </div>
                </Link>
              ))}
              {analytics.atRiskContacts.length === 0 && (
                <p className="text-center text-gray-400 py-8">
                  No at-risk relationships! Keep up the great work.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recruiter Stats */}
      {analytics.recruiters > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recruiter Network</CardTitle>
            <CardDescription>Your recruiter connections and engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-400">Total Recruiters</p>
                <p className="text-3xl font-bold mt-1">{analytics.recruiters}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Average Relationship Score</p>
                <p className="text-3xl font-bold mt-1 text-accent">{analytics.avgRecruiterScore}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Also Tracking</p>
                <p className="text-3xl font-bold mt-1">
                  {analytics.clients} <span className="text-lg text-gray-400">clients</span>{" "}
                  {analytics.investors} <span className="text-lg text-gray-400">investors</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
