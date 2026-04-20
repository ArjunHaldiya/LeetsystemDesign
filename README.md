# DesignDojo

LeetCode for system design. Drag architecture components onto a canvas, connect them, and get AI-powered feedback on your design.

## What it does

- Pick a system design question (URL Shortener, Rate Limiter, News Feed)
- Drag components (Load Balancer, Redis, SQL DB, etc.) onto a canvas
- Connect them with edges to show data flow
- Hit **Run Tests** — Groq grades your design and returns a score, strengths, and gaps
- Hit **Hint** for a nudge without giving away the answer
- **Share** serializes your design into a URL you can send to anyone

## Stack

- Next.js 16 (App Router)
- React Flow — canvas
- Groq (llama-3.3-70b) — AI grading and hints
- Tailwind CSS v4

## Running locally

```bash
npm install
```

Create `.env.local`:
```
GROQ_API_KEY=your_key_here
```

Get a free key at [console.groq.com](https://console.groq.com).

```bash
node node_modules/next/dist/bin/next dev
```

Open [http://localhost:3000](http://localhost:3000).
