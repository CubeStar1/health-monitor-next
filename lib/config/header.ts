import { HeaderConfig } from "@/lib/types/header"

export const headerConfig: HeaderConfig = {
  brand: {
    title: "HealthHub",
    icon: "/idea-lab-round.png"
  },
  navigationLinks: [
    { 
      href: "/", 
      label: "Home" 
    },
    { 
      href: "/chat-v3", 
      label: "Chat" 
    },
    { 
      href: "/dashboard", 
      label: "Dashboard" 
    },
    { 
      href: "/about", 
      label: "About" 
    }
  ],
  sections: [
    {
      title: "Health",
      isDropdown: true,
      items: [
        {
          href: "/health/monitor",
          label: "Health Monitor",
          description: "View your real-time health data"
        },
        {
          href: "/health/nutrition",
          label: "Nutrition Log",
          description: "Log and analyze your daily nutrition"
        },
        {
          href: "/health/records",
          label: "Health Records",
          description: "View your comprehensive health records"
        },
        {
          href: "/health/activities",
          label: "Activities",
          description: "View your Strava activities"
        },
        {
          href: "/health/reports",
          label: "Health Reports",
          description: "View your health reports"
        },
        {
          href: "/health/documents",
          label: "Generate Prescription",
          description: "Generate prescriptions"
        }
      ]
    }
  ]
}