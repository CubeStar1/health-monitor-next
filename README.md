# HealthHub: Health Data Management and AI-Assisted Analysis Platform

This project is a health data management and AI-assisted analysis platform. It combines personal health record management with advanced AI capabilities for data analysis and medical information retrieval using RAG.

## Platform Overview

![HealthHub Landing Page](./public/landing/hm-landing-new.png)
![HealthHub Assistant](./public/landing/hm-landing-health-assistant-3.png)

### AI-Powered Health Assistant

![Health Assistant Interface](./public/hm-chat-landing.png)
Health assistant powered by a RAG pipeline using Langchain.

![Video Assistant](./public/hm-video-landing.png)
Video assistant powered by HeyGen.

### Real-Time Health Dashboard

![Health Dashboard](./public/landing/hm-dashboard.png)
Overview of your health metrics, vitals, and analytics in one unified interface.

### Medical Records & Analysis

![Medical Records](./public/landing/hm-record-analysis.png)
![Records Transcription](./public/landing/hm-record-transcript.png)
Secure storage and vectorization of your medical records with automatic transcription.

### Health Monitoring & Activities

![Real-time Monitoring](./public/landing/hm-graphs.png)
![Activity Tracking](./public/landing/hm-activities.png)
Track vital signs in real-time and monitor your daily activities and fitness progress.

### Nutrition & Health Reports

![Nutrition Tracking](./public/landing/hm-nutrition.png)
![Health Reports](./public/landing/hm-report.png)
Monitor your nutrition and generate comprehensive health reports for healthcare providers.

## Features

### Real-time Health Data Integration & Monitoring

- Integration with Arduino sensors for vital signs monitoring and live dashboard updates
- Structured data collection and analysis for health trends via ESP8266 and Supabase

### AI-Powered Health Assistant

- Multi-modal interaction with voice, text, and video interfaces using Gemini 2.0 and HeyGen AI
- RAG pipeline powered by Langchain for personalized health insights
- Medical knowledge search and verification using Tavily API

### Health Records Management

- Secure storage and automatic transcription of medical records
- Document vectorization with Cohere embeddings for semantic search
- Health reports generation combining structured sensor data and unstructured medical records

## Tech Stack

- Frontend: Next.js with TypeScript
- Backend: FastAPI (Python)
- Database: Supabase (PostgreSQL with pgvector extension)
- AI/ML: Langchain, OpenAI API, Cohere embeddings
- External APIs: Tavily for medical web search

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Python (v3.8 or later)
- Supabase account
- OpenAI API key
- Gemini API key
- Tavily API key
- Cohere API key
- Resend API key
- Nutritionix API key

### Installation

1. Clone the frontend repository:

   ```bash
   git clone https://github.com/CubeStar1/health-monitor-next.git
   cd health-monitor-next
   ```

2. Install frontend dependencies:

   ```bash
   npm install
   ```

3. Clone the Python backend repository:

   ```bash
   git clone https://github.com/CubeStar1/health-monitor-api.git
   cd healthhub-backend
   ```

4. Set up the Python backend:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   pip install -r requirements.txt
   ```

5. Set up environment variables:
   Create a `.env` file in the frontend root directory and a `.env` file in the backend directory with the following contents:

   ```bash
   # Frontend .env (in health-monitor-next directory)

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABAE_ADMIN=your_supabase_service_role_key

   # FastAPI
   NEXT_PUBLIC_API_URL=http://localhost:8000
   API_URL=http://localhost:8000

   # Resend
   RESEND_API_KEY=your_resend_api_key
   RESEND_DOMAIN=your_resend_domain

   # Nutritionix API
   NUTRITIONIX_API_URL=https://trackapi.nutritionix.com/v2
   NUTRITIONIX_APP_ID=your_nutritionix_app_id
   NUTRITIONIX_API_KEY=your_nutritionix_api_key

   # DB Credentials
   NEXT_PUBLIC_DB_USER=<your_db_user>
   NEXT_PUBLIC_DB_PASSWORD=<your_db_password>
   NEXT_PUBLIC_DB_HOST=<your_db_host>
   NEXT_PUBLIC_DB_PORT=<your_db_port>
   NEXT_PUBLIC_DB_NAME=<your_db_name>
   ```

   ```bash
   # Backend .env (in health-monitor-api directory)
   OPENAI_API_KEY=<your_openai_api_key>
   LOCAL_LLM_URL=<your_local_llm_url>
   GOOGLE_API_KEY=<your_google_api_key>
   COHERE_API_KEY=<your_cohere_api_key>
   TAVILY_API_KEY=<your_tavily_api_key>

   SUPABASE_URL=<your_supabase_project_url>
   SUPABASE_KEY=<your_supabase_service_role_key>

   ```

6. Start the development servers:

   ```bash
   # In the frontend directory
   cd health-monitor-next
   npm run dev

   # In a new terminal, navigate to the backend directory
   cd path/to/health-monitor-api
   uvicorn main:app --reload
   ```

## Medical Records Processing

When a medical record is uploaded:

1. The file is sent to the backend for processing.
2. If it's a PDF, it's converted to text using PyPDF2. If it's an image, OCR is performed using Tesseract.
3. The extracted text is then sent to Cohere to generate embeddings.
4. The embeddings, along with the original text and metadata, are stored in the Supabase vector database.

This process allows for efficient semantic search and retrieval of relevant information during chat interactions

> [!IMPORTANT]
> Certain components of this project are not publicly included in this repository to protect proprietary software architecture. These include:
>
> - **Supabase Database Migrations & Schema** (the `lib/supabase/migrations`)
> - **Proprietary AI Prompt Engineering & Reasoning** (the `lib/ai/prompts` and `lib/ai/tools` directories)
> - **Real-time Search Integration Logic** (the `lib/tavily` and `lib/tools` directories)
>
> If you’re interested in accessing these for academic, research, or collaboration purposes, please feel free to contact me at **avinash.anish05@gmail.com**.
