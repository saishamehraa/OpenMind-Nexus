# 🚀 Quick Start Guide

Get OpenMind Nexus running on your local machine in under 2 minutes.

## Prerequisites
- Node.js (v18 or higher)
- pnpm (recommended) or npm

## 3 Simple Steps

### 1. Install Dependencies
```bash
pnpm install
# or npm install
```

### 2. Start the Development Server
```bash
pnpm dev
# or npm run dev
```

### 3. Open the App & Run the Demo
1. Open your browser to `http://localhost:5173`
2. Click on **"Orchestration"** in the top navigation bar.
3. Paste any text (like a suspicious tweet or news snippet) into the input box.
4. Click **"Start Multi-Agent Analysis"** and watch the Band Room simulate live agent collaboration!

---

## 🧭 Navigation Guide

- `/orchestration` - **The Main Event.** The multi-agent collaboration dashboard.
- `/feed` - The legacy user-controlled content feed with sliders.
- `/bias-check` - The standalone cognitive bias detector tool.
- `/insights` - Analytics on content consumption patterns.

## 🛠️ Troubleshooting

- **Port 5173 is in use?** Vite will automatically try the next available port. Check your terminal output.
- **Agents not responding?** Check the terminal for any console errors; ensure your Node version is 18+.

Enjoy exploring OpenMind Nexus!
