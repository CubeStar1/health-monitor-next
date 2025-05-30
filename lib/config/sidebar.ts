import { Heart, Home, Send, User, FileText, Activity, Apple, LineChart, ClipboardList, Mic, Shield } from "lucide-react";
import { SidebarConfig } from "@/lib/types/sidebar";

const sidebarConfig: SidebarConfig = {
  brand: {
    title: "Health Monitor",
    icon: Shield,
    href: "/"
  },
  sections: [
    {
      label: "Navigation",
      items: [
        {
          title: "Home",
          href: "/",
          icon: Home
        },
        {
          title: "Chat",
          href: "/chat",
          icon: Send
        },
        {
          title: "Dashboard",
          href: "/dashboard",
          icon: User
        }
      ]
    },
    {
      label: "Health Features",
      items: [
        {
          title: "Health Monitor",
          href: "/health/monitor",
          icon: Heart,
          description: "View your real-time health data"
        },
        {
          title: "Nutrition Log",
          href: "/health/nutrition",
          icon: Apple,
          description: "Log and analyze your daily nutrition"
        },
        {
          title: "Health Records",
          href: "/health/records",
          icon: ClipboardList,
          description: "View your comprehensive health records"
        },
        {
          title: "Activities",
          href: "/health/activities",
          icon: Activity,
          description: "View your Strava activities"
        },
        {
          title: "Voice Assistant",
          href: "/voice-assistant",
          icon: Mic,
          description: "Select your voice assistant"
        }
      ],
      collapsible: true,
      icon: Heart,
      collapsibleTitle: "Health Tools"
    },
    {
      label: "Documents",
      items: [
        {
          title: "Health Reports",
          href: "/health/reports",
          icon: LineChart,
          description: "View your health reports"
        },
        {
          title: "Generate Documents",
          href: "/health/generate-docs",
          icon: FileText,
          description: "Generate documents"
        }
      ],
      collapsible: true,
      icon: FileText,
      collapsibleTitle: "Documents"
    }
  ]
}

export default sidebarConfig