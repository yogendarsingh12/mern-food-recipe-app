# 🍲 RecipeRealm — Full-Stack MERN Food Recipe Platform & Admin Studio

<div align="center">

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green.svg?style=for-the-badge)
![React 18](https://img.shields.io/badge/Frontend-React%2018%20(Vite)-blue.svg?style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC.svg?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933.svg?style=for-the-badge)
![MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248.svg?style=for-the-badge)
![Cloudinary](https://img.shields.io/badge/Media-Cloudinary%20Storage-3448C5.svg?style=for-the-badge)
![JWT Auth](https://img.shields.io/badge/Security-JWT%20%2B%20Bcrypt-red.svg?style=for-the-badge)

<p align="center">
  <strong>A modern, responsive, full-stack food recipe sharing ecosystem featuring a public Client Web App, a dedicated Admin Studio, and a high-performance Express & MongoDB backend with Cloudinary media integration.</strong>
</p>

</div>

---

## 📑 Table of Contents

- [🏛️ Architecture Overview](#-architecture-overview)
- [✨ Key Features](#-key-features)
  - [🍽️ Client Web Application](#️-client-web-application)
  - [👑 Dedicated Admin Studio](#-dedicated-admin-studio)
  - [⚡ Backend REST API](#-backend-rest-api)
- [🔑 Default Admin Credentials](#-default-admin-credentials)
- [📂 Project Structure](#-project-structure)
- [🚀 Quick Start (Local Setup)](#-quick-start-local-setup)
- [⚙️ Environment Variables](#️-environment-variables)
- [📡 API Documentation](#-api-documentation)
- [🥘 20 Pre-Populated Initial Recipes](#-20-pre-populated-initial-recipes)
- [🌐 Production Deployment Guide](#-production-deployment-guide)

---

## 🏛️ Architecture Overview

```
                            ┌─────────────────────────────────────────┐
                            │            Cloudinary CDN               │
                            │      (Direct Media Storage)             │
                            └────────────────────▲────────────────────┘
                                                 │
                                                 │ Image Stream (Multer)
                                                 │
┌───────────────────────────┐       ┌────────────┴────────────┐       ┌───────────────────────────┐
│     Client Frontend       │       │    Node / Express API   │       │       Admin Studio        │
│   React (Vite) + Tailwind ├──────►│   REST API + JWT Auth   │◄──────┤   React (Vite) + Tailwind │
│      (Port 5173)          │       │       (Port 5000)       │       │      (Port 5174)          │
└───────────────────────────┘       └────────────┬────────────┘       └───────────────────────────┘
                                                 │
                                                 │ Mongoose ORM
                                                 │
                            ┌────────────────────▼────────────────────┐
                            │          MongoDB Atlas Cluster          │
                            │    (Recipes, Users, Auth Records)       │
                            └─────────────────────────────────────────┘
```

---

## ✨ Key Features

### 🍽️ Client Web Application (`frontend/` on Port 5173)
- **20 Global Culinary Recipes**: Pre-loaded with diverse international dishes (Italian, Indian, Mexican, Japanese, Thai, etc.).
- **Live Search & Category Filtering**: Instant filtering across recipe titles, ingredients, and categories.
- **Interactive Recipe Detail Modal**: High-res images, step-by-step instructions, and clickable ingredient checklist.
- **Full User CRUD Operations**:
  - **Create**: Add recipes with instant cover photo preview and Cloudinary streaming.
  - **Read ("My Recipes")**: Dedicated personal cookbook displaying only user-created recipes with live counts.
  - **Update**: Edit recipe titles, descriptions, ingredient chips, cooking steps, and replace cover photos.
  - **Delete**: Safely delete personal recipes with confirmation prompts.
- **JWT User Authentication**: Popup Sign In & Registration with automatic token storage.

### 👑 Dedicated Admin Studio (`admin/` on Port 5174)
- **Live Metric Analytics**: Real-time counters for Total Recipes, Registered Chefs, Active Admins, and Global Ingredients.
- **Recipe Moderation Table**: Search, preview, edit, or delete any recipe on the platform.
- **User Role Administration**: View all registered chefs, toggle roles (`user` ↔ `admin`), and delete abusive accounts.
- **System Health Diagnostics**: Live operational checks for MongoDB Atlas, Cloudinary media storage, and Express API.
- **Dedicated Admin Login**: Pre-configured with default credentials and 1-click autofill.

### ⚡ Backend REST API (`backend/` on Port 5000)
- **Multer + Cloudinary Pipeline**: Automatically resizes (1200x800 max) and streams uploaded images to Cloudinary's `recipes` folder.
- **Role-Based Access Control (RBAC)**: Secure middlewares (`protect` and `adminOnly`).
- **Auto-Seeding Engine**: Seeds the default Admin and 20 rich recipes automatically on database connection.
- **Zero-Crash CORS & Error Handler**: Handles token expiration, file size limits (5MB), and database errors gracefully.

---

## 🔑 Default Admin Credentials

When the backend starts, it automatically ensures the default Admin account exists:

| Field | Default Value |
|---|---|
| **Admin Email** | `iamadmin123@gmail.com` |
| **Admin Password** | `admin234` |
| **Role** | `admin` |
| **Admin Studio URL** | `http://localhost:5174` |

---

## 📂 Project Structure

```
FoodRecipe App/
├── backend/                         # Express.js REST API Server
│   ├── config/
│   │   ├── db.js                    # MongoDB connection & auto-seeder triggers
│   │   ├── cloudinary.js            # Cloudinary SDK configuration
│   │   ├── seedAdmin.js             # Default Admin auto-seeder
│   │   └── seedRecipes.js           # 20 Initial recipes seeder
│   ├── controllers/
│   │   ├── authController.js        # Register, Login, Profile endpoints
│   │   ├── recipeController.js      # Public & User Recipe CRUD
│   │   └── adminController.js       # Admin Stats, Recipe & User moderation
│   ├── middlewares/
│   │   ├── authMiddleware.js        # JWT protect & adminOnly guards
│   │   └── uploadMiddleware.js      # Multer + Cloudinary direct upload
│   ├── models/
│   │   ├── Recipe.js                # Recipe Mongoose schema
│   │   └── User.js                  # User Mongoose schema with Bcrypt hashing
│   ├── routes/
│   │   ├── authRoutes.js            # /api/auth
│   │   ├── recipeRoutes.js          # /api/recipes
│   │   └── adminRoutes.js           # /api/admin
│   ├── seed.js                      # Standalone CLI seeder script
│   ├── server.js                    # Server entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/                        # Client Web Application (Port 5173)
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthModal.jsx        # Sign In & Registration popup
│   │   │   ├── EditRecipeModal.jsx  # User recipe editing modal
│   │   │   ├── HeroSection.jsx      # Hero banner with search & tags
│   │   │   ├── Navbar.jsx           # Client top navigation header
│   │   │   ├── RecipeCard.jsx       # Recipe card with owner controls
│   │   │   └── RecipeModal.jsx      # Detailed recipe viewer
│   │   ├── pages/
│   │   │   ├── AddRecipe.jsx        # Form with live preview & FormData upload
│   │   │   ├── Home.jsx             # Public recipe feed with search
│   │   │   └── MyRecipes.jsx        # Personal cookbook (User CRUD)
│   │   ├── services/
│   │   │   └── api.js               # Axios API client with token interceptor
│   │   ├── App.jsx                  # Main SPA controller
│   │   └── main.jsx
│   ├── index.html                   # Inline Tailwind CDN configuration
│   ├── package.json
│   └── vite.config.js               # Runs on port 5173
│
└── admin/                           # Dedicated Admin Studio (Port 5174)
    ├── src/
    │   ├── components/
    │   │   ├── AdminEditModal.jsx   # Admin recipe editor modal
    │   │   ├── AdminNavbar.jsx      # Admin Studio top header
    │   │   ├── AdminSidebar.jsx     # Navigation tabs
    │   │   └── RecipePreviewModal.jsx
    │   ├── pages/
    │   │   ├── AdminLogin.jsx       # Admin login screen (prefilled credentials)
    │   │   ├── Dashboard.jsx        # Analytics overview & recent activity
    │   │   ├── RecipeManager.jsx    # Complete recipe moderation table
    │   │   ├── UserManager.jsx      # Chef & user role management table
    │   │   └── SystemStatus.jsx     # Server, DB, & Cloudinary health check
    │   ├── services/
    │   │   └── api.js               # Admin API client
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html                   # Inline Tailwind CDN configuration
    ├── package.json
    └── vite.config.js               # Runs on port 5174
```

---

## 🚀 Quick Start (Local Setup)

### 1. Start the Backend API (Port 5000)
```bash
cd backend
npm install
cp .env.example .env
```
Edit `backend/.env` with your credentials:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_atlas_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
JWT_SECRET=super_secret_jwt_key
```
Start the server:
```bash
npm run dev
```
*(Optional: Run `npm run seed` in `backend/` to force re-seed the 20 recipes at any time).*

---

### 2. Start the Client Web App (Port 5173)
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

### 3. Start the Admin Studio App (Port 5174)
```bash
cd admin
npm install
npm run dev
```
Open **`http://localhost:5174`** and click **"Access Admin Studio"** (prefilled with `iamadmin123@gmail.com` / `admin234`).

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Example |
|---|---|---|
| `PORT` | API Server Port | `5000` |
| `NODE_ENV` | Environment Mode | `development` / `production` |
| `MONGO_URI` | MongoDB Atlas Connection URI | `mongodb+srv://user:pass@cluster.mongodb.net/recipe_app` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | `your_api_secret` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `your_jwt_secret` |

### Frontend & Admin (`.env`)
| Variable | Description | Value |
|---|---|---|
| `VITE_API_URL` | Backend REST API Base URL | `http://localhost:5000/api` |

---

## 📡 API Documentation

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user / chef account |
| `POST` | `/api/auth/login` | Public | Authenticate user and receive JWT |
| `GET` | `/api/auth/me` | Protected | Fetch current logged-in user profile |

### Recipes (`/api/recipes`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/recipes` | Public | Fetch all recipes (sorted newest first) |
| `GET` | `/api/recipes/my/user` | Protected | Fetch recipes created by logged-in user |
| `GET` | `/api/recipes/:id` | Public | Fetch single recipe details |
| `POST` | `/api/recipes` | Protected | Create recipe with Cloudinary photo |
| `PUT` | `/api/recipes/:id` | Protected | Edit recipe (Owner only) |
| `DELETE` | `/api/recipes/:id` | Protected | Delete recipe (Owner only) |

### Admin Moderation (`/api/admin`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/stats` | Admin Only | Platform counts & analytics |
| `GET` | `/api/admin/recipes` | Admin Only | List all recipes with search |
| `PUT` | `/api/admin/recipes/:id` | Admin Only | Edit any recipe (supports image update) |
| `DELETE` | `/api/admin/recipes/:id` | Admin Only | Delete any recipe |
| `GET` | `/api/admin/users` | Admin Only | List all registered users & recipe counts |
| `PUT` | `/api/admin/users/:id/role` | Admin Only | Toggle user role (`user` ↔ `admin`) |
| `DELETE` | `/api/admin/users/:id` | Admin Only | Delete user and cascade purge recipes |
| `POST` | `/api/admin/claim-admin` | Protected | Self-claim admin privileges |

---

## 🥘 20 Pre-Populated Initial Recipes

1. **Creamy Tuscan Garlic Chicken** *(Italian)*
2. **Authentic Italian Margherita Pizza** *(Italian)*
3. **Classic Butter Chicken (Murgh Makhani)** *(Indian)*
4. **Juicy Gourmet Smash Burger** *(American)*
5. **Authentic Japanese Tonkotsu Ramen** *(Japanese)*
6. **Crispy Homemade Belgian Waffles** *(Breakfast/Dessert)*
7. **Fresh Mediterranean Greek Salad** *(Healthy/Salad)*
8. **Creamy Avocado Toast with Poached Egg** *(Breakfast)*
9. **Authentic Street-Style Mexican Tacos** *(Mexican)*
10. **Decadent Molten Chocolate Lava Cake** *(Dessert)*
11. **Creamy Garlic Butter Shrimp Pasta** *(Seafood)*
12. **Crispy Asian Chicken Dumplings (Gyoza)** *(Asian)*
13. **Superfood Quinoa & Roasted Veggie Buddha Bowl** *(Healthy/Vegan)*
14. **Creamy Classic Mushroom Risotto** *(Italian)*
15. **Spanish Seafood Paella Valenciana** *(Spanish)*
16. **Traditional Thai Green Curry with Chicken** *(Thai)*
17. **Fluffy Japanese Souffle Pancakes** *(Breakfast)*
18. **Smoky BBQ Pulled Pork Sandwich** *(American BBQ)*
19. **Silky Italian Tiramisu Cup** *(Dessert)*
20. **Loaded Tex-Mex Beef Enchiladas** *(Mexican)*

---

## 🌐 Production Deployment Guide

### 1. Deploying Backend to Render
1. Create a **New Web Service** connected to your repository.
2. Root Directory: `backend`
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. Add Environment Variables: `MONGO_URI`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `JWT_SECRET`, `NODE_ENV=production`.

### 2. Deploying Client Frontend to Vercel
1. Import your repository into Vercel.
2. Root Directory: `frontend`
3. Framework Preset: `Vite`
4. Environment Variable: `VITE_API_URL = https://your-backend-api.onrender.com/api`
5. Deploy.

### 3. Deploying Admin Studio to Vercel
1. Import your repository as a second project in Vercel.
2. Root Directory: `admin`
3. Framework Preset: `Vite`
4. Environment Variable: `VITE_API_URL = https://your-backend-api.onrender.com/api`
5. Deploy.

---

<div align="center">
  <sub>Built with ❤️ for culinary creators and food enthusiasts worldwide.</sub>
</div>
