# Product Requirements Document (PRD)
# FKHK Website — Forum Kajian Hukum Keluarga

**Document Status:** Version 1.0  
**Last Updated:** July 17, 2026  
**Created From:** Prototype (HTML/CSS/JS)

---

## 1. Executive Summary

FKHK (Forum Kajian Hukum Keluarga) is transitioning from a static prototype to a fully functional platform for a student academic forum focused on Islamic family law studies, research, and community engagement.

The website serves as the central digital hub for:
- Publishing and discovering research articles on family law topics
- Announcing and managing events, seminars, and activities
- Showcasing member achievements and contributions
- Recruiting and onboarding new members
- Building a network of law students and researchers

**Target Launch:** Q3 2026  
**Current Phase:** Prototype → MVP Development

---

## 2. Business Goals

### Primary Goals
1. **Establish digital presence** — Create a professional, searchable home for FKHK online
2. **Increase discoverability** — Help prospective members find and learn about FKHK
3. **Facilitate knowledge sharing** — Make member research and articles accessible
4. **Drive recruitment** — Convert site visitors into active members
5. **Streamline operations** — Replace email/WhatsApp for event announcements and submissions

### Secondary Goals
- Build SEO authority in Islamic family law discourse
- Create portfolio pieces for members' academic/professional profiles
- Generate leads for speakers, collaborators, and organizational partners
- Establish FKHK as a thought leader in family law education

---

## 3. Target Users

### Primary Audiences

| Persona | Who | Goals | Pain Points |
|---------|-----|-------|------------|
| **Student Researcher** | Current members (120+ active) | Find and contribute articles; stay updated on events; network | Hard to track events; no central repo for past work |
| **Prospective Member** | Law students in target schools | Learn about FKHK; understand membership; submit first article | No clear path to join; unsure about requirements |
| **Casual Reader** | Indonesian law students; legal professionals; interested public | Read quality research on family law topics; reference materials | Hard to find curated, credible sources |
| **Event Attendee** | Campus + external participants | Discover & register for events; access materials | No centralized event calendar or reminder system |

### Secondary Audiences
- University lecturers and professors (collaboration, partnership)
- Legal professionals and NGOs (consultation, research partnerships)
- Media and journalists (source for expert commentary)

---

## 4. Current State Analysis

### What Works (Prototype)
✅ **Design System** — Complete, modern UI kit with tokens (colors, spacing, typography)  
✅ **Responsive Layout** — Mobile-first, tested to tablet/desktop  
✅ **Component Library** — Buttons, cards, sliders, navigation all styled  
✅ **Visual Hierarchy** — Clear sections, good use of whitespace and color  
✅ **Interactivity** — Smooth scroll, animations, slider, tab filtering  

### What's Missing (MVP Gaps)
❌ **Backend/Database** — No articles, events, or member data storage  
❌ **Content Management** — No way to add/edit articles or events without code  
❌ **User Accounts** — No member registration, login, or profile system  
❌ **Forms** — Contact, newsletter signup, event registration not functional  
❌ **Article Management** — Articles are hardcoded; no search or filtering  
❌ **Event Calendar** — Events are static; no scheduling or registration system  
❌ **Admin Panel** — No way for FKHK leadership to manage content  
❌ **Analytics** — No tracking of visits, user behavior, or conversion  
❌ **Email Integration** — No newsletter, event reminders, or notifications  

---

## 5. Feature Roadmap

### Phase 1: MVP (Q3 2026) — Core Content & Registration
**Goal:** Make site functional for articles, events, and member sign-ups

#### 5.1.1 Articles System
- **Display** — Render articles from CMS (not hardcoded)
  - Article listing page with filters (topic, author, date)
  - Individual article page with full text + metadata
  - Related articles sidebar
  - Author bio and contribution history
- **Authoring** — Member submission workflow
  - Article submission form with rich text editor
  - Draft/publish workflow
  - Admin review and approval queue
- **Management** — Admin panel for content
  - Bulk upload articles (CSV/JSON import)
  - Edit/delete/featured article controls
  - Category and tag taxonomy

#### 5.1.2 Events & Activities System
- **Display**
  - Event calendar view (month/week/list)
  - Event detail page (date, time, location, description, speaker bio)
  - Capacity tracking (spaces available)
  - Past events archive
- **Registration**
  - Event sign-up form (capture name, email, affiliation)
  - Confirmation email with event details
  - Attendance tracking (QR code or manual check-in)
- **Management**
  - Admin event creation and scheduling
  - Edit event details
  - View registrations and attendance

#### 5.1.3 Member System
- **Registration**
  - Sign-up form (name, email, phone, affiliation, interests)
  - Email verification
  - Welcome sequence (email + member guide)
  - Member directory (searchable by name, interests, affiliation)
- **Profiles**
  - Member bio page (photo, bio, contributions count, articles)
  - Achievement/badge display (e.g., "Contributor," "Event Host")
  - Article publication history
- **Authentication**
  - Simple login (email/password) for members
  - Password reset flow
  - Session management

#### 5.1.4 Admin Dashboard (Basic)
- **Content Management**
  - Articles: Create, edit, delete, publish/unpublish
  - Events: Create, edit, delete, manage registrations
  - Members: View, edit, remove from directory
- **Reports**
  - Member count and growth chart (monthly)
  - Articles published count
  - Event attendance metrics
  - Newsletter signup stats

#### 5.1.5 Newsletter & Notifications
- **Subscription**
  - Newsletter signup form (in footer, sidebar)
  - Double opt-in confirmation
- **Sending**
  - Monthly digest email (recent articles, upcoming events)
  - Event announcements (to interested subscribers)
  - New article notifications (by topic/author followed)

#### 5.1.6 Forms & CTAs
- **Functional Forms**
  - Contact form (name, email, message → email to FKHK admin)
  - Event registration form (linked from event page)
  - Article submission form (members only)
  - Newsletter signup (multiple placement)
- **Validation**
  - Client-side validation (required fields, email format, etc.)
  - Server-side validation and sanitization
  - CAPTCHA on public forms to prevent spam

### Phase 2: Growth (Q4 2026) — Engagement & Analytics
**Goal:** Optimize for member growth and content discovery

#### 5.2.1 Search & Discovery
- Full-text search across articles (by title, content, author)
- Filters by topic, author, date range, article type
- Smart suggestions ("Readers also read…")
- Tag clouds and topic browse

#### 5.2.2 Member Engagement
- Discussion/comments system on articles
- Member follow feature (get notified of new articles from followed members)
- Leaderboard (most published, most engaged, etc.)
- Member showcase (featured contributor)

#### 5.2.3 Content Types
- Case study format (court decisions analysis)
- Opinion piece format (commentary on recent law changes)
- FAQ/Resource guides (curated topic guides)
- Video/podcast embed support (for seminar recordings)

#### 5.2.4 Analytics & Insights
- Article views, engagement, download counts
- Event attendance vs. registration conversion
- Traffic by source (organic search, social, direct, referral)
- Member acquisition funnel (visitor → signup → contributor)
- Conversion tracking (CTAs, newsletter signups, event registrations)

#### 5.2.5 Social Sharing
- Share buttons on article pages (LinkedIn, Twitter, Facebook, WhatsApp)
- Quote sharing on social media
- Article recommendation widget
- Open Graph meta tags for rich previews

### Phase 3: Scale (Q1 2027+) — Community & Monetization
**Goal:** Deepen community engagement and explore sustainability

#### 5.3.1 Advanced Features
- Member webinar/live event hosting (Zoom integration)
- Research collaboration tools (shared docs, project spaces)
- Member mentorship matching
- Downloadable resources (PDFs, templates, legal guides)
- Member certification program (completing courses, publishing, etc.)

#### 5.3.2 Partnerships & Sponsorship
- Partner/sponsor directory and logos
- Sponsored content programs (with disclosure)
- Job board for legal internships/roles (member-only)
- Donation/fundraising page

#### 5.3.3 Mobile App
- iOS/Android native app for article browsing and event registration
- Push notifications for event reminders and new articles
- Offline reading for articles

---

## 6. Technical Specifications

### 6.1 Tech Stack

| Layer | Current (Prototype) | Recommended (MVP) |
|-------|-------|-----------|
| **Frontend** | HTML/CSS/JS (vanilla) | React/Vue or Next.js (for scalability) |
| **Backend** | None | Node.js/Express or Python/Django/FastAPI |
| **Database** | None | PostgreSQL (relational, rich queries) |
| **CMS** | None | Headless CMS (Strapi, Contentful, or simple admin panel) |
| **Hosting** | Static file hosting | Vercel/Netlify (frontend) + AWS/DigitalOcean (backend) |
| **Auth** | None | Firebase Auth or Auth0 |
| **Email** | None | SendGrid or Mailgun (newsletter + transactional) |
| **Storage** | None | AWS S3 or similar (for article PDFs, images) |
| **Analytics** | None | Google Analytics 4 + Mixpanel |
| **Forms** | None | Formspree or custom backend |

### 6.2 Architecture (Recommended for MVP)

```
Frontend (React/Next.js)
  ↓ API calls
Backend (Express.js / FastAPI)
  ↓
Database (PostgreSQL)
  ├─ articles table
  ├─ events table
  ├─ members table
  ├─ registrations table
  └─ newsletters table
  ↓
External Services
  ├─ SendGrid (email)
  ├─ AWS S3 (file storage)
  └─ Auth0 (authentication)
```

### 6.3 Key API Endpoints (MVP)

**Articles**
- `GET /api/articles` — List articles (with filters, pagination)
- `GET /api/articles/:id` — Article detail
- `POST /api/articles` — Submit article (members only)
- `PUT /api/articles/:id` — Edit article (author or admin)
- `DELETE /api/articles/:id` — Delete (admin only)

**Events**
- `GET /api/events` — List events
- `GET /api/events/:id` — Event detail
- `POST /api/events/:id/register` — Register for event
- `POST /api/events` — Create event (admin only)

**Members**
- `POST /api/auth/register` — Sign up
- `POST /api/auth/login` — Log in
- `GET /api/members/:id` — Member profile
- `GET /api/members` — Member directory
- `PUT /api/members/:id` — Update profile

**Newsletter**
- `POST /api/newsletter/subscribe` — Subscribe
- `POST /api/newsletter/unsubscribe` — Unsubscribe

### 6.4 Database Schema (MVP Core Tables)

```sql
-- Members
CREATE TABLE members (
  id SERIAL PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  phone VARCHAR,
  affiliation VARCHAR,
  bio TEXT,
  avatar_url VARCHAR,
  interests TEXT[],
  joined_at TIMESTAMP DEFAULT NOW(),
  role ENUM ('member', 'admin', 'moderator'),
  is_active BOOLEAN DEFAULT TRUE
);

-- Articles
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_id INTEGER REFERENCES members(id),
  topic VARCHAR,
  tags TEXT[],
  status ENUM ('draft', 'submitted', 'published', 'archived'),
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP,
  featured BOOLEAN DEFAULT FALSE
);

-- Events
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  description TEXT NOT NULL,
  date_time TIMESTAMP NOT NULL,
  location VARCHAR,
  online_url VARCHAR,
  capacity INTEGER,
  created_by INTEGER REFERENCES members(id),
  status ENUM ('upcoming', 'completed', 'cancelled'),
  image_url VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Event Registrations
CREATE TABLE registrations (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id),
  member_id INTEGER REFERENCES members(id),
  registered_at TIMESTAMP DEFAULT NOW(),
  attended BOOLEAN DEFAULT FALSE,
  UNIQUE(event_id, member_id)
);

-- Newsletter Subscribers
CREATE TABLE newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR,
  subscribed_at TIMESTAMP DEFAULT NOW(),
  verified BOOLEAN DEFAULT FALSE,
  interested_topics TEXT[]
);
```

### 6.5 Security & Compliance

- **Authentication** — Email/password with hashed passwords (bcrypt)
- **Authorization** — Role-based access control (member, admin, moderator)
- **HTTPS** — All traffic encrypted
- **Input Validation** — Sanitize all user inputs (prevent SQL injection, XSS)
- **Rate Limiting** — API rate limits to prevent abuse
- **Privacy** — Privacy policy and terms of service pages
- **GDPR Compliance** — Data export and deletion requests for members
- **CAPTCHA** — Google reCAPTCHA v3 on public forms

---

## 7. Content Strategy

### 7.1 Article Publishing

**Frequency:** 2-3 articles per month (minimum)  
**Topics:** Islamic family law, contemporary issues, case analysis, legal updates  
**Authors:** Members (reviewed), occasional guest contributions  
**Review Process:**
1. Member submits article draft
2. Editorial review (2-3 days)
3. Feedback/revision cycle
4. Publication and promotion

**Promotion Strategy:**
- Featured article on homepage (weekly rotation)
- Newsletter inclusion
- Social media sharing (LinkedIn, Twitter)
- Tags and category for discovery

### 7.2 Events Strategy

**Types:**
- Monthly kajian session (discussion group)
- Quarterly seminar (external speaker)
- Annual conference or symposium
- Workshops on practical legal skills
- Site visit/learning tours

**Cadence:** 1-2 events per month

**Promotion:**
- Event calendar on website
- Email announcement to subscribers
- Social media event posts
- In-campus flyers

### 7.3 Member Showcase

**Sections:**
- Achievement cards (updated quarterly) — showcase member awards, publications, internships
- Featured contributor — highlight member interview/profile (monthly)
- Member stat leaderboard — top contributors, most engaged

**Goal:** Drive pride in membership and encourage contributions

---

## 8. Success Metrics & KPIs

### Awareness Metrics
- **Monthly website visitors** — Target: 500 by Q4 2026, 2,000 by Q1 2027
- **Organic search traffic** — Target: 30% of total by Q4 2026
- **Social media mentions** — Target: 50+ per month by Q4 2026

### Engagement Metrics
- **Average time on site** — Target: >3 minutes
- **Article views per month** — Target: 1,000+ by Q4 2026
- **Article completion rate** — Target: 60%+ (read to end)
- **Newsletter click-through rate** — Target: 20%+
- **Event registration rate** — Target: 70% attendance vs. registrations

### Conversion Metrics
- **New member signups** — Target: 20-30 per quarter
- **Article submissions** — Target: 10+ per quarter
- **Event attendance** — Target: 30+ per event
- **Newsletter subscribers** — Target: 500+ by Q4 2026

### Content Metrics
- **Published articles per month** — Target: 2-3
- **Total article library** — Target: 50+ by Q4 2026
- **Topics covered** — Target: 10+ distinct family law topics
- **Author diversity** — Target: 20+ unique contributors

### Retention Metrics
- **Member monthly active rate** — Target: 60%+ login in given month
- **Repeat visitor rate** — Target: 40%+
- **Newsletter unsubscribe rate** — Target: <2% per send

---

## 9. Implementation Roadmap

### Phase 1: MVP — Weeks 1-8

**Week 1-2: Planning & Design**
- [ ] Finalize technical architecture and data model
- [ ] Design database schema and API contracts
- [ ] Create frontend mockups for new pages (login, dashboard, article edit)
- [ ] Set up development environment and repos

**Week 3-4: Backend Foundation**
- [ ] Set up Node.js/Express server and PostgreSQL database
- [ ] Implement authentication (registration, login, JWT)
- [ ] Create articles API endpoints
- [ ] Create events API endpoints
- [ ] Create members API endpoints

**Week 5-6: Frontend Integration**
- [ ] Integrate frontend with backend APIs
- [ ] Build article listing and detail pages (fetch from API)
- [ ] Build event calendar and registration form
- [ ] Build member directory and profile pages
- [ ] Build admin dashboard (basic)

**Week 7: Polish & Testing**
- [ ] End-to-end testing (article submission to publication flow)
- [ ] Performance optimization
- [ ] Mobile responsiveness check
- [ ] Security audit (input validation, auth, HTTPS)

**Week 8: Launch Prep**
- [ ] Set up hosting (Vercel/Netlify for frontend, AWS/DO for backend)
- [ ] Configure domain and DNS
- [ ] Set up email service (SendGrid)
- [ ] Deploy to staging, final QA
- [ ] Launch to production with monitoring

### Phase 2: Growth — Weeks 9-16 (Q4 2026)

**Week 9-10:**
- [ ] Full-text search and filtering on articles
- [ ] Comments system on articles
- [ ] Google Analytics integration

**Week 11-12:**
- [ ] Member follow feature
- [ ] Leaderboard and badges
- [ ] Email notifications

**Week 13-14:**
- [ ] Social sharing buttons
- [ ] More content types (case studies, opinion pieces)

**Week 15-16:**
- [ ] Refinement based on user feedback
- [ ] Performance optimization
- [ ] Content bulk import (historical articles)

### Phase 3: Scale — Q1 2027+

- [ ] Advanced features (webinars, collaboration tools, certification)
- [ ] Mobile app development
- [ ] Partnerships and sponsorship program
- [ ] Donation and fundraising integration

---

## 10. Resource Requirements

### Team

| Role | Responsibility | Estimated Hours |
|------|---|---|
| **Product Manager** | Roadmap, requirements, stakeholder comms | 8 hrs/week |
| **Backend Developer** | API, database, authentication | 30 hrs/week |
| **Frontend Developer** | UI, integration, optimization | 25 hrs/week |
| **QA/Tester** | Testing, bug reporting | 10 hrs/week |
| **Content Lead** | Seeding content, review, editorial | 8 hrs/week |
| **DevOps/Ops** | Hosting, deployment, monitoring | 5 hrs/week |

**Total Effort (MVP):** ~85 hours/week × 8 weeks = 680 hours (equiv. ~4 FTE months)

### Budget Estimates (First Year)

| Item | Cost |
|------|------|
| Cloud hosting (AWS/DigitalOcean) | $200-400/month |
| Email service (SendGrid) | $20-100/month |
| Domain + SSL | $15-30/month |
| Analytics (optional premium) | $0-50/month |
| Development (contract/agency) | $15,000-30,000 (one-time MVP) |
| **Total First Year** | **~$20,000-35,000** |

---

## 11. Risks & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|-----------|
| **Scope creep** — Adding too many features delays MVP | High | High | Strict feature freeze after MVP; Phase 2+ for new ideas |
| **Low content quality** — Articles lack rigor | Medium | Medium | Editorial review process; clear submission guidelines |
| **Low member adoption** — People don't join/contribute | High | Medium | Marketing push at launch; early wins with featured content |
| **Data loss** — Server outage or backup failure | High | Low | Regular database backups; multi-region deployment |
| **Security breach** — User data compromised | High | Low | Security audit before launch; HTTPS, input validation, rate limiting |
| **Scaling issues** — Site slow when traffic grows | Medium | Medium | Load testing; caching (Redis); CDN for static assets |

---

## 12. Success Criteria for MVP

### Launch Requirements (Must Have)
- ✅ Articles system working (submit, review, publish, display)
- ✅ Member registration and authentication
- ✅ Events calendar with registration
- ✅ Basic admin panel for content management
- ✅ Newsletter subscription
- ✅ Mobile responsive design
- ✅ HTTPS and security validated
- ✅ 99.5% uptime target on launch day

### Quality Gates
- ✅ No critical bugs in testing
- ✅ Load testing: 1,000 concurrent users
- ✅ Page load time <3 seconds on 4G
- ✅ Accessibility (WCAG AA minimum)
- ✅ All forms validated and working

### Launch Metrics (First 30 Days)
- 200-300 unique visitors
- 50+ member signups
- 100+ newsletter subscribers
- 2+ new articles published
- 1+ event with 20+ registrations

---

## 13. Post-Launch Plan

### Feedback Loop
- Weekly team syncs to review usage data and feedback
- Monthly member surveys
- Quarterly roadmap refinement based on data + feedback

### Content Calendar
- Month 1-2: Seed 8-10 articles from existing member work
- Month 3+: 2-3 new articles per month (steady state)
- 1 event per month minimum

### Growth Initiatives
- Outreach to similar forums and legal networks (partnerships)
- Student org collaboration for event co-hosting
- Blog SEO push for "islamic family law" keywords
- Email nurture sequence for new members

---

## 14. Appendices

### Appendix A: Current Prototype Inventory

**Static Pages:**
- Homepage (hero, features, about, articles slider, events, achievements, footer)
- Login stub (`login.html` link)
- Register stub (`register.html` link)

**UI Components (Completed):**
- Navbar (responsive, sticky scroll effect)
- Hero section with stats
- Feature cards (3 columns)
- Article cards with slider
- Event cards with tab filtering
- Member achievement cards
- Supporter carousel
- Footer with embedded map
- Responsive design (desktop, tablet, mobile)

**Assets:**
- Design tokens (colors, spacing, typography, shadows)
- Logo and branding
- Placeholder images

### Appendix B: Sample Content Structure

**Article Metadata:**
```json
{
  "title": "Dispensasi Perkawinan: Dilema Perlindungan Anak dan Kepastian Hukum",
  "author": "M. Riziq Fauzi",
  "topic": "Pernikahan",
  "published_date": "2026-07-05",
  "excerpt": "Analisis yuridis terhadap praktik dispensasi perkawinan anak...",
  "content": "...",
  "tags": ["pernikahan", "hukum-keluarga", "perlindungan-anak"],
  "views": 234,
  "featured": false
}
```

**Event Metadata:**
```json
{
  "title": "Seminar Hukum Keluarga Islam Kontemporer",
  "date": "2026-08-20",
  "time": "19:00",
  "location": "Aula Gedung A, Universitas X",
  "description": "...",
  "speaker": "Dr. Ahmad Syaiful Aziz",
  "capacity": 150,
  "registered": 89,
  "status": "upcoming"
}
```

### Appendix C: Glossary

- **FKHK** — Forum Kajian Hukum Keluarga (Islamic Family Law Study Forum)
- **Kajian** — Study/seminar session (typically informal, discussion-based)
- **Dispensasi** — Court authorization (e.g., for underage marriage)
- **Faraid** — Islamic inheritance law
- **Nikah Siri** — Unregistered Islamic marriage
- **HKI** — Hukum Keluarga Islam (Islamic Family Law)

---

**Document Version History**

| Version | Date | Author | Notes |
|---------|------|--------|-------|
| 1.0 | 2026-07-17 | Claude Code | Initial PRD from prototype analysis |

---

**For Questions or Feedback:** Refer to this PRD during implementation. Schedule sync meetings to address scope changes or priority shifts.
