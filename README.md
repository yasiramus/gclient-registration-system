# 🧠 G-client Backend

This is the backend service for **G-client**, a student management platform built with scalability, security, and maintainability in mind. It powers core features such as learner registration, invoicing, and payment processing.

---

## ✅ What Our Backend Handles

- 🔐 **Authentication & Authorization**

  - Super Admin can create other Admins.
  - Login and protected routes using JWT stored in secure HttpOnly cookies.
  - Admin middleware to restrict access to critical endpoints.

- 👨‍🎓 **Learner Management**

  <!-- - Register learners with assigned track and course. -->

  - Filter learners by track, course, or payment status.
  - Only enroll learners after successful payment.

- 💳 **Invoice System**

  - Create invoice per learner (supports multiple invoices).
  - Track invoice statuses: `PENDING`, `PARTIAL`, and `PAID`.
  - Enforce payment logic: system filters by _latest_ invoice status.

- 🧮 **Track and Course Management**

  - CRUD operations for Tracks and Courses.
  - Tracks contain Courses (one-to-many).

- 💰 **Paystack Payment Integration**

  - Initiate transaction
  - Redirect learner to Paystack authorization URL.
  - Verify payment via webhook and update invoice accordingly.
  - Payment references are matched with learner invoices.

- 🧪 **Robust Validation & Testing**
  - Validates request payloads using Zod.
  - Includes automated test cases for critical endpoints.

---

## 🛠 Tech Stack Justification

| Tool/Library       | Why We Chose It                                                          |
| ------------------ | ------------------------------------------------------------------------ |
| **Node.js**        | High concurrency, efficient for APIs.                                    |
| **Express.js**     | Lightweight, unopinionated framework for routing.                        |
| **PostgreSQL**     | Stable, relational DB with strong integrity guarantees.                  |
| **Prisma ORM**     | Type-safe, auto-completion in TypeScript, schema migrations.             |
| **Zod**            | Elegant runtime schema validation that works seamlessly with TypeScript. |
| **JWT + Cookie**   | Secure, session-based authentication.                                    |
| **Paystack**       | Trusted and developer-friendly payment solution for Africa.              |
| **Jest/Supertest** | Powerful testing combo for unit and integration testing.                 |

---

## 📁 Folder Structure

```bash
├── prisma/               # Prisma schema and migrations (outside /src)
│   └── schema.prisma
│
├── public/               # Public assets (e.g., docs, uploads)
│
├── src/
│   ├── db/               # App & DB configuration
│   ├── controllers/      # Request/response handling logic
│   ├── middlewares/      # Route guards, error handling, validation
│   ├── models/           # Prisma-generated types and enums
│   ├── routes/           # Express route definitions
│   ├── services/         # Business logic and helpers
│   ├── utils/            # Utility functions (e.g., paystack, response wrappers)
│   ├── validations/      # Zod schemas for input validation
│   └── index.ts          # Entry point
│
├── tests/                # Test cases (unit & integration)
│   └── auth.test.ts
│   └── learner.test.ts
│   └── invoice.test.ts
│
├── .env                  # Environment variables
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/g-client-backend.git
cd g-client-backend
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env` file:

```env
DATABASE_URL=postgresql://your-db-url
JWT_SECRET=yourSecret
PAYSTACK_SECRET_KEY=yourPaystackKey
FRONTEND_URL=http://localhost:3000
COOKIE_SECRET=anotherSecret
```

### 4. Run Migrations and Seed Database

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 5. Start the Development Server

```bash
pnpm run dev
```

Runs on `http://localhost:5000`

---

## 🧪 API Testing

- Base URL: `http://localhost:5000/api`
- Import the Postman collection:
  [`G-client.postman_collection.json`](./public/G-client.postman_collection.json)

🔐 **Authentication Required:** Use Bearer tokens or login cookie.

---

## 🔁 Simulating Paystack Webhooks

1. Use your local or deployed webhook URL:

   ```
   POST /api/paystack/webhook
   ```

2. Example Payload:

```json
{
  "event": "charge.success",
  "data": {
    "reference": "ref_abc123",
    "status": "success",
    "amount": 100000,
    "customer": {
      "email": "adams@gmail.com"
    }
  }
}
```

3. Set Headers in Postman:

- `x-paystack-signature`: (mocked or real if verifying)
- `Content-Type`: `application/json`

---

## 🧪 Test Suite

- Framework: `Jest` + `Supertest`
- Run Tests:

```bash
pnpm run test
```

- Coverage reports available via `pnpm run test:coverage`.

---

## 📜 License

MIT © G-client Team 2025

---

## 📞 Contact & Support

For technical assistance or contributions, raise a GitHub issue or contact the backend team.
