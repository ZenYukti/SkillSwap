# SkillSwap - Project Summary

<div align="center">
  <img src="https://img.shields.io/badge/Status-Live-success" alt="Status" />
  <img src="https://img.shields.io/badge/Version-1.0.0-blue" alt="Version" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
  <img src="https://img.shields.io/badge/Built%20by-Team%20ZenYukti-blueviolet" alt="Team" />
</div>

## 🎯 Problem Statement

### The Challenge

In today's knowledge economy, millions of people possess valuable skills they're willing to share, while simultaneously seeking to learn new ones. However, traditional skill-learning options present significant barriers:

1. **Financial Barriers**: Professional courses, tutors, and coaching programs can cost hundreds to thousands of dollars
2. **Underutilized Skills**: Many skilled individuals have expertise they rarely use or monetize
3. **Trust Issues**: Finding reliable teachers or learning partners is difficult without proper vetting systems
4. **Inflexible Systems**: Most platforms require monetary transactions, excluding those with valuable skills but limited budgets
5. **Lack of Community**: Learning in isolation without peer support or collaboration opportunities

### The Gap in the Market

While platforms exist for paid tutoring and courses, there's a significant gap for **pure skill-for-skill exchanges** where:
- A web developer could trade coding lessons for guitar instruction
- A graphic designer could exchange design work for language tutoring
- A marketing expert could barter strategy sessions for cooking classes

---

## 💡 Our Solution: SkillSwap

**SkillSwap** is a **barter-only skill marketplace** where users trade skills directly—no money involved. It's built on the principle that everyone has something valuable to teach and something they want to learn.

### Core Value Proposition

> *"Trade your expertise for new skills. Learn. Teach. Grow Together."*

---

## ✨ Key Features

### 1. **Skill Marketplace**
- Post skill **offers** (what you can teach)
- Post skill **requests** (what you want to learn)
- Browse and filter skills by category, level, and type
- Detailed skill pages with descriptions and tags

### 2. **User Profiles & Reputation**
- Public profiles showcasing skills and experience
- Star ratings and reviews from completed exchanges
- Trust scores based on successful trades
- Skill verification badges

### 3. **SkillCoin System**
- Earn virtual credits for completed teaching sessions
- Use SkillCoins when direct skill matches aren't available
- Prevents exploitation of one-sided exchanges
- Creates a fair and balanced economy

### 4. **Barter Deal Management**
- Propose skill exchanges to other users
- Negotiate terms (hours, schedule, format)
- Track active and completed deals
- Deal milestones and progress tracking

### 5. **Real-Time Messaging**
- Direct chat between users
- Discussion threads for deal negotiations
- File and link sharing
- Message notifications

### 6. **Notification System**
- New message alerts
- Deal status updates
- Review reminders
- Weekly activity digests

### 7. **Settings & Privacy**
- Profile customization
- Privacy controls
- Notification preferences
- Account security (password change, 2FA coming soon)

---

## 🛠️ Technical Architecture

### Tech Stack (MERN)

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|--|---------||
| **Frontend** | React.js | 18.x | Component-based UI library |
| **Build Tool** | Vite | 5.x | Fast dev server & bundler |
| **Routing** | React Router | 6.x | Client-side navigation |
| **Animations** | Framer Motion | 10.x | Smooth UI animations |
| **HTTP Client** | Axios | 1.x | API requests |
| **Styling** | Custom CSS | - | Modern responsive design |
| **Runtime** | Node.js | 18.x+ | JavaScript runtime |
| **Framework** | Express.js | 4.x | REST API server |
| **Database** | MongoDB | 8.x | NoSQL document database |
| **ODM** | Mongoose | 8.x | MongoDB object modeling |
| **Auth** | JWT | - | Access & Refresh tokens |
| **Security** | bcrypt | - | Password hashing |
| **File Upload** | Multer | - | Image/file handling |
| **Headers** | Helmet | - | HTTP security headers |
| **Rate Limit** | express-rate-limit | - | API abuse prevention |

### Project Structure

```
SkillSwap/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Browse.jsx
│   │   │   ├── SkillDetail.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Messages.jsx
│   │   │   ├── Notifications.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── auth/
│   │   │       ├── Login.jsx
│   │   │       └── Register.jsx
│   │   ├── styles/
│   │   │   └── global.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── vite.config.js
│
├── server/                    # Express Backend
│   ├── src/
│   │   ├── config/            # Configuration
│   │   │   ├── db.js
│   │   │   └── constants.js
│   │   ├── controllers/       # Route handlers
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── skillController.js
│   │   │   ├── dealController.js
│   │   │   ├── messageController.js
│   │   │   └── notificationController.js
│   │   ├── middleware/        # Express middleware
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   └── rateLimiter.js
│   │   ├── models/            # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Skill.js
│   │   │   ├── BarterDeal.js
│   │   │   ├── Conversation.js
│   │   │   ├── Review.js
│   │   │   └── Notification.js
│   │   ├── routes/            # API routes
│   │   └── server.js          # Entry point
│   └── .env
│
└── package.json               # Root package.json
```

---

## 🔄 How It Works

### User Journey

```
┌─────────────────────────────────────────────────────────────┐
│  1. SIGN UP                                                 │
│     Create account with email, username, password           │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  2. CREATE PROFILE                                          │
│     Add bio, location, skills you offer & want to learn     │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  3. BROWSE SKILLS                                           │
│     Search for skills, filter by category/level             │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  4. CONNECT & PROPOSE                                       │
│     Send message to potential exchange partner              │
│     Propose barter deal with terms                          │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  5. EXCHANGE SKILLS                                         │
│     Complete the skill exchange sessions                    │
│     Track progress through milestones                       │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  6. REVIEW & EARN                                           │
│     Leave reviews for each other                            │
│     Earn SkillCoins and reputation                          │
└─────────────────────────────────────────────────────────────┘
```

### Barter Deal Flow

```
User A (Teacher)                    User B (Learner)
      │                                   │
      │    ──── Propose Deal ────>        │
      │                                   │
      │    <── Accept/Negotiate ──        │
      │                                   │
      │    ════ Deal Active ═════         │
      │                                   │
      │    ──── Complete Sessions ────>   │
      │                                   │
      │    <──── Mark Complete ────       │
      │                                   │
      │    ──── Leave Review ────>        │
      │    <──── Leave Review ────        │
      │                                   │
      │    ═══ SkillCoins Earned ═══      │
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/ZenYukti/SkillSwap.git
cd SkillSwap

# Install all dependencies
npm run install:all

# Set up environment variables
cp server/.env.example server/.env
# Edit .env with your MongoDB URI and JWT secrets

# Seed demo data (optional)
cd server && node src/scripts/seedDemo.js

# Start development servers
npm run dev
```

### Demo Accounts

| Email | Password | Role |
|-------|----------|------|
| john@example.com | password123 | Developer |
| sarah@example.com | password123 | Designer |
| mike@example.com | password123 | Teacher |
| emma@example.com | password123 | Artist |
| david@example.com | password123 | Marketer |

---

## 📊 Database Schema

### Core Models

**User**
- Authentication (email, password hash)
- Profile (name, bio, avatar, location)
- Stats (skillCoins, rating, completedDeals)
- Settings (notifications, privacy)

**Skill**
- Type (offer/request)
- Details (title, description, category)
- Level (beginner/intermediate/advanced/expert)
- Tags and estimated hours

**BarterDeal**
- Participants (requester, provider)
- Skills being exchanged
- Status (pending/active/completed/cancelled)
- Milestones and progress

**Conversation & Messages**
- Real-time chat between users
- Message history and read status

**Review**
- Star rating (1-5)
- Written feedback
- Linked to completed deals

---

## 🎨 UI/UX Design Principles

1. **Modern & Clean**: Minimalist interface with clear visual hierarchy
2. **Responsive**: Mobile-first design that works on all devices
3. **Animated**: Smooth Framer Motion animations for delightful interactions
4. **Accessible**: WCAG-compliant color contrast and keyboard navigation
5. **Consistent**: Unified design system with CSS variables

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | #6366f1 | Buttons, links, accents |
| Secondary | #10b981 | Success, offers |
| Background | #f8fafc | Page backgrounds |
| Card | #ffffff | Cards, modals |
| Text | #0f172a | Primary text |
| Muted | #94a3b8 | Secondary text |

---

## 🔐 Security Features

- **Password Hashing**: bcrypt with 12 rounds
- **JWT Tokens**: Short-lived access tokens (15m) + refresh tokens (7d)
- **Rate Limiting**: API request limits to prevent abuse
- **Input Validation**: Server-side validation on all endpoints
- **CORS Protection**: Configured for specific origins
- **Helmet.js**: Security headers

---

## 🗺️ Roadmap

### Phase 1 (Current) ✅
- [x] User authentication
- [x] Skill listings (offers/requests)
- [x] User profiles
- [x] Basic messaging
- [x] Browse and search

### Phase 2 (Next)
- [ ] Real-time messaging (Socket.io)
- [ ] Barter deal workflow
- [ ] Review system
- [ ] SkillCoin transactions
- [ ] Email notifications

### Phase 3 (Future)
- [ ] Video call integration
- [ ] Calendar scheduling
- [ ] Mobile app (React Native)
- [ ] AI skill matching
- [ ] Community features

---

## 🤝 Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 👥 Team ZenYukti

Built with ❤️ by **Team ZenYukti**

| | |
|---|---|
| 🌐 **Website** | [zenyukti.in](https://zenyukti.in) |
| 💼 **LinkedIn** | [linkedin.com/company/ZenYukti](https://linkedin.com/company/ZenYukti) |
| 🐦 **Twitter/X** | [x.com/ZenYukti](https://x.com/ZenYukti) |
| 💬 **Discord** | [Join our community](https://go.zenyukti.in/discord) |
| 📧 **Email** | [info@zenyukti.in](mailto:info@zenyukti.in) |
| 🛟 **Support** | [support@zenyukti.in](mailto:support@zenyukti.in) |

---

<div align="center">
  <strong>Learn. Build. Share.</strong>
  <br><br>
  <em>"To grow together"</em> — Team ZenYukti 💜
</div>
