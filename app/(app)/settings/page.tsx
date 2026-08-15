"use client";

import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { AccountSection } from "@/components/settings/AccountSection";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <SettingsHeader />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <AccountSection />
          <SecuritySettings />
        </div>
        <div>
          <NotificationSettings />
        </div>
      </div>
    </div>
  );
}
