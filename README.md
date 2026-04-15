# Industry 5.0 Core Framework

Industry 5.0 Core is a modular, AI-powered business dashboard and logic engine. It provides dynamic interfaces for different industry sectors (SaaS, Manufacturing, Logistics) while integrating a local Large Language Model (Llama 3 via Ollama) to serve as a context-aware business analyst.

## 🌟 Key Features

- **Multi-Industry Support:** Configurable builder flows and tailored dashboards for:
  - SaaS
  - Manufacturing
  - Logistics
- **Context-Aware AI Analyst:** Integrates with local Llama 3 models to perform history-aware KPI analysis and strategic chat.
- **Financial Logic Engine:** Compute complex business metrics (CM1 margin, CM2 margin, revenue) instantly and persist them to a local database.
- **Modern UI Suite:** Premium, responsive user interface built with React 19, Tailwind CSS, Framer Motion, and Recharts.
- **Seamless Database Integration:** Manage saved business configurations and financial simulations via an interactive data portal.

## 🛠 Tech Stack

**Frontend:**
- React 19 & React Router DOM
- Vite
- Tailwind CSS & Framer Motion (Styling & Animations)
- Recharts (Data Visualizations)
- Lucide React (Icons)

**Backend:**
- Node.js & Express
- Sequelize (Database ORM)
- Axios (LLM Communication)
- Ollama (Local AI server running `llama3:8b`)

## 🚀 Getting Started

### Prerequisites

1. **Node.js**: Ensure you have Node v18+ installed on your machine.
2. **Ollama**: Download and install [Ollama](https://ollama.com/), then pull the required Llama 3 model by running:
   ```bash
   ollama run llama3:8b
   ```

### Installation & Execution

Start by cloning the repository and setting up both the server and client components:

#### 1. Start the Intelligent Backend Server
```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Start the Node/Express backend
node server.js
```
The server will start on `http://localhost:5000`.

#### 2. Start the Frontend Client
Open a new terminal window:
```bash
# Navigate to the client directory
cd client

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
The UI component will be accessible via `http://localhost:5173` (or the port defined by Vite).

## 📂 Project Structure

```text
industry5/
│
├── client/                 # Frontend React Application (Vite + Tailwind)
│   ├── src/
│   │   ├── components/     # UI Components (Dashboards, Onboarding, Layout)
│   │   ├── data/           # Mock / Static Data sources
│   │   ├── App.jsx         # Main Application Entry & Routing
│   │   └── api.js          # API Client Handlers
│   └── package.json
│
├── server/                 # Node.js Express Backend
│   ├── config/             # DB & Server Configurations
│   ├── models/             # Sequelize Data Models
│   ├── routes/             # Express API Routes
│   ├── server.js           # Express App Entry & AI Logic 
│   └── package.json
│
├── ai_engine/              # Python AI Scripts (If applicable later)
└── prompts/                # AI Prompt engineering templates
```

## 🤝 Contribution
Feel free to open issues or submit pull requests. Ensure frontend changes are built on accessible, modern UI principles and tested properly. Make sure to lint codebase using `npm run lint` in the `client` directory.
