# 🚀 OpenMind Nexus - Deployment Guide

This guide outlines how to deploy the OpenMind Nexus platform for production.

## 1. Frontend Deployment (Vercel)

The React frontend (including the Orchestration Dashboard) is optimized for Vercel.

1. Push your repository to GitHub.
2. Log into Vercel and import the project.
3. Configure the Build Command: `npm run build`
4. Output Directory: `dist`
5. Deploy.

## 2. Band Integration (Production)

Currently, the `src/services/bandOrchestrator.ts` uses a local simulated Band room. To move to production:

1. Install the official Band SDK.
2. Initialize the Band client with your API keys in the `.env` file.
3. Update the `postMessage` and `subscribe` methods in the Orchestrator to route through the actual Band network.

## 3. Backend Deployment (Railway/Render) - Optional for core demo

If you are using the legacy features (saving preferences to MongoDB) or shifting the Agent logic to a dedicated Node server:

1. Provision a MongoDB Atlas cluster.
2. Deploy the Express server (`backend-example.js`) to Railway or Render.
3. Add your environment variables:
   - `MONGODB_URI`
   - `OPENAI_API_KEY` (for production Bias/Explainability agents)
   - `BAND_API_KEY`

## 4. Environment Variables

Create a `.env` in the root of the frontend for deployment:
```env
VITE_API_URL=https://your-backend-url.com/api
VITE_BAND_API_KEY=your_production_key
```
