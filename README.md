<div align="center">

# 🌿 EcoPackAI

**AI-powered sustainable packaging recommendations for modern businesses.**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Project Structure](#-project-structure) · [Contributing](#-contributing)

</div>

---

## 📖 Overview

**EcoPackAI** is a sustainability intelligence platform that helps businesses reduce their packaging costs and carbon footprint. It evaluates **26+ eco-friendly packaging materials** across biodegradability, recyclability, cost, and CO₂ metrics — and uses a multi-factor scoring engine to recommend the optimal packaging for any product.

> Built as a global problem-solving initiative to tackle plastic packaging waste and its environmental impact.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Recommendations** | 3-step wizard: input product details & sustainability preferences → get ranked material recommendations |
| 📊 **BI Dashboard** | 6 interactive charts (bar, scatter, pie, line) across the full material dataset |
| 🔬 **Material Explorer** | Filter, sort, and paginate 26+ materials with a detail modal + radar chart per material |
| ⚖️ **Side-by-Side Compare** | Add up to 4 materials for head-to-head comparison with radar and bar charts |
| 📄 **Report Generator** | Generate a branded sustainability impact report with projections, exportable as PDF |
| 🌙 **Dark Mode** | Fully themed light/dark mode via CSS variables |

---

## 🛠 Tech Stack

- **Framework**: React 18 + TypeScript
- **Build**: Vite 5
- **Styling**: TailwindCSS 3, shadcn/ui (Radix UI primitives)
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Routing**: React Router DOM v6
- **Forms**: React Hook Form + Zod
- **State**: React Context API
- **Testing**: Vitest (unit), Playwright (e2e)
- **Fonts**: Space Grotesk, JetBrains Mono (Google Fonts)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** or **bun**

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/Ecopackai-global-problem-solver.git
cd Ecopackai-global-problem-solver

# Install dependencies
npm install
# or
bun install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

Output is written to `dist/`.

### Tests

```bash
# Unit tests
npm run test

# Unit tests (watch mode)
npm run test:watch
```

---

## 📁 Project Structure

```
src/
├── App.tsx                    # Root with router and global providers
├── pages/
│   ├── LandingPage.tsx        # Hero, how-it-works, animated stats, CTA
│   ├── RecommendPage.tsx      # Multi-step AI recommendation wizard
│   ├── DashboardPage.tsx      # BI analytics dashboard (6 charts)
│   ├── MaterialsPage.tsx      # Filterable + sortable material database
│   ├── ComparePage.tsx        # Side-by-side material comparison
│   ├── ReportPage.tsx         # Sustainability report generator
│   └── AboutPage.tsx
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ui/                    # shadcn/ui components
├── data/
│   └── materials.ts           # Dataset of 26 eco-friendly packaging materials
├── lib/
│   ├── recommendation-engine.ts  # Multi-factor scoring & ranking algorithm
│   └── utils.ts
├── contexts/
│   └── CompareContext.tsx     # Global compare list (max 4 materials)
└── hooks/
    └── use-toast.ts
```

---

## 🧮 Recommendation Engine

The scoring algorithm ranks materials using a **composite weighted score**:

```
compositeScore =
  suitabilityScore  × 0.35
  + ecoScore        × 0.35 × ecoWeight
  + costEfficiency  × 0.35 × costWeight
  + biodegradability × 0.15 × ecoWeight
  + recyclability   × 0.15 × ecoWeight
```

Where `ecoWeight` is controlled by the user's **eco vs. cost preference slider** (0–100%).

---

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## 📜 License

[MIT](./LICENSE) © 2026 EcoPackAI
