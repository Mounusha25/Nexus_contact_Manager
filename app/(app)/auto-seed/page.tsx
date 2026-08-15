"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AutoSeedPage() {
  const [status, setStatus] = useState("Loading...");
  const [result, setResult] = useState<any>(null);
  
  const currentUser = useQuery(api.users.getCurrentUser);
  const seedData = useMutation(api.seed.seedDemoData);

  useEffect(() => {
    if (currentUser) {
      setStatus(`Found user: ${currentUser.email}`);
    }
  }, [currentUser]);

  const handleAutoSeed = async () => {
    if (!currentUser) {
      setStatus("Error: No user found. Please sign in first.");
      return;
    }

    setStatus("Creating demo data...");
    try {
      const res = await seedData({ userId: currentUser._id });
      setResult(res);
      setStatus("✅ Success! Demo data created.");
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
      setResult(error);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-8 max-w-md">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p>Please wait while we load your user data.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-4">🚀 Auto-Seed Demo Data</h1>
          
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <p className="font-mono text-sm">
              <strong>Your User ID:</strong> {currentUser._id}
            </p>
            <p className="font-mono text-sm mt-2">
              <strong>Email:</strong> {currentUser.email}
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Status:</h2>
            <p className="text-lg">{status}</p>
          </div>

          <Button 
            onClick={handleAutoSeed} 
            size="lg"
            className="w-full mb-4"
          >
            Click Here to Load Demo Data
          </Button>

          {result && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Result:</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          <div className="mt-8 pt-6 border-t">
            <h3 className="font-semibold mb-3">What will be created:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✅ 10 diverse professional contacts</li>
              <li>✅ 7 interaction records (meetings, calls, emails)</li>
              <li>✅ 3 pending follow-up tasks</li>
              <li>✅ 2 notes with AI summaries</li>
              <li>✅ Relationship scores from 42-95</li>
              <li>✅ Mix of lifecycle stages (new, active, dormant)</li>
            </ul>
          </div>

          <div className="mt-6 flex gap-3">
            <Button variant="outline" onClick={() => window.location.href = "/dashboard"}>
              Go to Dashboard
            </Button>
            <Button variant="outline" onClick={() => window.location.href = "/contacts"}>
              View Contacts
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
