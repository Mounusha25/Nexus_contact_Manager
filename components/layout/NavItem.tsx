"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  name: string;
  href: string;
  icon: LucideIcon;
  index: number;
}

export function NavItem({ name, href, icon: Icon, index }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        href={href}
        className={cn(
          "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all group relative overflow-hidden",
          isActive
            ? "text-black"
            : "text-gray-300 hover:text-white"
        )}
      >
        {/* Active background with gradient */}
        {isActive && (
          <motion.div
            layoutId="activeNav"
            className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl"
            initial={false}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}

        {/* Hover background */}
        {!isActive && (
          <motion.div
            className="absolute inset-0 bg-gray-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
            initial={false}
          />
        )}

        {/* Icon with animation */}
        <motion.div
          className="relative z-10 mr-3"
          whileHover={{ scale: 1.1, rotate: isActive ? 0 : 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Icon
            className={cn(
              "h-5 w-5 flex-shrink-0",
              isActive ? "text-black" : "text-gray-400 group-hover:text-yellow-400"
            )}
          />
        </motion.div>

        {/* Label */}
        <span className="relative z-10">{name}</span>

        {/* Active indicator dot */}
        {isActive && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-auto w-2 h-2 rounded-full bg-black relative z-10"
          />
        )}

        {/* Hover glow effect */}
        {!isActive && (
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-yellow-400 rounded-full group-hover:h-8 transition-all duration-300"
          />
        )}
      </Link>
    </motion.div>
  );
}
