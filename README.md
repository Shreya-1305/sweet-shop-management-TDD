# 🍬 MithaiMart - Taste the Sweetness of Tradition

Welcome to **MithaiMart**, a full-stack **Sweet Shop Management System** built using **Test-Driven Development (TDD)**.  
This project was developed as part of a **Kata assigned by Incubyte** to demonstrate skills in **API development, database management, frontend implementation, testing, and clean coding practices**.

---

## 🎯 Objective

The goal of this project was to design, build, and test a **MERN-based sweet shop system** with proper **TDD methodology** (Red → Green → Refactor).  
It includes:

- 🛠️ Backend API with authentication & inventory management
- 🎨 Modern frontend with React + Tailwind CSS
- ✅ Full test coverage using Jest & Supertest
- 🔒 Secure role-based access (User vs. Admin)

---

## 📸 Working Video

[[Watch the demo video]((https://youtu.be/URyRFRPyKxo)]

## 📸 Screenshots

### 🏠 Landing Page

![Landing Page](https://github.com/Shreya-1305/sweet-shop-management-TDD/blob/main/Snapshots/FrontendUI/Landing%20Page.png)

### 🔑 Signup / Login Form

![Signup Login Form](https://github.com/Shreya-1305/sweet-shop-management-TDD/blob/main/Snapshots/FrontendUI/Signup%20Login%20Form.png)

### 👩‍💼 Admin Dashboard

![Admin Dashboard](https://github.com/Shreya-1305/sweet-shop-management-TDD/blob/main/Snapshots/FrontendUI/Admin%20Dashboard.png)

### 🛒 Purchase Page

![Purchase Page](https://github.com/Shreya-1305/sweet-shop-management-TDD/blob/main/Snapshots/FrontendUI/Purchase%20page.png)

### 📦 Restock Sweet

![Restock Modal](https://github.com/Shreya-1305/sweet-shop-management-TDD/blob/main/Snapshots/FrontendUI/Restock%20Modal.png)

---

## Deployed Project

You can view the live project here: [Sweet Shop Management](https://sweet-shop-management-tdd-k9hz.vercel.app/)

## Testing Credentials

Admin Credentials:

email: shreya@example.com
password: password123


User Credentials: test@example.com
password: password123



## 📁 Project Structure

```
mithaimart/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── tests/
│   ├── utils/
│   ├── app.js
│   ├── server.js
│   ├── .env.example           # Example env vars for backend
│   ├── config.env
│   ├── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── .env.example           # Example env vars for frontend
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── package.json
│
├── Snapshots/
├── package.json
└── README.md
```

---

## ⚙️ Setup Instructions

### 🧑‍💻 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Runs at: `http://localhost:5173`

---

### 🛠️ Backend Setup

```bash
cd backend
npm install
npm start
```

Runs at: `http://localhost:5000`

👉 Create a `config.env` file in `/backend`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=your_port
```

---

### 🧪 Run Tests

```bash
cd backend
npm test
```

- Frameworks: **Jest + Supertest**
- Coverage: **100% of critical API flows**

---

## ✅ Test Results

| 📄 Test File                    | 🧪 Description                                    | ✅ Passed |
| ------------------------------- | ------------------------------------------------- | --------- |
| `searchSweets.test.js`          | Search sweets by name, category, price range      | 8/8       |
| `auth.integration.test.js`      | Register/Login integration flow                   | 2/2       |
| `inventory.integration.test.js` | Restock & purchase inventory                      | 5/5       |
| `restockSweet.test.js`          | Restocking edge cases (Admin only)                | 7/7       |
| `sweet.integration.test.js`     | Add, update, delete sweets (Admin vs. User roles) | 6/6       |
| `addSweet.test.js`              | Validate & add sweets                             | 9/9       |
| `login.test.js`                 | Login validation cases                            | 5/5       |
| `updateSweet.test.js`           | Updating sweets with validation errors            | 8/8       |
| `purchaseSweet.test.js`         | Purchase flow & errors                            | 8/8       |
| `viewAllSweets.test.js`         | Fetch all sweets                                  | 5/5       |
| `register.test.js`              | Register new users with edge cases                | 3/3       |
| `deleteSweet.test.js`           | Delete sweet with error handling                  | 6/6       |

**🔬 Summary**

- **Test Suites:** 12/12 passed
- **Total Tests:** 75/75 passed
- **Execution Time:** 14.088s

---

## 📡 API Documentation

### 🔑 Authentication

| Endpoint             | Method | Description               |
| -------------------- | ------ | ------------------------- |
| `/api/auth/register` | POST   | Register a new user       |
| `/api/auth/login`    | POST   | Login user & return token |

---

### 🍬 Sweets

| Endpoint             | Method | Access     | Description                          |
| -------------------- | ------ | ---------- | ------------------------------------ |
| `/api/sweets`        | POST   | Admin      | Add a new sweet                      |
| `/api/sweets`        | GET    | User/Admin | Get all sweets                       |
| `/api/sweets/search` | GET    | User/Admin | Search sweets by name/category/price |
| `/api/sweets/:id`    | PUT    | Admin      | Update sweet details                 |
| `/api/sweets/:id`    | DELETE | Admin      | Delete sweet                         |

---

### 📦 Inventory

| Endpoint                   | Method | Access     | Description      |
| -------------------------- | ------ | ---------- | ---------------- |
| `/api/sweets/:id/purchase` | POST   | User/Admin | Purchase a sweet |
| `/api/sweets/:id/restock`  | POST   | Admin      | Restock sweets   |

---

## 💻 Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose ODM)
- **Testing:** Jest, Supertest
- **Auth:** JWT (Role-based access)

---

## 🤖 My AI Usage

This project was **augmented with AI tools** to improve efficiency:

- **ChatGPT** →  Assisted in backend routes, brainstorming test case edge scenarios and error handling.
- **Claude** → Assisted in frontend logic and CSS styling ideas.

**Reflection:** AI tools significantly improved my productivity by handling boilerplate and suggesting alternative test cases, allowing me to focus on **business logic, debugging, and system design**.

---

## 🙏 Acknowledgements

Special thanks to **Incubyte** for this challenging and insightful task.  
It pushed me to apply **TDD, clean code practices, and modern AI-assisted workflows** to build a production-grade system.

---

## 👩‍💻 Developed By

Made with ❤️ and 🍬 by **Shreya Painter**
