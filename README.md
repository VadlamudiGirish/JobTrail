# ApplicationTrail

[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

A **Next.js**-powered job application tracker with full CRUD, filtering, PDF export, and a dashboard.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)

   * [Prerequisites](#prerequisites)
   * [Clone the Repo](#clone-the-repo)
   * [Install Dependencies](#install-dependencies)
   * [Environment Variables](#environment-variables)
   * [Database Setup](#database-setup)
   * [Running the App](#running-the-app)
5. [Project Structure](#project-structure)
6. [API Endpoints](#api-endpoints)
7. [Dashboard & Charts](#dashboard--charts)
8. [Contributing](#contributing)
9. [License](#license)

---

## Introduction

ApplicationTrail helps you **track**, **filter**, and **export** your job applications.
Built with Next.js App Router, Prisma ORM, Tailwind CSS, React Hook Form, SWR, and Recharts.

---

## Features

* **User Authentication** with NextAuth.js
* **CRUD** for Applications
* **Dynamic Filters**: status, month, search, pagination
* **PDF Export** of monthly or all applications (jsPDF + autoTable)
* **Dashboard** with:

  * Totals cards (Applied, Interviewed, Rejected)
  * Bar chart (group by month / status / location)
  * Recent applications table
* **Internationalization** (locale-aware date formatting)
* **Responsive UI** with Tailwind CSS

---

## Tech Stack

* **Framework**: Next.js (App Router, React Server + Client Components)
* **Styling**: Tailwind CSS
* **Auth**: NextAuth.js
* **Database**: PostgreSQL via Prisma
* **Data Fetching**: SWR
* **Forms & Validation**: React Hook Form + Zod
* **Charts**: Recharts
* **PDF Generation**: jsPDF + jspdf-autotable
* **Markdown**: React Markdown

## Getting Started

### Prerequisites

* **Node.js** ≥ 18
* **npm** or **Yarn**
* **PostgreSQL** instance (local or hosted)

### Clone the Repo

```bash
git clone https://github.com/<your-username>/applicationtrail.git
cd applicationtrail
```

### Install Dependencies

```bash
npm install
# or
yarn install
```

### Environment Variables

Copy `.env.example` → `.env` and fill in:

```env
DATABASE_URL=postgresql://USER:PASS@HOST:PORT/DB
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID="google_oauth_client_id"
GOOGLE_CLIENT_SECRET="google_oauth_client_secret"
GITHUB_CLIENT_ID="github_oauth_client_id"
GITHUB_CLIENT_SECRET="github_client_oauth_secret"
```

### Database Setup

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Running the App

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

## API Endpoints

| Method   | Path                             | Description                                     |
| -------- | -------------------------------- | ----------------------------------------------- |
| `GET`    | `/api/user/profile`              | Get or create user profile                      |
| `POST`   | `/api/user/profile`              | Upsert user profile                             |
| `GET`    | `/api/applications`              | List applications (filters, pagination)         |
| `POST`   | `/api/applications`              | Create a new application                        |
| `GET`    | `/api/applications/:id`          | Get application details                         |
| `PUT`    | `/api/applications/:id`          | Update application                              |
| `DELETE` | `/api/applications/:id`          | Delete application                              |
| `GET`    | `/api/applications/download`     | Available months for PDF                        |
| `GET`    | `/api/applications/download-pdf` | Generate PDF buffer (server‐side, NextResponse) |
| `GET`    | `/api/applications/dashboard`    | Dashboard payload (totals, byMonth, byLocation) |

---

## Dashboard & Charts

* **StatsCard**: small info cards
* **ChartPanel**:

  * Switch between grouping by **month**, **status**, or **location**
  * Responsive bar chart via **Recharts**
* **Recent Applications**: clickable table

---

## Contributing

1. **Fork** the repo
2. Create your **feature branch** (`git checkout -b feature/foo`)
3. **Commit** your changes (`git commit -am 'Add foo'`)
4. **Push** to the branch (`git push origin feature/foo`)
5. Open a **Pull Request**

Please follow [Conventional Commits](https://www.conventionalcommits.org/) and run `npm run lint`/`npm run test` before submitting.

---

## License

This project is licensed under the **MIT License**.
