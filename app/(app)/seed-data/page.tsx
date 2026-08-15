"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SeedDataPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const currentUser = useQuery(api.users.getCurrentUser);
  const seedData = useMutation(api.seed.seedDemoData);
  const clearData = useMutation(api.seed.clearDemoData);

  const handleSeedData = async () => {
    if (!currentUser) return;
    
    try {
      const result = await seedData({ userId: currentUser._id });
      setMessage(JSON.stringify(result, null, 2));
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleClearData = async () => {
    if (!currentUser) return;
    if (!confirm("Are you sure you want to clear all your data?")) return;
    
    try {
      const result = await clearData({ userId: currentUser._id });
      setMessage(JSON.stringify(result, null, 2));
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Demo Data Management</h1>
        <p className="text-muted-foreground">
          Seed your account with demo contacts and interactions to test the dashboard
        </p>
      </div>

      <Card className="p-8 mb-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Seed Demo Data</h2>
            <p className="text-muted-foreground mb-4">
              This will create 10 demo contacts with various relationship scores, interactions, follow-ups, and notes.
            </p>
            <Button onClick={handleSeedData} size="lg" className="w-full sm:w-auto">
              Load Demo Data
            </Button>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-2xl font-semibold mb-2 text-destructive">Clear All Data</h2>
            <p className="text-muted-foreground mb-4">
              This will permanently delete all your contacts, interactions, follow-ups, and notes. This action cannot be undone.
            </p>
            <Button 
              onClick={handleClearData} 
              size="lg" 
              variant="destructive"
              className="w-full sm:w-auto"
            >
              Clear All Data
            </Button>
          </div>

          {message && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-2">Result:</h3>
              <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
                {message}
              </pre>
            </div>
          )}
        </div>
      </Card>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          Go to Dashboard
        </Button>
        <Button variant="outline" onClick={() => router.push("/contacts")}>
          View Contacts
        </Button>
      </div>
    </div>
  );
}
