# Satty's Food Distributor

A modern, premium e-commerce web application for Satty's - Gujarat's #1 Food Distributor, built with Next.js 15, React 19, and Supabase.

![Next.js](https://img.shields.io/badge/Next.js-15.5.7-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.0.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwind-css)

## ✨ Features

### 🛍️ Customer Features
- **Product Catalog** - Browse products by categories
- **Featured Products** - Highlighted premium products
- **Contact Page** - Multiple ways to connect (Phone, Email, WhatsApp, Social Media)
- **Responsive Design** - Works on all devices

### 🔐 Admin Panel (`/admin`)
- **Dashboard** - Overview of products, categories, and messages
- **Product Management** - Add, edit, delete products with Excel/CSV import
- **Category Management** - Organize products into collections
- **Contact Messages** - View customer inquiries
- **Shop Info** - Manage store settings

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (or Bun)
- npm or bun package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd orchids-orchid-satty-s-main
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   # or
   bun install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file with:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   JWT_SECRET=your_jwt_secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

5. **Open the app**
   - Website: [http://localhost:3000](http://localhost:3000)
   - Admin Panel: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

### Default Admin Credentials
```
Username: admin
Password: admin123
```

## 📁 Project Structure

```
src/
├── app/
│   ├── admin/           # Admin panel routes
│   │   ├── (dashboard)/ # Dashboard, Products, Categories, etc.
│   │   └── login/       # Admin login page
│   ├── api/             # API routes
│   │   ├── auth/        # Authentication endpoints
│   │   ├── products/    # Product CRUD
│   │   ├── categories/  # Category CRUD
│   │   ├── contacts/    # Contact messages
│   │   └── dashboard/   # Dashboard stats
│   ├── contact/         # Contact page
│   ├── products/        # Products page
│   └── page.tsx         # Homepage
├── components/          # Reusable UI components
└── lib/                 # Utilities and configurations
    ├── supabase.ts      # Supabase client
    ├── auth.ts          # Authentication helpers
    └── types.ts         # TypeScript types
```

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **React 19** | UI library |
| **TypeScript** | Type safety |
| **Tailwind CSS 4** | Styling |
| **Supabase** | PostgreSQL database & auth |
| **Framer Motion** | Animations |
| **Radix UI** | Accessible components |
| **Lucide React** | Icons |

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## 🗄️ Database Schema

### Tables
- `admin_users` - Admin authentication
- `products` - Product catalog
- `categories` - Product categories
- `contact_messages` - Customer inquiries

## 📱 Contact Information

- **Phone:** +91 8200892368
- **Email:** customersupport@sattys.in
- **Instagram:** [@sattys.in](https://instagram.com/sattys.in)
- **WhatsApp:** [Direct Chat](https://wa.me/918200892368)

## 📄 License

This project is proprietary software for Satty's Food Distributor.

---

Made with ❤️ for Satty's - Gujarat's #1 Food Distributor
