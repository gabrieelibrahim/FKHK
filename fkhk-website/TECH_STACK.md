# Tech Stack & Architecture Specification
# FKHK Website MVP

**Document Status:** Version 1.0  
**Last Updated:** July 17, 2026

---

## 1. Recommended Tech Stack

### Frontend

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | React 18 + Next.js 14 | SSR for SEO, built-in routing, API routes, great performance |
| **Styling** | Tailwind CSS | Utility-first, matches existing design system tokens, fast iteration |
| **State Management** | React Context + useReducer | Lightweight, sufficient for MVP, no heavy dependencies |
| **Forms** | React Hook Form + Zod | Minimal bundle size, type-safe validation |
| **HTTP Client** | Axios | Promise-based, interceptors for auth tokens, good DX |
| **Rich Text Editor** | React Quill | Lightweight, features-rich, easy to integrate |
| **Calendar** | React Big Calendar | Flexible, good mobile support, customizable |
| **Testing** | Vitest + React Testing Library | Fast, jest-compatible, React-focused |
| **Build Tool** | Vite / Next.js | Fast HMR, production-optimized builds |
| **Linting** | ESLint + Prettier | Code quality and formatting standards |
| **Hosting** | Vercel | Next.js optimized, serverless, automatic deployments |

### Backend

| Layer | Technology | Why |
|-------|-----------|-----|
| **Runtime** | Node.js 20 LTS | Mature, widely used, good ecosystem |
| **Framework** | Express.js | Minimal, flexible, excellent middleware ecosystem |
| **Database** | PostgreSQL 15 | Relational, powerful querying, JSONB support, free |
| **ORM** | Prisma | Type-safe, auto-migrations, great DX, excellent docs |
| **Authentication** | JWT + bcrypt | Stateless, secure, standard approach |
| **Email Service** | SendGrid | Reliable, affordable, good API |
| **File Storage** | AWS S3 or Cloudinary | Scalable, CDN included, affordable |
| **Validation** | Zod | Type-safe, shared schema with frontend |
| **Testing** | Jest + Supertest | Industry standard, comprehensive |
| **Logging** | Winston | Structured logging, multiple transports |
| **Error Tracking** | Sentry | Real-time errors, session replay optional |
| **Hosting** | Railway / DigitalOcean / AWS EC2 | Flexible, affordable, good support |

### Infrastructure

| Component | Technology | Why |
|-----------|-----------|-----|
| **Database Hosting** | AWS RDS or DigitalOcean Managed | Automatic backups, high availability, patching |
| **CI/CD** | GitHub Actions | Native to GitHub, free for public repos, powerful |
| **Monitoring** | Datadog or New Relic (lite) | Dashboards, alerts, APM |
| **Uptime Monitoring** | UptimeRobot | Simple, free, good for MVP |
| **Domain & DNS** | Cloudflare | Fast DNS, DDoS protection, free SSL |
| **Secrets Management** | Environment variables (secure storage) | Simple for MVP, upgrade to Vault later |

---

## 2. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                         │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
        ┌────────────────┴────────────────┐
        │                                 │
        ▼                                 ▼
┌───────────────────┐         ┌───────────────────┐
│  Vercel/Netlify   │         │   Cloudflare      │
│  (Frontend)       │         │   (DNS + CDN)     │
│                   │         │                   │
│ - Next.js App    │         │ - Static assets   │
│ - React Pages    │         │ - SSL cert        │
│ - Tailwind CSS   │         │ - DDoS protection │
│ - API calls      │         │                   │
└────────┬──────────┘         └───────────────────┘
         │
         │ REST API calls (JSON)
         │
         ▼
┌─────────────────────────────────────────┐
│   Railway / DigitalOcean / AWS EC2      │
│   (Backend Server)                      │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Node.js + Express Server       │   │
│  │  - /api/articles/*              │   │
│  │  - /api/events/*                │   │
│  │  - /api/members/*               │   │
│  │  - /api/auth/*                  │   │
│  │  - /api/newsletter/*            │   │
│  │  - /api/admin/*                 │   │
│  └────────┬──────────────────────┬─┘   │
│           │                      │     │
│           ▼                      ▼     │
│  ┌──────────────────┐  ┌─────────────────────┐
│  │  PostgreSQL DB   │  │  File Storage       │
│  │  (AWS RDS or DO) │  │  (S3/Cloudinary)    │
│  │                  │  │                     │
│  │ - articles       │  │ - Article images    │
│  │ - events         │  │ - Member avatars    │
│  │ - members        │  │ - Event photos      │
│  │ - registrations  │  │ - PDFs              │
│  │ - newsletters    │  │                     │
│  └──────────────────┘  └─────────────────────┘
└─────────────────────────────────────────┘
         │              │
         ▼              ▼
┌──────────────┐  ┌─────────────────┐
│  SendGrid    │  │  Sentry         │
│  (Email)     │  │  (Error Track)  │
│              │  │                 │
│ - Welcome    │  │ - Exception logs│
│ - Newsletter │  │ - Performance   │
│ - Alerts     │  │                 │
└──────────────┘  └─────────────────┘
```

---

## 3. Data Flow Examples

### Article Submission Flow
```
User fills form
  ↓
Frontend: POST /api/articles (with token)
  ↓
Backend: Validate (Zod), save to DB (Prisma)
  ↓
Backend: Return article ID + status
  ↓
Frontend: Show success, redirect to dashboard
  ↓
Admin: GET /api/admin/articles/pending
  ↓
Admin: Review, then PUT /api/admin/articles/:id/approve
  ↓
Backend: Update status to published
  ↓
Frontend: Article appears on public list
```

### Event Registration Flow
```
User views event detail
  ↓
Frontend: GET /api/events/:id (fetch details, spots available)
  ↓
User clicks Register, fills form
  ↓
Frontend: POST /api/events/:id/register (with token)
  ↓
Backend: Check capacity, create registration record
  ↓
Backend: Queue email (SendGrid)
  ↓
Backend: Return confirmation
  ↓
Frontend: Show "Registered" state
  ↓
User receives confirmation email with event details
```

---

## 4. Security Architecture

### Authentication & Authorization

```
┌─────────────────────────────────────────┐
│  Frontend                               │
│  - User enters email + password         │
│  - POST /api/auth/login                 │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  Backend (Express)                      │
│  - Verify email exists                  │
│  - Compare password (bcrypt)            │
│  - Sign JWT token {id, email, role}     │
│  - Return token to frontend             │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  Frontend (localStorage or secure HTTP) │
│  - Store JWT token                      │
│  - Include in Authorization header      │
│    for all subsequent requests          │
└────────────────┬────────────────────────┘
                 │
                 ▼ Authorization: Bearer <JWT>
┌─────────────────────────────────────────┐
│  Backend (Express Middleware)           │
│  - Extract token from header            │
│  - Verify signature (JWT)               │
│  - Decode payload → {id, email, role}  │
│  - Check if token expired               │
│  - Attach user to request object        │
│  - Pass to route handler                │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  Route Handler                          │
│  - Check user role (RBAC)               │
│  - Execute authorized action            │
│  - Return protected resource            │
└─────────────────────────────────────────┘
```

### Input Validation & Sanitization

```
Frontend (Client-side)
  ↓ Zod validation
  ↓ Prevent obvious errors before submit
  ↓
Backend (Server-side) ← Always validate here
  ↓ Zod validation (independent of frontend)
  ↓ Check constraints (unique email, valid date range)
  ↓
Database (Parameterized queries)
  ↓ Prevent SQL injection
  ↓
Output sanitization (DOMPurify on frontend)
  ↓ Prevent XSS when displaying user content
```

---

## 5. Database Schema (SQL)

```sql
-- Members Table
CREATE TABLE members (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  affiliation VARCHAR(255),
  bio TEXT,
  avatar_url VARCHAR(512),
  interests TEXT[],
  role VARCHAR(20) DEFAULT 'member', -- 'member', 'moderator', 'admin'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- Articles Table
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt VARCHAR(1000),
  author_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  topic VARCHAR(100), -- 'Pernikahan', 'Hukum Waris', etc.
  tags TEXT[],
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'submitted', 'published', 'archived'
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_topic (topic),
  INDEX idx_author (author_id),
  INDEX idx_published (published_at)
);

-- Events Table
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  date_time TIMESTAMP NOT NULL,
  location VARCHAR(500),
  online_url VARCHAR(512),
  capacity INTEGER,
  created_by INTEGER NOT NULL REFERENCES members(id),
  status VARCHAR(50) DEFAULT 'upcoming', -- 'upcoming', 'completed', 'cancelled'
  image_url VARCHAR(512),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_datetime (date_time),
  INDEX idx_creator (created_by)
);

-- Registrations Table
CREATE TABLE registrations (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  attended BOOLEAN DEFAULT false,
  UNIQUE KEY uq_event_member (event_id, member_id),
  INDEX idx_event (event_id),
  INDEX idx_member (member_id)
);

-- Newsletter Subscribers Table
CREATE TABLE newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  interested_topics TEXT[],
  is_verified BOOLEAN DEFAULT false,
  verification_token VARCHAR(255),
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_verified (is_verified)
);

-- Comments Table (for Phase 2)
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_article (article_id),
  INDEX idx_member (member_id)
);
```

---

## 6. API Specification (Sample Endpoints)

### Authentication Endpoints

```
POST /api/auth/register
  Body: { email, password, name, phone, affiliation }
  Response: { id, token, user { id, email, name, role } }

POST /api/auth/login
  Body: { email, password }
  Response: { token, user { id, email, name, role } }

POST /api/auth/refresh
  Headers: { Authorization: Bearer <token> }
  Response: { token }

POST /api/auth/forgot-password
  Body: { email }
  Response: { message: "Check your email for reset link" }

POST /api/auth/reset-password
  Body: { token, newPassword }
  Response: { message: "Password reset successful" }
```

### Articles Endpoints

```
GET /api/articles?page=1&limit=10&topic=Pernikahan&sort=newest
  Response: { articles: [], total, page, limit }

GET /api/articles/:id
  Response: { id, title, content, author, views, published_at, ... }
  Side effect: Increment view_count

GET /api/articles/featured
  Response: { articles: [] } (only 3-5 featured)

POST /api/articles
  Headers: { Authorization: Bearer <token> }
  Body: { title, content, excerpt, topic, tags }
  Response: { id, slug, status: 'draft' }

PUT /api/articles/:id
  Headers: { Authorization: Bearer <token> }
  Body: { title, content, ... }
  Response: { id, ... updated article }

DELETE /api/articles/:id
  Headers: { Authorization: Bearer <token> (admin only) }
  Response: { message: "Deleted" }
```

### Events Endpoints

```
GET /api/events?page=1&limit=10&status=upcoming&sort=date
  Response: { events: [], total, page, limit }

GET /api/events/:id
  Response: { id, title, date_time, capacity, registrations_count, ... }

POST /api/events/:id/register
  Headers: { Authorization: Bearer <token> }
  Body: {}
  Response: { registration_id, confirmation_sent: true }

DELETE /api/events/:id/register
  Headers: { Authorization: Bearer <token> }
  Response: { message: "Unregistered" }

GET /api/events/:id/registrations
  Headers: { Authorization: Bearer <token> (admin only) }
  Response: { registrations: [ {member_id, name, email, registered_at}, ... ] }
```

---

## 7. Environment Variables

### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001  # dev
NEXT_PUBLIC_API_URL=https://api.fkhk.id    # prod

NEXT_PUBLIC_RECAPTCHA_SITE_KEY=<google-recaptcha-key>
```

### Backend (.env)

```bash
# Server
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/fkhk_db

# Authentication
JWT_SECRET=<long-random-string>
JWT_EXPIRATION=7d

# Email
SENDGRID_API_KEY=<sendgrid-key>
SENDGRID_FROM_EMAIL=noreply@fkhk.id

# File Storage
AWS_S3_BUCKET=fkhk-uploads
AWS_S3_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=<aws-key>
AWS_SECRET_ACCESS_KEY=<aws-secret>

# Error Tracking
SENTRY_DSN=<sentry-dsn>

# Google Analytics
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

---

## 8. Performance Targets

| Metric | Target | How to Achieve |
|--------|--------|---------------|
| **Page Load (First Contentful Paint)** | <2s on 4G | Image optimization, code splitting, CDN |
| **Time to Interactive** | <3s on 4G | Minimize JS, defer non-critical |
| **API Response Time** | <200ms p95 | Database indexes, caching, optimization |
| **Database Query Time** | <50ms p95 | Indexes, query optimization, connection pooling |
| **Lighthouse Score** | >90 | Core Web Vitals, accessibility, best practices |

---

## 9. Deployment Checklist

### Pre-Deployment

- [ ] All tests passing locally
- [ ] Code review approved
- [ ] Database migrations tested
- [ ] Environment variables configured (staging + production)
- [ ] Secrets not committed to repo
- [ ] Security headers added to Express
- [ ] HTTPS redirect enforced
- [ ] CORS configured for allowed domains
- [ ] Rate limiting configured
- [ ] Error tracking (Sentry) configured

### Deployment Steps

1. **Staging Deploy**
   - [ ] Push to staging branch
   - [ ] GitHub Actions runs tests
   - [ ] Auto-deploy to staging environment
   - [ ] Run smoke tests on staging
   - [ ] Manual QA testing

2. **Production Deploy**
   - [ ] Tag release in git (v1.0.0)
   - [ ] Merge to main branch
   - [ ] Trigger production deployment
   - [ ] Run smoke tests on production
   - [ ] Monitor error tracking (Sentry)
   - [ ] Monitor uptime (UptimeRobot)

3. **Post-Deployment**
   - [ ] Verify all features working
   - [ ] Check analytics dashboard
   - [ ] Monitor server logs for errors
   - [ ] Notify team of successful deploy

---

## 10. Cost Breakdown (Monthly, MVP Phase)

| Service | Estimated Cost | Notes |
|---------|---|---|
| **Frontend Hosting (Vercel)** | $0-20 | Free tier sufficient for MVP |
| **Backend Hosting (Railway)** | $5-20 | Starter plan |
| **Database (Managed PostgreSQL)** | $15-30 | Shared cluster adequate |
| **Email (SendGrid)** | $10-30 | 100k emails/month included |
| **File Storage (AWS S3)** | $5-15 | Small data volume |
| **Error Tracking (Sentry)** | $0-29 | Free tier for MVP |
| **Monitoring (UptimeRobot)** | $0 | Free tier |
| **Domain & DNS (Cloudflare)** | $0-10 | Free tier + optional paid |
| **Total Monthly** | **$50-154** | — |
| **Total Yearly (first year)** | **$600-1,800** | (+ one-time dev cost $15-30k) |

---

## 11. Technology Decision Rationale

**Why Next.js over plain React?**
- SEO matters for discoverability (meta tags, structured data)
- API routes reduce backend boilerplate
- Built-in image optimization
- Automatic code splitting and dynamic imports
- Better performance out of the box

**Why PostgreSQL over MongoDB?**
- Relational data (articles → author, events → registrations)
- ACID compliance (critical for event registration capacity)
- Better query performance for complex filters
- Mature ecosystem and support

**Why Express over Next.js API routes for backend?**
- Separation of concerns (dedicated API layer)
- More control over middleware and routing
- Easier to add background jobs, cron tasks
- Scales independently from frontend

**Why Prisma over raw SQL?**
- Type safety (catch errors at compile time)
- Auto-migrations (version control DB schema)
- Queries are more readable
- Built-in pagination, filtering, sorting

**Why JWT over sessions?**
- Stateless (easier to scale horizontally)
- Works well with APIs and mobile apps (future)
- Standard industry practice
- No server-side session storage needed

---

## 12. Future Upgrades (Post-MVP)

- **Caching Layer:** Redis for session storage, article caching
- **Search:** Elasticsearch for full-text search across articles
- **CDN:** CloudFlare workers for edge caching
- **Database:** Read replicas for scaling read-heavy queries
- **Queuing:** Bull/RabbitMQ for async tasks (email, image processing)
- **Authentication:** OAuth (Google/LinkedIn) for easier signup
- **Real-time:** WebSockets for live notifications

---

**Document Version History**

| Version | Date | Author | Notes |
|---------|------|--------|-------|
| 1.0 | 2026-07-17 | Claude Code | Initial tech stack specification |
