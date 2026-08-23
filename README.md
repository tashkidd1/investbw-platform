# InvestBW

> **A Botswana-focused simulated investment platform designed to make investing easier to understand, explore and practise.**

InvestBW is a modern web-based investment simulation and financial education platform that allows users to explore Botswana and global investment markets, build virtual portfolios, and learn about investing in a risk-free environment.

> **Important:** InvestBW is currently a simulated investing platform. No real money is deposited, transferred, or invested, and no real securities are traded.

---

## 📌 Overview

Investing can often feel complicated and inaccessible, particularly for people who are new to financial markets.

InvestBW aims to provide a more approachable starting point by combining:

- Investment simulation
- Portfolio tracking
- Financial education
- Investment goals
- Market exploration
- Virtual cash management
- Automated investment concepts

The platform is designed around a simple idea:

> **Learn. Explore. Practise. Invest smarter.**

Users can explore investment opportunities across Botswana and global markets while using virtual funds to understand how investment decisions can affect a portfolio.

---

# 🚀 Current Status

InvestBW is currently in active development.

The project has progressed beyond a static prototype and currently provides a functional **demo investment experience**.

### Current development stage

**Demo MVP / Functional Prototype**

The current version focuses on validating the user experience and investment simulation before introducing more advanced infrastructure.

The next major development milestone is:

> **InvestBW V0.2 — Persistent Demo Platform**

The goal is to transition the current simulated experience from primarily browser-based demo state into persistent user accounts backed by Supabase.

---

# ✨ Current Features

## 🔐 Authentication

- User registration
- Email and password login
- Password validation
- Password strength indicators
- Supabase authentication integration
- Demo mode access

---

## 💰 Simulated Investing

Users can explore investing using virtual funds.

Current capabilities include:

- Virtual cash balance
- Simulated investment purchases
- Simulated investment sales
- Portfolio holdings
- Portfolio value calculations
- Transaction history
- Trading fees
- Simulated investment performance

All investing activity is currently for demonstration and educational purposes only.

---

## 📊 Markets

InvestBW supports an investment catalogue designed around:

### Botswana Market

- Botswana-focused investments
- Local equities
- Market and sector information

### Global Markets

- Global equities
- ETFs
- REITs
- Bonds

Investment records can include:

- Ticker
- Investment name
- Category
- Sector
- Market
- Current price
- Daily percentage change
- Market capitalisation
- P/E ratio
- Dividend yield
- Historical price information

---

## 📈 Portfolio Management

Users can:

- View their portfolio
- Track holdings
- Monitor portfolio value
- Review investment performance
- View transaction history
- Manage virtual cash

---

## 🎯 Investment Goals

InvestBW includes goal-based investing functionality.

Users can create and manage investment goals such as:

- Buying a home
- Children's education
- Retirement
- Building wealth
- Emergency funds
- Personal financial goals

The platform supports goal contributions and tracks progress toward investment targets.

---

## 🔄 Auto-Invest

InvestBW includes recurring investment functionality that allows users to create simulated recurring investment plans.

This provides a foundation for exploring concepts such as:

- Regular investing
- Consistent contributions
- Long-term investing
- Goal-based investment strategies

---

## 👀 Watchlists

Users can maintain a watchlist of investments they are interested in following.

This allows users to:

- Track potential investments
- Monitor securities before investing
- Build a list of investments for future research

---

## 📚 Learn

InvestBW includes an educational component designed to help users understand investing concepts.

Educational content can be organised by:

- Category
- Difficulty level
- Reading time
- Tags

Content is intended to support:

- Beginners
- Intermediate learners
- More experienced investors

---

## 🤖 Investment Assistant

The platform includes an investment-focused assistant designed to help users explore and understand investment-related concepts.

The assistant is intended to support learning and exploration and should not be considered a substitute for professional financial advice.

---

## 🔔 Notifications

The platform includes an in-app notification system designed to support events such as:

- Investment activity
- Goal updates
- Portfolio activity
- Other account events

---

## 👤 User Experience

The current application includes:

- Landing page
- User onboarding
- Dashboard
- Markets
- Investment details
- Portfolio
- Goals
- Auto-invest
- Watchlist
- Learning centre
- Investment assistant
- Cash management
- Transactions
- Notifications
- User profile
- Security settings
- Help and support

---

# 🏗️ Technology Stack

InvestBW is built using:

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router

### Backend & Authentication

- Supabase
- Supabase Auth
- PostgreSQL

### UI

- Lucide React
- Custom reusable components

---

# 🗄️ Database Architecture

The project includes a Supabase database architecture designed to support persistent user accounts and simulated investment activity.

Current database entities include:

- `investments`
- `educational_content`
- `profiles`
- `cash_accounts`
- `holdings`
- `transactions`
- `watchlists`
- `goals`
- `goal_contributions`
- `recurring_investments`
- `notifications`
- `portfolio_snapshots`
- `dividends`

The database includes:

- Row Level Security (RLS)
- User-level ownership controls
- Foreign key relationships
- Database indexes
- Cascading deletes
- Timestamp tracking

---

# 🧭 Current Architecture

The current application operates primarily as a simulated investment environment.

The existing product flow can be represented as:

```text
User
  │
  ▼
Authentication / Demo Access
  │
  ▼
Onboarding
  │
  ▼
InvestBW Application
  │
  ├── Dashboard
  ├── Markets
  ├── Portfolio
  ├── Goals
  ├── Auto-Invest
  ├── Watchlist
  ├── Learn
  └── Investment Assistant
