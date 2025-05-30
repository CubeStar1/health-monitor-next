"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRightIcon, CheckIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { StarIcon } from "lucide-react"

const tiers = [
  {
    name: "Free",
    id: "free",
    href: "#",
    price: { monthly: 0, yearly: 0 },
    description: "No credit card required",
    features: [
      {
        name: "150 messages/month with AI Assistant",
        description: "Basic access to text-based AI assistance",
        included: true,
      },
      {
        name: "30 mins/month of Voice Assistant",
        description: "Talk to your AI Assistant",
        included: true,
      },
      {
        name: "Video Assistant not included",
        description: "Upgrade for video interactions",
        included: false,
      },
      {
        name: "AI long-term memory",
        description: "AI remembers your preferences",
        included: true,
      },
      {
        name: "Conversation Summaries",
        description: "Get summaries of your conversations",
        included: true,
      },
      {
        name: "Chat attachments",
        description: "Share documents and images",
        included: true,
      },
      {
        name: "Chat history",
        description: "Access your past conversations",
        included: true,
      },
      {
        name: "Premium Support",
        description: "Priority customer support",
        included: false,
      },
    ],
    icon: <StarIcon className="w-5 h-5" />,
  },
  {
    name: "Lite",
    id: "lite",
    href: "#",
    price: { monthly: 59, yearly: 599 },
    description: "Cancel anytime",
    features: [
      {
        name: "500 messages/month with AI Assistant",
        description: "Extended access to text-based AI assistance",
        included: true,
      },
      {
        name: "5 hours/month of Voice Assistant",
        description: "Extended voice interactions",
        included: true,
      },
      {
        name: "2 hours/month of Video Assistant",
        description: "Face-to-face AI interactions",
        included: true,
      },
      {
        name: "AI long-term memory",
        description: "AI remembers your preferences",
        included: true,
      },
      {
        name: "Conversation Summaries",
        description: "Get summaries of your conversations",
        included: true,
      },
      {
        name: "Chat attachments",
        description: "Share documents and images",
        included: true,
      },
      {
        name: "Chat history",
        description: "Access your past conversations",
        included: true,
      },
      {
        name: "Premium Support",
        description: "Priority customer support",
        included: true,
      },
    ],
    highlight: true,
    badge: "Most Popular",
    icon: <StarIcon className="w-5 h-5" />,
  },
  {
    name: "Pro",
    id: "pro",
    href: "#",
    price: { monthly: 99, yearly: 999 },
    description: "Cancel anytime",
    features: [
      {
        name: "Unlimited messages with AI Assistant",
        description: "Unlimited text-based AI assistance",
        included: true,
      },
      {
        name: "Unlimited Voice Assistant",
        description: "Unlimited voice interactions",
        included: true,
      },
      {
        name: "Unlimited Video Assistant",
        description: "Unlimited face-to-face AI interactions",
        included: true,
      },
      {
        name: "AI long-term memory",
        description: "AI remembers your preferences",
        included: true,
      },
      {
        name: "Conversation Summaries",
        description: "Get summaries of your conversations",
        included: true,
      },
      {
        name: "Chat attachments",
        description: "Share documents and images",
        included: true,
      },
      {
        name: "Chat history",
        description: "Access your past conversations",
        included: true,
      },
      {
        name: "Premium Support",
        description: "Priority customer support",
        included: true,
      },
    ],
    icon: <StarIcon className="w-5 h-5" />,
  },
]

function PricingSection({ className }: { className?: string }) {
  const [isYearly, setIsYearly] = useState(false)

  const buttonStyles = {
    default: cn(
      "h-12 bg-white dark:bg-zinc-900",
      "hover:bg-zinc-50 dark:hover:bg-zinc-800",
      "text-zinc-900 dark:text-zinc-100",
      "border border-zinc-200 dark:border-zinc-800",
      "hover:border-zinc-300 dark:hover:border-zinc-700",
      "shadow-sm hover:shadow-md",
      "text-sm font-medium",
    ),
    highlight: cn(
      "h-12 bg-zinc-900 dark:bg-zinc-100",
      "hover:bg-zinc-800 dark:hover:bg-zinc-300",
      "text-white dark:text-zinc-900",
      "shadow-[0_1px_15px_rgba(0,0,0,0.1)]",
      "hover:shadow-[0_1px_20px_rgba(0,0,0,0.15)]",
      "font-semibold text-base",
    ),
  }

  const badgeStyles = cn(
    "px-4 py-1.5 text-sm font-medium",
    "bg-zinc-900 dark:bg-zinc-100",
    "text-white dark:text-zinc-900",
    "border-none shadow-lg",
  )

  return (
    <section
      className={cn(
        "relative bg-background text-foreground",
        "py-12 px-4 md:py-12 lg:py-12",
        "overflow-hidden",
        className,
      )}
    >
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-4 mb-12">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Plans & Pricing
          </h2>
          <div className="inline-flex items-center p-1.5 bg-white dark:bg-zinc-800/50 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-sm">
            {["Monthly", "Yearly"].map((period) => (
              <button
                key={period}
                onClick={() => setIsYearly(period === "Yearly")}
                className={cn(
                  "px-8 py-2.5 text-sm font-medium rounded-full transition-all duration-300",
                  (period === "Yearly") === isYearly
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-lg"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100",
                )}
              >
                {period}
              </button>
            ))}
          </div>
          {isYearly && (
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
              Save up to 45% with Yearly!
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "relative group backdrop-blur-sm",
                "rounded-3xl transition-all duration-300",
                "flex flex-col",
                tier.highlight
                  ? "bg-gradient-to-b from-zinc-100/80 to-transparent dark:from-zinc-400/[0.15]"
                  : "bg-white dark:bg-zinc-800/50",
                "border",
                tier.highlight
                  ? "border-zinc-400/50 dark:border-zinc-400/20 shadow-xl"
                  : "border-zinc-200 dark:border-zinc-700 shadow-md",
                "hover:translate-y-0 hover:shadow-lg",
              )}
            >
              {tier.badge && tier.highlight && (
                <div className="absolute -top-4 left-6">
                  <Badge className={badgeStyles}>{tier.badge}</Badge>
                </div>
              )}

              <div className="p-8 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={cn(
                      "p-3 rounded-xl",
                      tier.highlight
                        ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400",
                    )}
                  >
                    {tier.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    {tier.name}
                  </h3>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                      ₹{isYearly ? tier.price.yearly : tier.price.monthly}
                    </span>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                      /{isYearly ? "year" : "month"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {tier.description}
                  </p>
                </div>

                <div className="space-y-4">
                  {tier.features.map((feature) => (
                    <div key={feature.name} className="flex gap-4">
                      <div
                        className={cn(
                          "mt-1 p-0.5 rounded-full transition-colors duration-200",
                          feature.included
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-zinc-400 dark:text-zinc-600",
                        )}
                      >
                        <CheckIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {feature.name}
                        </div>
                        <div className="text-sm text-zinc-500 dark:text-zinc-400">
                          {feature.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 pt-0 mt-auto">
                <Button
                  className={cn(
                    "w-full relative transition-all duration-300",
                    tier.highlight
                      ? buttonStyles.highlight
                      : buttonStyles.default,
                  )}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Get Started
                    <ArrowRightIcon className="w-4 h-4" />
                  </span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { PricingSection }