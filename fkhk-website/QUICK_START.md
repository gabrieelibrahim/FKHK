# Developer Quick Start Guide
# FKHK Website — Getting Started

**Last Updated:** July 17, 2026

---

## 📋 Pre-Requisites

Before starting, ensure you have:

- [ ] Node.js 20 LTS installed (`node --version`)
- [ ] PostgreSQL 15+ installed and running locally
- [ ] Git installed and configured
- [ ] GitHub account with access to FKHK repos
- [ ] Code editor (VS Code recommended)
- [ ] Postman or similar for API testing
- [ ] npm or yarn package manager

### Recommended VS Code Extensions
```
- ESLint (Dirk Bäumer)
- Prettier - Code Formatter
- Thunder Client or REST Client (for API testing)
- PostgreSQL (ckolkman)
- Prisma (Prisma)
```

---

## 🚀 Day 1: Setup

### 1.1 Clone Repositories

```bash
# Create a workspace directory
mkdir ~/fkhk-workspace && cd ~/fkhk-workspace

# Clone frontend repo
git clone https://github.com/fkhk/fkhk-frontend.git
cd fkhk-frontend
npm install

# Clone backend repo (in another terminal)
cd ~/fkhk-workspace
git clone https://github.com/fkhk/fkhk-backend.git
cd fkhk-backend
npm install
```

### 1.2 Configure Environment Variables

**Frontend** (`fkhk-frontend/.env.local`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=<ask team>
```

**Backend** (`fkhk-backend/.env`):
```bash
# Copy from .env.example
cp .env.example .env

# Edit .env with local values:
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fkhk_dev
JWT_SECRET=your-super-secret-jwt-key-change-in-prod
SENDGRID_API_KEY=<ask team>
```

### 1.3 Set Up Local Database

```bash
# Start PostgreSQL (macOS with Homebrew)
brew services start postgresql

# Or Windows (assuming postgres is installed):
# From PowerShell: pg_ctl -D "C:\Program Files\PostgreSQL\15\data" start

# Create database
createdb fkhk_dev

# Run migrations
cd fkhk-backend
npm run migrate:dev

# Seed with sample data (optional)
npm run seed
```

Verify connection:
```bash
psql fkhk_dev
# If you see "fkhk_dev=#" prompt, success!
\q
```

### 1.4 Start Development Servers

**Terminal 1 — Backend:**
```bash
cd ~/fkhk-workspace/fkhk-backend
npm run dev
# Should see: "Server running on http://localhost:3001"
```

**Terminal 2 — Frontend:**
```bash
cd ~/fkhk-workspace/fkhk-frontend
npm run dev
# Should see: "Local: http://localhost:3000"
```

**Terminal 3 — Database Monitor (optional):**
```bash
# Use pgAdmin or similar to inspect database
# Or use CLI: psql fkhk_dev
```

### 1.5 Verify Everything Works

1. Open browser: **http://localhost:3000**
2. Click "Register" → Fill form → Submit
3. Check backend logs for successful registration
4. Check database: `SELECT * FROM members;` in psql
5. Try logging in with your new account

✅ If you see the homepage with your logged-in state → You're ready!

---

## 📁 Project Structure

### Frontend (Next.js)
```
fkhk-frontend/
├── public/                    # Static files
│   ├── logo.png
│   ├── sitemap.xml
│   └── robots.txt
├── src/
│   ├── pages/                 # Next.js pages (route = filename)
│   │   ├── index.js           # / (homepage)
│   │   ├── auth/
│   │   │   ├── login.js       # /auth/login
│   │   │   └── register.js    # /auth/register
│   │   ├── articles/
│   │   │   ├── index.js       # /articles
│   │   │   └── [slug].js      # /articles/:slug
│   │   ├── events/
│   │   ├── admin/
│   │   └── 404.js
│   ├── components/            # Reusable React components
│   │   ├── Navbar.js
│   │   ├── ArticleForm.js
│   │   ├── ArticleCard.js
│   │   ├── EventCalendar.js
│   │   └── ...
│   ├── api/                   # API client
│   │   ├── client.js          # Axios instance with token interceptor
│   │   ├── articles.js        # Article API calls
│   │   ├── events.js          # Event API calls
│   │   └── auth.js            # Auth API calls
│   ├── context/               # React Context (state management)
│   │   ├── AuthContext.js     # Global auth state
│   │   └── AppContext.js      # App-wide state
│   ├── utils/                 # Helper functions
│   │   ├── validation.js
│   │   └── formatting.js
│   ├── styles/                # Tailwind CSS & globals
│   │   └── globals.css
│   └── app.js                 # Root layout
├── .env.local                 # Environment variables (git-ignored)
├── package.json
├── tsconfig.json
└── next.config.js
```

### Backend (Express + Prisma)
```
fkhk-backend/
├── prisma/
│   ├── schema.prisma          # Database schema (ORM definition)
│   └── migrations/            # Auto-generated migrations
├── src/
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   ├── rbac.js            # Role-based access control
│   │   └── error.js           # Error handling
│   ├── routes/
│   │   ├── auth.js            # POST /api/auth/*
│   │   ├── articles.js        # GET /api/articles/*
│   │   ├── events.js          # GET /api/events/*
│   │   ├── members.js         # GET /api/members/*
│   │   ├── admin.js           # GET /api/admin/*
│   │   └── newsletter.js      # POST /api/newsletter/*
│   ├── models/                # Prisma models (alternative queries)
│   │   ├── User.js
│   │   ├── Article.js
│   │   └── Event.js
│   ├── services/              # Business logic
│   │   ├── email.js           # SendGrid integration
│   │   ├── auth.js            # JWT, password hashing
│   │   └── upload.js          # File upload to S3
│   ├── validators/            # Input validation (Zod)
│   │   └── schemas.js
│   ├── utils/
│   │   ├── logger.js          # Winston logging
│   │   └── errors.js          # Custom error classes
│   ├── seeds/
│   │   └── seed.js            # Sample data for development
│   └── index.js               # Server entry point
├── tests/
│   ├── auth.test.js
│   ├── articles.test.js
│   └── events.test.js
├── .env                       # Environment variables (git-ignored)
├── package.json
└── README.md
```

---

## 🔨 Common Development Tasks

### Adding a New API Endpoint

**1. Define in Prisma schema** (if new data model)
```prisma
// prisma/schema.prisma
model Achievement {
  id    Int     @id @default(autoincrement())
  title String
  member Members @relation(fields: [memberId], references: [id])
  memberId Int
}
```

**2. Run migration**
```bash
npx prisma migrate dev --name add_achievements
```

**3. Create route handler**
```javascript
// src/routes/achievements.js
router.get('/api/achievements', async (req, res) => {
  const achievements = await prisma.achievement.findMany();
  res.json(achievements);
});
```

**4. Create validation schema**
```javascript
// src/validators/schemas.js
const createAchievementSchema = z.object({
  title: z.string().min(5),
  memberId: z.number().positive(),
});
```

**5. Wire up in main server**
```javascript
// src/index.js
app.use(achievementsRouter);
```

**6. Write tests**
```javascript
// tests/achievements.test.js
describe('Achievements API', () => {
  it('should fetch all achievements', async () => {
    const res = await request(app).get('/api/achievements');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});
```

### Adding a New Frontend Page

**1. Create page component**
```javascript
// src/pages/achievements/index.js
import { useEffect, useState } from 'react';
import { getAchievements } from '@/api/achievements';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    getAchievements().then(setAchievements);
  }, []);

  return (
    <div>
      <h1>Achievements</h1>
      {achievements.map(a => <div key={a.id}>{a.title}</div>)}
    </div>
  );
}
```

**2. Create API client**
```javascript
// src/api/achievements.js
import client from './client';

export const getAchievements = async () => {
  const { data } = await client.get('/achievements');
  return data;
};
```

**3. Link from navigation**
```javascript
// src/components/Navbar.js
<Link href="/achievements">Achievements</Link>
```

### Running Tests

```bash
# Backend
cd fkhk-backend
npm run test              # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report

# Frontend
cd fkhk-frontend
npm run test             # Jest
npm run test:watch
```

### Checking Code Quality

```bash
# Lint
npm run lint

# Format
npm run format            # Auto-fix with Prettier

# Type checking (if using TypeScript)
npm run type-check
```

### Database Operations

```bash
# Access database CLI
psql fkhk_dev

# Common queries
SELECT * FROM members;                    # List all members
SELECT * FROM articles WHERE status = 'published'; # Published articles
DELETE FROM members WHERE id = 5;         # Delete a member
UPDATE articles SET view_count = 0;       # Reset views

# Exit
\q
```

### Viewing Database with GUI

```bash
# pgAdmin (web interface)
pgAdmin available at http://localhost:5050

# Or use VS Code PostgreSQL extension
# Right-click server → Create Connection
```

---

## 🐛 Debugging Tips

### Backend Debugging

**In VS Code:**
1. Set breakpoint in code
2. Run: `npm run dev:debug`
3. Open `chrome://inspect` in browser
4. Click "inspect" on the process

**Or use console logs:**
```javascript
console.log('Debug:', { userId, articleId });  // Will appear in terminal
```

**Check server logs:**
```bash
# Tail logs in real-time
tail -f logs/app.log

# Or check error tracking: Sentry dashboard
```

### Frontend Debugging

**Use React DevTools:**
1. Install React DevTools browser extension
2. Inspect component tree
3. Check props and state

**Network requests:**
1. Open DevTools → Network tab
2. Watch API calls to backend
3. Check response status and body

**Local storage:**
```javascript
// In browser console
localStorage.getItem('token')  // View JWT token
localStorage.clear()          // Clear all storage
```

### Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| **"Cannot connect to DB"** | PostgreSQL not running | `brew services start postgresql` |
| **"Port 3001 already in use"** | Another process using port | `lsof -i :3001` then kill PID |
| **JWT token invalid** | Token expired or key mismatch | Clear localStorage, re-login |
| **CORS error** | Backend CORS not configured | Check `.env` ALLOWED_ORIGINS |
| **Prisma migration fails** | Schema conflict | `npx prisma migrate resolve --rolled-back` |

---

## 📚 Useful Commands (Cheatsheet)

```bash
# Frontend Development
npm run dev              # Start dev server (localhost:3000)
npm run build            # Build for production
npm run lint             # Check code quality
npm run test             # Run tests
npm run test:watch       # Watch mode for tests

# Backend Development
npm run dev              # Start with nodemon (auto-reload)
npm run dev:debug        # Start with debugger
npm run seed             # Populate sample data
npm run migrate:dev      # Create/run migrations
npm run test             # Run tests
npm run lint             # Check code quality

# Database
psql fkhk_dev            # Connect to local database
createdb fkhk_test       # Create test database
dropdb fkhk_dev          # Delete database

# Deployment (see DEPLOYMENT.md)
npm run build            # Build production bundle
npm run deploy           # Deploy to staging/production
npm run migrate:prod     # Run migrations in production
```

---

## 🔐 Sensitive Data Handling

**Never commit these files:**
- `.env` (local secrets)
- `.env.local` (frontend secrets)
- Private keys or API keys
- Database dumps with real data

**If you accidentally commit secrets:**
```bash
# Remove from git history
git rm --cached .env
git commit -m "Remove .env file"
git push

# Rotate the compromised API keys immediately!
```

**Safe practices:**
```bash
# Store secrets in .env (git-ignored)
# Reference via process.env.VARIABLE_NAME

# Never log secrets
console.log(process.env.JWT_SECRET);  ❌ DON'T DO THIS
console.log('JWT configured');         ✅ Do this instead

# Use environment variables for config
// Good:
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Bad:
const apiUrl = 'http://localhost:3001';  // Hardcoded
```

---

## 📞 Getting Help

### Documentation
- **Backend API:** See `fkhk-backend/API.md`
- **Frontend Components:** See `fkhk-frontend/COMPONENTS.md`
- **Database Schema:** See `fkhk-backend/prisma/schema.prisma`
- **Environment Setup:** See `.env.example`

### Communication
- **Slack Channel:** #fkhk-dev
- **GitHub Issues:** Report bugs with reproduction steps
- **Weekly Standup:** Tuesday 2 PM (Zoom link in Slack)

### Code Review
1. Create a feature branch: `git checkout -b feature/article-search`
2. Make changes and commit: `git commit -m "Add article search"`
3. Push: `git push origin feature/article-search`
4. Open Pull Request on GitHub
5. Request review from 2 team members
6. Address feedback and re-request
7. Merge when approved

---

## 🎯 Next Steps

**After setup is complete:**

1. ✅ Read the [Implementation Plan](IMPLEMENTATION_PLAN.md) to understand scope
2. ✅ Review the [Tech Stack](TECH_STACK.md) for architecture details
3. ✅ Check [PRD.md](PRD.md) for business requirements
4. ✅ Claim a task from the task board (Week 1 tasks)
5. ✅ Create a feature branch and start coding
6. ✅ Submit PR for code review by end of sprint

---

## 📝 Session Template (Each Day)

```markdown
# Development Session — [Date]

## What I did today
- [ ] Task 1: [description]
- [ ] Task 2: [description]

## What I'm working on next
- [ ] Task 3: [description]

## Blockers
- None / [describe blocker]

## Code pushed
- Branch: `feature/xyz`
- Commits: 3
- PR: [link]
```

---

## ✨ Success Criteria (First Week)

- [ ] Local development environment fully set up
- [ ] Can start both frontend and backend
- [ ] Can create a test user and log in
- [ ] Can run tests successfully
- [ ] Familiar with project structure
- [ ] First code change committed and reviewed

---

**Questions?** Reach out in #fkhk-dev or ask during standup!

Happy coding! 🚀

---

**Document Version History**

| Version | Date | Author | Notes |
|---------|------|--------|-------|
| 1.0 | 2026-07-17 | Claude Code | Initial quick start guide |
