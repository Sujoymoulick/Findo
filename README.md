# 🔍 Findo | AI-Powered Expense Intelligence

Findo is a modern, high-performance financial management platform designed to help students and professionals track spending through automation, voice interaction, and advanced visual analytics.


## 🚀 Key Features

* **🤖 Finly Voice Assistant:** Interactive expense logging powered by ElevenLabs AI agents for a hands-free experience.
* **📸 Smart Receipt Scanner:** High-tech OCR processing using the **Google Gemini 2.0 Flash** engine to extract data from bills instantly.
* **📊 Visual Analytics:** Real-time budget tracking with color-coded alerts and deep-dive financial reports.
* **🔐 Secure Authentication:** Robust user security featuring Twilio-powered SMS OTP verification.
* **📈 Actionable Insights:** AI-driven suggestions to optimize your spending habits and savings.

## 🛠️ Tech Stack

* **Frontend:** React, Vite, Tailwind CSS
* **Backend & Database:** Supabase (PostgreSQL)
* **AI Engines:** Google Gemini 2.0 Flash, ElevenLabs
* **Communication:** Twilio API
* **Deployment:** Vercel

## 📦 Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Sujoymoulick/Findo.git](https://github.com/Sujoymoulick/Findo.git)
    cd Findo
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory and add your credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_key
    VITE_GEMINI_API_KEY=your_gemini_key
    VITE_ELEVENLABS_AGENT_ID=your_agent_id
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

## 🎨 UI Design Philosophy

Findo utilizes a **Glassmorphism** design language with a premium dark theme. The interface focuses on high readability, neon accents for critical data points, and a professional, futuristic aesthetic.

---
*Built with precision for the next generation of financial tracking.*
