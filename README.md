# 🏠 RentNest Backend

### A Property Rental Management REST API

**RentNest** is a backend REST API for a property rental management platform where tenants can discover properties, submit rental requests, make online payments, and leave reviews, while landlords can manage properties and rental requests. Administrators can manage users and monitor the overall platform.

🌐 **Live API:** https://rent-nest-backend-beryl.vercel.app

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [User Roles](#-user-roles)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Project Structure](#-project-structure)
- [Authentication](#-authentication)
- [Rental Workflow](#-rental-workflow)
- [Payment Workflow](#-payment-workflow)
- [Review System](#-review-system)
- [Admin Module](#-admin-module)
- [Database](#-database)
- [API Modules](#-api-modules)
- [Environment Variables](#-environment-variables)
- [Installation & Setup](#-installation--setup)
- [Available Scripts](#-available-scripts)
- [Postman Testing](#-postman-testing)
- [Deployment](#-deployment)
- [Future Improvements](#-future-improvements)
- [Author](#-author)

---

# 🚀 Project Overview

RentNest is designed as a scalable backend system for a property rental marketplace.

The platform supports three major user roles:

- 👤 **Tenant**
- 🏠 **Landlord**
- 👨‍💼 **Admin**

Tenants can browse available properties, send rental requests, complete payments, and submit reviews.

Landlords can create and manage properties and approve or reject rental requests.

Administrators can manage users and monitor important platform statistics.

The backend follows a modular architecture using **Node.js, Express.js, TypeScript, Prisma ORM, and PostgreSQL**.

---

# ✨ Features

## 👤 Authentication

- User registration
- User login
- JWT-based authentication
- Access token
- Refresh token
- Role-based authorization
- Password hashing using bcrypt
- Protected API routes

---

## 🏠 Property Management

- Create properties
- Update properties
- Delete properties
- View property details
- View available properties
- Property status management
- Property categories
- Search
- Filtering
- Sorting
- Pagination

---

## 📩 Rental Request Management

Tenants can:

- Submit rental requests
- View rental requests
- Track request status

Landlords can:

- View rental requests
- Approve requests
- Reject requests

Rental request lifecycle:

```text
PENDING
   │
   ├──────────────► REJECTED
   │
   ▼
APPROVED
   │
   ▼
PAYMENT
   │
   ▼
ACTIVE
```

---

# 💳 Stripe Payment Integration

RentNest uses **Stripe Checkout** for online rental payments.

Payment is only available after a rental request has been approved by the landlord.

### Payment Flow

```text
Tenant
   │
   ▼
Rental Request
   │
   ▼
Landlord Approval
   │
   ▼
Create Stripe Checkout Session
   │
   ▼
Stripe Payment
   │
   ▼
checkout.session.completed
   │
   ▼
Stripe Webhook
   │
   ▼
Payment → COMPLETED
   │
   ▼
Rental → ACTIVE
   │
   ▼
Property → RENTED
```

The payment confirmation process is handled through a Stripe webhook.

### Webhook Endpoint

```text
POST /api/payments/confirm
```

The webhook updates the payment, rental request, and property status inside a database transaction.

---

# ⭐ Review System

Tenants can submit reviews for properties after their rental becomes active.

The review system supports:

- Rating
- Comment
- Tenant-property relationship
- Review history
- Duplicate review prevention

Ratings are maintained on a **1–5 scale**.

---

# 👨‍💼 Admin Module

The Admin module provides platform-level management functionality.

Admin capabilities include:

- View users
- Update user status
- Manage platform users
- View properties
- View rental requests
- View platform statistics
- Monitor payment and rental information

### Admin Dashboard Statistics

The dashboard provides information such as:

- Total users
- Total tenants
- Total landlords
- Total properties
- Available properties
- Rented properties
- Rental requests
- Pending requests
- Approved requests
- Active rentals
- Completed payments
- Total revenue

---

# 👥 User Roles

| Role | Main Responsibilities |
|------|------------------------|
| 👤 Tenant | Browse properties, request rentals, make payments, submit reviews |
| 🏠 Landlord | Manage properties and approve/reject rental requests |
| 👨‍💼 Admin | Manage users and monitor the platform |

---

# 🛠️ Tech Stack

### Backend

- **Node.js**
- **Express.js**
- **TypeScript**

### Database

- **PostgreSQL**
- **Prisma ORM**

### Authentication & Security

- **JWT**
- **bcrypt**
- Role-Based Authorization
- Protected Routes

### Payment

- **Stripe Checkout**
- Stripe Webhooks

### API Testing

- **Postman**

### Deployment

- **Vercel**

---

# 🏗️ Project Architecture

The project follows a modular backend architecture.

```text
Request
   │
   ▼
Route
   │
   ▼
Authentication / Authorization
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Prisma ORM
   │
   ▼
PostgreSQL
```

This architecture keeps business logic separated from routing and request handling, making the application easier to maintain and extend.

---

# 📂 Project Structure

```text
RentNest-Backend/
│
├── prisma/
│   ├── schema/
│   └── generated/
│
├── src/
│   │
│   ├── config/
│   │
│   ├── lib/
│   │
│   ├── middlewares/
│   │
│   ├── modules/
│   │   ├── auth/
│   │   ├── category/
│   │   ├── property/
│   │   ├── rentalRequest/
│   │   ├── landlord/
│   │   ├── payment/
│   │   ├── review/
│   │   └── admin/
│   │
│   ├── routes/
│   │
│   ├── utils/
│   │
│   └── app.ts
│
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

# 🔐 Authentication

RentNest uses JWT-based authentication.

Authentication flow:

```text
Register
   │
   ▼
Login
   │
   ▼
JWT Access Token
   │
   ▼
Protected Routes
```

Role-based authorization ensures that users can only access functionality permitted for their role.

For example:

```text
TENANT
   └── Tenant-specific APIs

LANDLORD
   └── Property & rental management APIs

ADMIN
   └── Administrative APIs
```

---

# 🗄️ Database

The application uses PostgreSQL with Prisma ORM.

Main entities include:

```text
User
Category
Property
RentalRequest
Payment
Review
```

### Main Relationships

```text
User
 ├── Properties
 ├── Rental Requests
 └── Reviews

Property
 ├── Category
 ├── Rental Requests
 └── Reviews

RentalRequest
 └── Payment
```

Prisma is used for:

- Database schema management
- Migrations
- Type-safe database queries
- Relationship handling
- Transaction management

---

# 📡 API Modules

The backend is organized into separate API modules.

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh-token
```

---

## Properties

Public property APIs and landlord property-management APIs are provided through the property and landlord modules.

Features include:

```text
Create
Read
Update
Delete
Search
Filter
Sort
Pagination
```

---

## Rental Requests

The rental request module handles the tenant-to-landlord rental workflow.

```text
Create Rental Request
View Rental Requests
Update Rental Request Status
```

Supported statuses include:

```text
PENDING
APPROVED
REJECTED
ACTIVE
```

---

## Payments

```text
POST /api/payments/create
POST /api/payments/confirm
GET  /api/payments
GET  /api/payments/:id
```

### Important

`/api/payments/confirm` is a **Stripe Webhook endpoint**.

It is automatically triggered by Stripe after successful checkout and is not intended for normal manual Postman testing.

---

## Reviews

The Review module provides APIs for creating and retrieving property reviews.

Reviews are associated with:

```text
Tenant
   │
   ▼
Property
```

---

## Admin

The Admin module provides administrative operations such as:

```text
User Management
Property Monitoring
Rental Request Monitoring
Dashboard Statistics
User Status Management
```

---

# ⚙️ Environment Variables

Create a `.env` file in the project root.

Example:

```env
PORT=5000

DATABASE_URL=

APP_URL=
CLIENT_URL=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

JWT_ACCESS_EXPIRES_IN=
JWT_REFRESH_EXPIRES_IN=

BCRYPT_SALT_ROUNDS=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```
The project includes `.env.example` for reference.

---

# 💻 Installation & Setup

## 1. Clone the repository

```bash
git clone https://github.com/Tanzeem74/RentNest-Backend.git
```

## 2. Navigate to the project

```bash
cd RentNest-Backend
```

## 3. Install dependencies

```bash
npm install
```

## 4. Configure environment variables

Create:

```text
.env
```

and add the required configuration values.

## 5. Generate Prisma Client

```bash
npx prisma generate
```

## 6. Run database migration

```bash
npx prisma migrate dev
```

## 7. Start development server

```bash
npm run dev
```

The local server will run on:

```text
http://localhost:5000
```

---

# 📜 Available Scripts

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

### Prisma Generate

```bash
npx prisma generate
```

### Prisma Migration

```bash
npx prisma migrate dev
```

### Prisma Studio

```bash
npx prisma studio
```

### Stripe Local Webhook

```bash
stripe listen --forward-to localhost:5000/api/payments/confirm
```

---

# 📮 Postman Testing

The API has been tested using Postman.

A Postman Collection can be included with the project for API testing.

### Production Base URL

```text
https://rent-nest-backend-beryl.vercel.app/api
```

### Recommended Testing Order

```text
1. Register
      ↓
2. Login
      ↓
3. Create/View Categories
      ↓
4. Create Property
      ↓
5. View Properties
      ↓
6. Create Rental Request
      ↓
7. Landlord Approves Request
      ↓
8. Create Payment
      ↓
9. Complete Stripe Payment
      ↓
10. Stripe Webhook
      ↓
11. Payment COMPLETED
      ↓
12. Rental ACTIVE
      ↓
13. Property RENTED
      ↓
14. Create Review
      ↓
15. Admin APIs
```

---

# 🌐 Deployment

The backend is deployed on **Vercel**.

### Live API

```text
https://rent-nest-backend-beryl.vercel.app
```

### API Base URL

```text
https://rent-nest-backend-beryl.vercel.app/api
```

### Stripe Production Webhook

```text
https://rent-nest-backend-beryl.vercel.app/api/payments/confirm
```

Production environment variables are configured through Vercel Environment Variables.

---

# 🔒 Security Considerations

The project implements several security practices:

- JWT authentication
- Role-based authorization
- Password hashing with bcrypt
- Protected routes
- HTTP-only authentication cookies where applicable
- Environment-based secret management
- Stripe webhook verification
- Database transactions for critical payment updates
- Input validation
- Centralized error handling

---

# 📈 Future Improvements

Possible future improvements include:

- Complete frontend application
- Admin dashboard UI
- Email notifications
- OTP verification
- Forgot password functionality
- Cloud image storage
- Wishlist
- Real-time notifications
- Chat functionality
- Booking history
- Property recommendation system
- Automated testing
- Swagger/OpenAPI documentation
- Docker support
- CI/CD pipeline

---

# 🎯 Project Highlights

```text
✅ Modular Architecture
✅ RESTful API
✅ TypeScript
✅ Express.js
✅ PostgreSQL
✅ Prisma ORM
✅ JWT Authentication
✅ Role-Based Authorization
✅ Property Management
✅ Rental Request Management
✅ Stripe Checkout
✅ Stripe Webhook
✅ Payment Transaction Handling
✅ Review System
✅ Admin Module
✅ Dashboard Statistics
✅ Search & Filtering
✅ Pagination
✅ Global Error Handling
✅ Vercel Deployment
```

---

# 👨‍💻 Author

## Shah Tanzeem Afsar

Computer Science & Engineering Student  
Backend Developer | AI/ML Enthusiast

### GitHub

https://github.com/Tanzeem74

### Repository

https://github.com/Tanzeem74/RentNest-Backend

---

# ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

<div align="center">

## 🏠 RentNest Backend

**A Property Rental Management REST API**

Built with ❤️ using

**Node.js • Express.js • TypeScript • PostgreSQL • Prisma • Stripe**

### 🚀 Live API

https://rent-nest-backend-beryl.vercel.app

---

**© 2026 Shah Tanzeem Afsar**

</div>
