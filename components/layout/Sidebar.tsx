"use client";

import { motion } from "framer-motion";
import { AppLogo } from "@/components/layout/AppLogo";
import { NavItem } from "@/components/layout/NavItem";
import { UserSection } from "@/components/layout/UserSection";
import {
  LayoutDashboard,
  Users,
  Bell,
  BarChart3,
  MessageCircle,
  Settings,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Contacts", href: "/contacts", icon: Users },
  { name: "Follow-ups", href: "/follow-ups", icon: Bell },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "AI Assistant", href: "/assistant", icon: MessageCircle },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="hidden md:flex md:flex-shrink-0"
    >
      <div className="flex flex-col w-64 bg-gradient-to-b from-gray-950 to-black border-r border-gray-800 relative overflow-hidden">
        {/* Subtle animated background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,179,1,0.1),transparent_50%)]" />
        </div>

        {/* Logo */}
        <AppLogo />

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto relative z-10">
          {navigation.map((item, index) => (
            <NavItem
              key={item.name}
              name={item.name}
              href={item.href}
              icon={item.icon}
              index={index}
            />
          ))}
        </nav>

        {/* User section */}
        <UserSection />

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </div>
    </motion.aside>
  );
}
