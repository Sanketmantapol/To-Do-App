"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ListTodo, Clock, Sparkles } from "lucide-react";

const features = [
  {
    icon: ListTodo,
    title: "Organize Tasks",
    description:
      "Keep everything in one place with a clean, distraction-free interface.",
  },
  {
    icon: Clock,
    title: "Stay on Track",
    description: "Focus on what matters today. No clutter, no overwhelm.",
  },
  {
    icon: Sparkles,
    title: "Feel Accomplished",
    description:
      "Check things off and watch your progress grow throughout the day.",
  },
];

const homepage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <nav className="flex items-center justify-between px-8 py-4 bg-gray-900 shadow-md">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-white hover:text-blue-400 transition"
        >
          Daily<span className="text-blue-500">DO</span>
        </Link>

        <div className="space-x-6">
          <Link
            href="/login"
            className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      <main className="grow flex flex-col items-center justify-center text-center px-4 space-y-16">
        <div>
          <h2 className="text-4xl mt-15 md:text-5xl font-bold mb-4">
            Welcome to DailyDo
          </h2>
          <p className="text-gray-300 max-w-xl mx-auto">
            A simple platform to get you started. A minimal todo list that
            actually helps you focus on what matters - no noise, just progress.
            Sign up or log in to explore more.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5 w-full px-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.12 }}
              className="bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col items-center text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="font-semibold text-lg mb-1.5">{feature.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="bg-gray-900 rounded-2xl px-12 py-20 max-w-2xl w-full text-center shadow-sm flex flex-col items-center gap-6">
          <h1 className="text-4xl font-bold text-white-900">
            Ready to simplify your day?
          </h1>
          <p className="text-white-400 text-base leading-relaxed">
            Join thousands who have ditched the chaos for clarity. It takes 10
            seconds to start.
          </p>
          
          <Link
            href="/login"
            className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500"
          >
            Get started
          </Link>

        </div>
      </main>

      <footer className="py-8">
        <div
          className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm
          text-muted-foreground font-body"
        >
          <span>© 2026 DailyDo. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default homepage;


