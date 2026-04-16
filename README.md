# 🌍 AfriFlow AI — Africa's #1 AI Automation Platform

> Learn AI. Automate Work. Build Income.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Edit `.env.local`:
```env
# MongoDB — use your Atlas URI or local MongoDB
MONGODB_URI=mongodb://localhost:27017/afriflow-ai

# Auth — change these in production!
NEXTAUTH_SECRET=afriflow-ai-secret-key-change-in-production
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=afriflow-jwt-secret-2024

# Anthropic API — get your key at console.anthropic.com
ANTHROPIC_API_KEY=your-anthropic-api-key-here
```

### 3. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🔑 Optional: Seed demo data

Visit `http://localhost:3000/api/seed` (POST request) or run:
```bash
curl -X POST http://localhost:3000/api/seed
```

Demo login:
- **Email:** demo@afriflowai.com
- **Password:** demo1234

---

## 🤖 Enable AfriAI Coach

1. Get your API key from [console.anthropic.com](https://console.anthropic.com)
2. Add it to `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```
3. Restart the dev server

Without the key, the coach still works with a helpful fallback message.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   ├── auth/
│   │   ├── login/            # Login page
│   │   └── register/         # Register page
│   ├── courses/
│   │   ├── page.tsx          # Course listing
│   │   └── [slug]/           # Course detail
│   ├── dashboard/            # User dashboard
│   ├── lab/                  # Automation Lab
│   ├── paths/                # Career paths
│   ├── templates/            # Templates
│   ├── community/            # Community hub
│   ├── pricing/              # Pricing page
│   ├── business/             # Enterprise page
│   └── api/
│       ├── auth/             # Login & register
│       ├── courses/          # Course API
│       ├── coach/            # AfriAI Coach (Claude)
│       ├── user/             # User profile
│       └── seed/             # Demo data
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── CourseCard.tsx
│   └── AfriAICoach.tsx       # AI chat widget
├── lib/
│   ├── mongodb.ts            # DB connection
│   ├── auth.ts               # JWT utilities
│   └── data.ts               # Seed/sample data
└── models/
    ├── User.ts               # User schema
    └── Course.ts             # Course schema
```

---

## 🌍 Key Features

- **7 Schools** — AI Foundations, Automation, Business, Creator, Builder, Career, Community
- **AfriAI Coach** — Claude-powered 24/7 AI learning assistant
- **Transformation Paths** — Outcome-based learning journeys
- **Automation Lab** — Browser-based practice projects
- **Templates** — 25+ downloadable blueprints
- **Community** — Country chapters, forums, events
- **Mobile-first** — Optimized for African mobile users
- **MongoDB** — Full user auth, profiles, enrollment

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | Next.js API Routes |
| Database | MongoDB + Mongoose |
| Auth | JWT (bcryptjs) |
| AI | Anthropic Claude API |
| Fonts | Playfair Display + DM Sans |
| Payments | Ready for Paystack/Flutterwave (to integrate) |

---

## 🔧 Next Steps to Complete

1. **Add Paystack/Flutterwave** for payment processing
2. **Upload real course videos** via Mux or Vimeo
3. **Add email service** (Resend or SendGrid) for welcome emails
4. **Deploy to Vercel** + MongoDB Atlas
5. **Add more courses** via the Course model
6. **Build instructor dashboard** for content creators
7. **Add mobile app** (React Native or PWA)

---

## 🚀 Deploy to Production

```bash
# Build
npm run build

# Deploy to Vercel
npx vercel --prod
```

Set all environment variables in your Vercel dashboard.

---

Built with ❤️ for Africa 🌍
