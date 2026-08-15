"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavItem } from "@/components/layout/NavItem";
import { UserSection } from "@/components/layout/UserSection";
import { AppLogo } from "@/components/layout/AppLogo";
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

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <motion.div
        className="md:hidden fixed top-4 left-4 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black w-12 h-12 rounded-xl shadow-lg shadow-yellow-500/50"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </motion.div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-gray-950 to-black border-r border-gray-800 z-50 md:hidden flex flex-col"
            >
              <AppLogo />
              
              <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
                {navigation.map((item, index) => (
                  <div key={item.name} onClick={() => setIsOpen(false)}>
                    <NavItem
                      name={item.name}
                      href={item.href}
                      icon={item.icon}
                      index={index}
                    />
                  </div>
                ))}
              </nav>

              <UserSection />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
