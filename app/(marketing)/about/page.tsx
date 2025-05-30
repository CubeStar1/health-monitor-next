'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Database, MessageSquare, Code, ArrowRight, Search, FileText, Zap } from 'lucide-react'

const sections = [
  {
    title: "Natural Language Processing",
    description: "Our system uses advanced LLMs to understand and process user queries in natural language, allowing for intuitive interactions.",
    icon: MessageSquare,
    color: "bg-blue-500"
  },
  {
    title: "Dynamic SQL Generation",
    description: "The LLM generates SQL queries based on the user's question and our database schema, enabling precise data retrieval.",
    icon: Code,
    color: "bg-green-500"
  },
  {
    title: "Efficient Data Retrieval",
    description: "Our SQLite database quickly executes the generated queries, fetching relevant health data for analysis.",
    icon: Database,
    color: "bg-yellow-500"
  },
  {
    title: "Context-Aware Interpretation",
    description: "The retrieved data is processed by the LLM, which interprets the results in the context of the user's query and health profile.",
    icon: Brain,
    color: "bg-purple-500"
  },
  {
    title: "Personalized Response Generation",
    description: "Finally, the system generates a natural language response, providing personalized insights and recommendations based on the analyzed data.",
    icon: FileText,
    color: "bg-red-500"
  }
]

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.h1 
        className="text-4xl font-bold text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Understanding Our RAG Pipeline
      </motion.h1>

      <motion.p
        className="text-xl text-center mb-12 max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Our Retrieval-Augmented Generation (RAG) pipeline combines advanced AI with efficient data processing to provide personalized health insights.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className={`${section.color} text-white rounded-t-lg`}>
                <CardTitle className="flex items-center text-xl">
                  <section.icon className="mr-3" size={24} />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p>{section.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-16"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="shadow-xl">
          <CardHeader className="bg-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold flex items-center">
              <Zap className="mr-3" size={28} />
              Advanced Technologies Powering Our System
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="mb-6 text-lg">Our RAG pipeline leverages cutting-edge technologies to provide accurate and context-aware responses:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 flex items-center">
                  <ArrowRight className="mr-2 text-indigo-600" size={20} />
                  LangChain
                </h3>
                <p>Orchestrates the flow of information between components, enabling seamless integration of various AI and data processing tasks.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 flex items-center">
                  <ArrowRight className="mr-2 text-indigo-600" size={20} />
                  LangGraph
                </h3>
                <p>Manages complex multi-step reasoning processes, allowing for sophisticated analysis and decision-making in health-related queries.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 flex items-center">
                  <ArrowRight className="mr-2 text-indigo-600" size={20} />
                  Vector Databases
                </h3>
                <p>Enable efficient similarity search for relevant information retrieval, enhancing the accuracy and speed of our health recommendations.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 flex items-center">
                  <ArrowRight className="mr-2 text-indigo-600" size={20} />
                  Large Language Models (LLMs)
                </h3>
                <p>Power natural language understanding and generation, allowing for intuitive interactions and personalized health insights.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}