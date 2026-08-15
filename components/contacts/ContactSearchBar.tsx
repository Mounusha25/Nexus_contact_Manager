"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ContactSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function ContactSearchBar({ value, onChange }: ContactSearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-yellow-400" />
      <Input
        placeholder="Search contacts..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 bg-gray-900 border-gray-700 focus:border-yellow-500 focus:ring-yellow-500/20 text-white placeholder:text-gray-500"
      />
    </div>
  );
}
