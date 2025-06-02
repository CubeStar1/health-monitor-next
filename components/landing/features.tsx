"use client";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
const features = [
  {
    title: "RAG Pipeline using Langchain",
    description: "Our health assistant is powered by a RAG pipeline using Langchain to generate responses to your questions",
    image: "/landing/hm-rag-chat-ps.png",
    url: "/rag"
  },
  {
    title: "Real-Time Health Monitoring",
    description: "Monitor Heart Rate, SpO2 and ECG in real-time",
    image: "/landing/hm-monitor-ps.png",
    url: "/monitor"
  },
  {
    title: "Activity Tracking",
    description: "Monitor your daily activities, exercise routines, and fitness progress",
    image: "/landing/hm-activities.png",
    url: "/activities"
  },
  {
    title: "Health Dashboard",
    description: "Comprehensive overview of your health metrics in one place",
    image: "/landing/hm-dashboard-ps.png",
    url: "/dashboard"
  },
  {
    title: "Nutrition Monitoring",
    description: "Track your diet, calories, and nutritional intake with detailed insights",
    image: "/landing/hm-nutrition-ps.png",
    url: "/nutrition"
  },
  {
    title: "Health Records Analysis",
    description: "Advanced analytics and insights from your health data",
    image: "/landing/hm-record-analysis.png",
    url: "/health-records"
  },
  {
    title: "Medical Records",
    description: "Securely store and access your medical history and test results",
    image: "/landing/hm-record-transcript.png",
    url: "/medical-records"
  },
  {
    title: "Health Reports",
    description: "Generate detailed health reports and share them with your healthcare providers",
    image: "/landing/hm-report.png",
    url: "/reports"
  },
  {
    title: "Voice and Video Assistant",
    description: "Interact with our AI assistant via text, voice (Gemini Live), or video (HeyGen AI)",
    image: "/landing/hm-video-landing.png",
    url: "/reports"
  }
];

interface SelectedFeature {
  title: string;
  description: string;
  image: string;
  url: string;
}

export const Features = () => {
  const [selectedFeature, setSelectedFeature] = useState<SelectedFeature | null>(null);

  return (
    <div className="w-full py-20 lg:py-20">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          <div className="flex gap-4 flex-col items-start">
            <div>
              <Badge>Features</Badge>
            </div>
            <div className="flex gap-2 flex-col">
              <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
                Comprehensive Health Monitoring
              </h2>
              <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground text-left">
                Everything you need to track, manage, and improve your health in one integrated platform.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="flex flex-col gap-2 cursor-pointer group hover:scale-105 transition-all duration-300"
                onClick={() => setSelectedFeature(feature)}
              >
                <div className="relative aspect-video rounded-md overflow-hidden mb-2 ring-1 ring-primary/10 group-hover:ring-primary/30 transition-all">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    className="object-cover w-full h-full transition-transform group-hover:scale-115"
                    width={1000}
                    height={1000}
                  />
                </div>
                <h3 className="text-xl tracking-tight font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground text-base">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={!!selectedFeature} onOpenChange={() => setSelectedFeature(null)}>
        <DialogContent className="max-w-4xl p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {selectedFeature?.title}
            </DialogTitle>
            <DialogDescription className="text-base mt-2">
              {selectedFeature?.description}
            </DialogDescription>
          </DialogHeader>

          <div className="relative aspect-video rounded-lg overflow-hidden my-4 border">
            {selectedFeature && (
              <Image
                src={selectedFeature.image}
                alt={selectedFeature.title}
                className="w-full h-full object-cover"
                width={1000}
                height={1000}
              />
            )}
          </div>

          <DialogFooter className="sm:justify-between gap-4">
            <Button
              variant="ghost"
              onClick={() => setSelectedFeature(null)}
            >
              Close Preview
            </Button>
            <Button asChild>
              <Link href={selectedFeature?.url ?? "#"} className="gap-2">
                Explore Feature <MoveRight className="h-4 w-4" />
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};