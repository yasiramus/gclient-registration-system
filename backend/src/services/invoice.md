Invoice Management Features (Week 3)
Create Invoice for Learner

Get All Invoices

Get Invoices per Learner

Enforce Full/Partial Payment Logic

## Prisma Models

### Learner

Each learner is associated with:

* One **Track** (`trackId`)
* One **Course** (`courseId`)
* A `paymentStatus` that reflects FULL, PARTIAL, or NONE.
* A one-to-many relation with **Invoices**.

### Invoice

Each invoice:

* Belongs to a **Learner** via `learnerId`
* Has:

  * `amountPaid`
  * `dueAmount`
  * `status` (FULL, PARTIAL, NONE)

---

## what needed to build currently

### 1. **Create Invoice**

* Input: `learnerId`, `amountPaid`
* ⚙ Logic:

  * Fetch total price from the learner’s track
  * Calculate `dueAmount = track.price - amountPaid`
  * Set status:

    * FULL → `dueAmount === 0`
    * PARTIAL → `dueAmount > 0`
    * NONE → `amountPaid === 0`
  * Update `Learner.paymentStatus` based on invoice status
  * Store invoice in DB

### 2. **Get All Invoices**

* With optional filters: learnerId, status, etc.

### 3. **Get Single Invoice by ID**

### 4. **Delete Invoice hard delete|| (Soft Delete - Optional) going with hard delete**

---

## Design Principle Reminder:

* **DRY**: Reuse logic (helper functions for calculations)
* **KISS**: Keep the logic straightforward
* **SOLID**: Separate responsibilities (e.g., don’t embed DB logic inside controllers)
* **Zod**: Input validation
* **Secure**: Only allow admins to create or update invoices

---

Perfect. Let's proceed step-by-step.

---

## Feature: **Create Invoice for Learner**

---

### 🧠 Goal:

When an admin inputs a `learnerId` and `amountPaid`, backend should:

1. Fetch the learner and their track (to get track price)
2. Compute `dueAmount = track.price - amountPaid`
3. Determine payment status:

   * `FULL`: `dueAmount === 0`
   * `PARTIAL`: `dueAmount > 0`
4. Create an invoice
5. Update the learner's `paymentStatus` to match

---

### 🛠 Tech Stack Context

* **PostgreSQL**: Data source
* **Prisma**: ORM to fetch learner + track, create invoice
* **Express + TypeScript**: API endpoint
* **Zod**:Added Input validation


### Summary:

This setup ensures:

* Proper validation with Zod
* Centralized business logic in the service
* Learner's payment status is always in sync with invoice data
* Protected access (admin-only)

---