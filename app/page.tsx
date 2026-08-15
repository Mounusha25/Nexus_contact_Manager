"use client";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Sparkles, Bell, BarChart3, Shield, Brain, Zap, TrendingUp, Network, Target, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Force video to play on mount
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Video autoplay failed:", error);
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-yellow-500/10 via-transparent to-transparent blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-yellow-600/10 via-transparent to-transparent blur-3xl animate-pulse" />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-50 border-b border-yellow-500/20 bg-black/50 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/50">
              <span className="text-black font-bold text-xl">N</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Nexus
            </span>
          </motion.div>
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" className="text-yellow-400 hover:text-yellow-300">Sign In</Button>
              </SignInButton>
              <SignInButton mode="modal">
                <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700">
                  Get Started
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button variant="ghost" className="text-yellow-400">Dashboard</Button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 backdrop-blur-sm"
              >
                <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
                <span className="text-sm text-yellow-300 font-semibold tracking-wide">
                  Intelligent Relationship Management
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-6xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight"
              >
                Turn Your Network Into
                <br />
                <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                  Your Superpower
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light"
              >
                The intelligent CRM built for ambitious professionals. Never lose touch with valuable connections.
                Powered by AI to help you build relationships that matter.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4"
              >
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button
                      size="lg"
                      className="text-lg px-10 py-7 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 shadow-2xl shadow-yellow-500/50 hover:shadow-yellow-500/70 transition-all"
                    >
                      Start Building Your Network
                      <ArrowRight className="ml-2 h-6 w-6" />
                    </Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="text-lg px-10 py-7 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
                    >
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-6 w-6" />
                    </Button>
                  </Link>
                </SignedIn>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link href="#features">
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-lg px-8 py-7 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
                    >
                      See How It Works
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="grid grid-cols-3 gap-8 pt-8"
              >
                {[
                  { label: "Connections Tracked", value: "10K+" },
                  { label: "AI Insights", value: "50K+" },
                  { label: "Success Rate", value: "95%" },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl font-bold text-yellow-400">{stat.value}</div>
                    <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Video */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative lg:scale-110"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative rounded-3xl overflow-hidden shadow-2xl shadow-yellow-500/30 border-4 border-yellow-500/30 bg-black"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent z-10 pointer-events-none" />
                <video
                  ref={videoRef}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="w-full h-auto relative z-0"
                  onError={(e) => {
                    const target = e.target as HTMLVideoElement;
                    console.error("Video error:", {
                      error: target.error,
                      networkState: target.networkState,
                      readyState: target.readyState,
                      src: target.currentSrc
                    });
                  }}
                  onLoadedData={() => console.log("Video loaded successfully")}
                  onCanPlay={() => console.log("Video can play")}
                >
                  <source src="/NexusVideo.mp4" type="video/mp4" />
                  <source src="./NexusVideo.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                {/* Floating Elements */}
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-6 -right-6 bg-gradient-to-br from-yellow-400 to-yellow-600 text-black px-6 py-3 rounded-2xl shadow-xl font-bold z-20"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    <span>Smart Engine</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Decorative Elements */}
              <div className="absolute -z-10 -top-10 -right-10 w-72 h-72 bg-yellow-500/30 rounded-full blur-3xl" />
              <div className="absolute -z-10 -bottom-10 -left-10 w-96 h-96 bg-yellow-600/20 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-block mb-6"
            >
              <div className="px-6 py-3 rounded-full bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30">
                <span className="text-yellow-400 font-semibold">POWERFUL FEATURES</span>
              </div>
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
              Everything You Need to
              <br />
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Master Your Network
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Cutting-edge AI technology meets intuitive design to transform how you manage professional relationships
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Intelligent Relationship Scoring",
                description:
                  "Our AI analyzes interaction frequency, recency, and engagement quality to give each contact a dynamic relationship score. Watch relationships strengthen or identify connections that need attention before they fade.",
                color: "from-yellow-400 to-orange-500",
                gradient: "from-yellow-500/10 to-orange-500/10",
              },
              {
                icon: Bell,
                title: "Never Miss a Follow-Up",
                description:
                  "Smart reminders that learn your patterns. Get notified when key connections go cold, when it's time to check in, or when there's an opportunity to strengthen a valuable relationship.",
                color: "from-yellow-400 to-yellow-600",
                gradient: "from-yellow-500/10 to-yellow-600/10",
              },
              {
                icon: MessageSquare,
                title: "AI Networking Coach",
                description:
                  "Chat with Claude AI to get personalized networking advice, draft perfect follow-up emails, identify hidden opportunities, and receive strategic insights about your professional network.",
                color: "from-purple-400 to-pink-600",
                gradient: "from-purple-500/10 to-pink-500/10",
              },
              {
                icon: Target,
                title: "Auto-Categorization",
                description:
                  "Machine learning automatically tags contacts as recruiters, clients, investors, or mentors based on profile data and communication patterns. No manual sorting required.",
                color: "from-blue-400 to-cyan-600",
                gradient: "from-blue-500/10 to-cyan-500/10",
              },
              {
                icon: TrendingUp,
                title: "Visual Analytics Dashboard",
                description:
                  "Beautiful charts showing network growth, relationship strength distribution, industry breakdown, and engagement trends. Turn data into actionable insights at a glance.",
                color: "from-green-400 to-emerald-600",
                gradient: "from-green-500/10 to-emerald-500/10",
              },
              {
                icon: Shield,
                title: "Privacy-First Architecture",
                description:
                  "Bank-level encryption, zero-knowledge architecture, and complete data ownership. Your relationships are sensitive—we treat them that way. Never used for AI training.",
                color: "from-gray-400 to-slate-600",
                gradient: "from-gray-500/10 to-slate-500/10",
              },
              {
                icon: Network,
                title: "Lifecycle Stage Tracking",
                description:
                  "Automatically tracks contacts through stages: New, Active, Engaged, Dormant. See at a glance who you're connected with and who needs re-engagement before the relationship cools.",
                color: "from-indigo-400 to-purple-600",
                gradient: "from-indigo-500/10 to-purple-500/10",
              },
              {
                icon: Zap,
                title: "Instant Search & Filters",
                description:
                  "Lightning-fast semantic search across all contacts. Filter by industry, relationship strength, last interaction, or custom tags. Find exactly who you need, when you need them.",
                color: "from-yellow-400 to-red-600",
                gradient: "from-yellow-500/10 to-red-500/10",
              },
              {
                icon: BarChart3,
                title: "Interaction Timeline",
                description:
                  "Complete history of every email, call, meeting, and message. AI-powered summaries and sentiment analysis help you understand relationship dynamics over time.",
                color: "from-pink-400 to-rose-600",
                gradient: "from-pink-500/10 to-rose-500/10",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onHoverStart={() => setHoveredFeature(index)}
                onHoverEnd={() => setHoveredFeature(null)}
                className="relative group"
              >
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    rotateX: 5,
                    rotateY: 5,
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative h-full p-8 bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-3xl overflow-hidden"
                  style={{
                    transformStyle: "preserve-3d",
                    perspective: "1000px",
                  }}
                >
                  {/* Animated Background */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                  
                  {/* Border Glow */}
                  <motion.div
                    animate={
                      hoveredFeature === index
                        ? {
                            opacity: [0.5, 1, 0.5],
                            scale: [1, 1.05, 1],
                          }
                        : {}
                    }
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-20 blur-xl`}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                      className={`p-4 bg-gradient-to-br ${feature.color} rounded-2xl w-fit mb-6 shadow-lg`}
                    >
                      <feature.icon className="h-8 w-8 text-black" />
                    </motion.div>

                    <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-yellow-400 transition-colors">
                      {feature.title}
                    </h3>

                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                      {feature.description}
                    </p>
                  </div>

                  {/* Floating Particles */}
                  {hoveredFeature === index && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: [0, 1, 0], y: -100 }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                        className="absolute bottom-0 left-1/4 w-1 h-1 bg-yellow-400 rounded-full"
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: [0, 1, 0], y: -100 }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        className="absolute bottom-0 right-1/4 w-1 h-1 bg-yellow-400 rounded-full"
                      />
                    </>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-black to-yellow-600/10 transition-all duration-1000" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-full blur-3xl opacity-50"
            />
            
            <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tight">
              Ready to Transform
              <br />
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Your Professional Network?
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
              Join ambitious professionals who are building stronger relationships,
              landing better opportunities, and never losing touch with valuable connections.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-block"
            >
              <SignedOut>
                <SignInButton mode="modal">
                  <Button
                    size="lg"
                    className="text-xl px-16 py-8 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 shadow-2xl shadow-yellow-500/50"
                  >
                    Start Building Today - Free
                    <ArrowRight className="ml-3 h-7 w-7" />
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="text-xl px-16 py-8 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-3 h-7 w-7" />
                  </Button>
                </Link>
              </SignedIn>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex items-center justify-center gap-8 text-gray-400"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-yellow-400" />
                <span>Bank-Level Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span>Intelligent</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span>Instant Setup</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-yellow-500/20 py-12 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                <span className="text-black font-bold text-xl">N</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Nexus
              </span>
            </div>
            
            <p className="text-gray-400">
              &copy; 2025 Nexus. Transform your network into your superpower.
            </p>

            <div className="flex items-center gap-6">
              <Link href="#features" className="text-gray-400 hover:text-yellow-400 transition">
                Features
              </Link>
              <Link href="/dashboard" className="text-gray-400 hover:text-yellow-400 transition">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
