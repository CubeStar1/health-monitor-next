'use client'

import { motion } from 'framer-motion'
import { cn } from "@/lib/utils"; // Import cn utility

import Image from 'next/image';
import { Activity, BarChart, Bot, Brain, Cpu, Database, FileText, Mic, ShieldCheck, Video, Wind, Zap, ArrowRight, MessageSquare, Code, Search } from 'lucide-react';

const featureColors = [
  "bg-gradient-to-br from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700", // Real-time Data
  "bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700", // AI Assistant
  "bg-gradient-to-br from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700", // Health Records
  "bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700", // Nutrition
  "bg-gradient-to-br from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700", // SQL Agent
  "bg-gradient-to-br from-fuchsia-500 to-fuchsia-600 hover:from-fuchsia-600 hover:to-fuchsia-700", // RAG Pipeline
];

const technologyColors = [
  "bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700", // Langchain
  "bg-gradient-to-br from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700", // Cohere
  "bg-gradient-to-br from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700", // Supabase (pgvector)
  "bg-gradient-to-br from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700", // Gemini
  "bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700", // HeyGen
  "bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700", // Tavily
];

const coreFeatures = [
  {
    title: "Real-time Health Data & Monitoring",
    description: "Integrates with Arduino sensors (via ESP8266) for live vital signs monitoring, displayed on your dashboard and analyzed for health trends using Supabase.",
    icon: Activity,
    gradientClassName: featureColors[0],
    imageSrc: "/landing/hm-monitor.png",
    imageAlt: "Real-time health graphs and monitoring dashboard"
  },
  {
    title: "AI-Powered Multi-Modal Assistant",
    description: "Interact via text, voice (Gemini Live), or video (HeyGen AI). Our assistant understands your queries and provides personalized health insights.",
    icon: Bot,
    gradientClassName: featureColors[1],
    imageSrc: "/landing/hm-video-landing.png",
    imageAlt: "AI Health Assistant interface"
  },
  {
    title: "Intelligent Health Records Management",
    description: "Securely store medical records. PDFs (PyPDF2) and images (Tesseract OCR) are automatically transcribed and vectorized using Cohere embeddings for semantic search and analysis.",
    icon: ShieldCheck,
    gradientClassName: featureColors[2],
    imageSrc: "/landing/hm-record-analysis.png",
    imageAlt: "Medical record analysis and transcription display"
  },
  {
    title: "Advanced RAG & SQL Agent Capabilities",
    description: "Our Retrieval-Augmented Generation (RAG) pipeline, built with Langchain, processes sensor data, medical documents, and chat context. A specialized SQL agent enables complex data queries.",
    icon: Cpu,
    gradientClassName: featureColors[3],
    imageSrc: "/landing/hm-rag-chat.png", // Placeholder, consider a more conceptual image if available
    imageAlt: "RAG pipeline and SQL agent conceptual representation"
  },
  {
    title: "Comprehensive Nutrition Tracking",
    description: "Log your meals and track nutritional intake with ease, powered by the Nutritionix API for an extensive food database.",
    icon: BarChart, // Using BarChart as a proxy for nutrition/food logging
    gradientClassName: featureColors[4],
    imageSrc: "/landing/hm-nutrition-2.png",
    imageAlt: "Nutrition tracking interface"
  },
  {
    title: "Personalized Health Reports",
    description: "Generate detailed health reports combining structured sensor data and unstructured medical records, ready for sharing with healthcare providers.",
    icon: FileText,
    gradientClassName: featureColors[5],
    imageSrc: "/landing/hm-report.png",
    imageAlt: "Generated health report example"
  },
];

const technologiesUsed = [
  {
    name: "Langchain & LangGraph",
    description: "Orchestrates our RAG pipeline and complex agentic workflows, including the SQL agent, for intelligent data processing and response generation.",
    icon: Wind, // Using Wind as a proxy for Langchain's flow orchestration
    gradientClassName: technologyColors[0],
  },
  {
    name: "Cohere Embeddings",
    description: "Powers our semantic search capabilities by converting medical documents and other text data into meaningful vector representations.",
    icon: Brain, // Brain for embeddings/understanding
    gradientClassName: technologyColors[1],
  },
  {
    name: "Supabase with pgvector",
    description: "Provides a robust and scalable backend for storing structured health data, sensor readings, and vectorized medical records for efficient retrieval.",
    icon: Database,
    gradientClassName: technologyColors[2],
  },
  {
    name: "Google Gemini Live",
    description: "Enables real-time, natural voice interactions with our AI health assistant, making it easier to get information hands-free.",
    icon: Mic,
    gradientClassName: technologyColors[3],
  },
  {
    name: "HeyGen AI Video Platform",
    description: "Delivers an engaging video-based assistant experience, offering a novel way to receive health information and guidance.",
    icon: Video,
    gradientClassName: technologyColors[4],
  },
  {
    name: "Tavily Search API",
    description: "Enhances our RAG pipeline by providing access to up-to-date medical knowledge from the web for verified and comprehensive answers.",
    icon: Search,
    gradientClassName: technologyColors[5],
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-primary">
            Welcome to HealthHub
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Your intelligent partner for managing health data and gaining AI-assisted insights. Discover how HealthHub empowers you to take control of your well-being.
          </p>
        </motion.div>

        <div className="mb-16 sm:mb-20">
          <h2 className="text-3xl font-semibold tracking-tight mb-10 text-center sm:text-left">Core Platform Features</h2>
          <div className="space-y-10">
            {coreFeatures.map((feature, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className={cn("p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out hover:scale-[1.02] border-0", feature.gradientClassName)}
                >
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center`}>
                    {/* Text Content Column */}
                    <div className={cn("md:col-span-1", isEven ? "md:order-1" : "md:order-2")}>
                      <div className="flex items-center mb-4">
                        <div className="flex-shrink-0 p-3 bg-white/20 rounded-lg mr-4">
                          <feature.icon className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-semibold text-white">{feature.title}</h3>
                      </div>
                      <p className="text-white/80 text-base leading-relaxed">{feature.description}</p>
                    </div>
                    {/* Image Column */}
                    <motion.div 
                      className={cn("md:col-span-1 relative h-64 md:h-80 w-full", isEven ? "md:order-2" : "md:order-1")}
                      initial={{ opacity:0, scale: 0.8}}
                      animate={{ opacity:1, scale: 1}}
                      transition={{ duration: 0.5, delay: index * 0.15 + 0.2}}
                    >
                      <Image
                        src={feature.imageSrc}
                        alt={feature.imageAlt}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg border-2 border-white/30 shadow-md"
                      />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 + coreFeatures.length * 0.1 }}
        >
          <div className="text-center mb-10 sm:mb-12">
            <Zap className="mx-auto h-12 w-12 text-primary mb-4" />
            <h2 className="text-3xl font-semibold tracking-tight">Powered by Advanced Technologies</h2>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              HealthHub leverages a cutting-edge stack to deliver a seamless and intelligent experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {technologiesUsed.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 + (0.4 + coreFeatures.length * 0.1) }}
                className={cn("p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out hover:scale-[1.02] border-0", tech.gradientClassName)}
              >
                <div className="flex items-center mb-3">
                  <div className="flex-shrink-0 p-2.5 bg-white/20 rounded-lg mr-4">
                    <tech.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{tech.name}</h3>
                </div>
                <p className="text-white/80 text-sm">{tech.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  )
}