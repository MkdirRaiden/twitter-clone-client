# 🐦 X-CLONE – Twitter-Inspired Social Platform (Frontend)

> A full-featured frontend for a Twitter-like social platform, built with React, Vite, Tailwind, and React Query. This project showcases my ability to architect and build a scalable, performant, and user-friendly application using modern frontend technologies.

---

## 🚀 Features

- 🔐 **Authentication** – Secure login, registration, and profile update
- 🔍 **Live User Search** – Instant search with debounced input and result rendering
- 🧑‍🤝‍🧑 **Follow System** – Follow/unfollow users with real-time updates
- 📝 **Post Interaction** – Like, comment, and view posts
- 🔔 **Notifications System**
  - Real-time-like feedback for likes, follows, and comments
  - Badge counter for unread notifications
  - Delete individual or all notifications
- 🧭 **Routing** – Page-based routing with `react-router-dom`
- ⚙️ **State Management** – Managed with `@tanstack/react-query` + Context
- 💬 **Toasts and Feedback** – Clean UX with `react-hot-toast`
- 📱 **Responsive Design** – Mobile-friendly and adaptive UI
- 🌙 **Dark Mode Compatible** (via DaisyUI)

## 🛠️ Tech Stack

| Tech                | Description                             |
| ------------------- | --------------------------------------- |
| **React 18**        | UI framework                            |
| **Vite**            | Lightning-fast dev/build tool           |
| **Tailwind CSS**    | Utility-first styling                   |
| **DaisyUI**         | Tailwind-based UI component library     |
| **React Router**    | Declarative routing                     |
| **Axios**           | API client with custom instance wrapper |
| **React Query**     | Server state and caching                |
| **Moment.js**       | Human-readable time formatting          |
| **React Icons**     | Icon library                            |
| **React Hot Toast** | Toast-based notifications               |

---

## 📦 Getting Started

### Prerequisites

- Node.js v18+
- Backend server running on `https://twitter-clone-backend-f6w8.onrender.com`

### 1. Clone the Repository

```bash
git clone https://github.com/MkdirRaiden/twitter-clone-client.git
cd twitter-clone-client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

> Visit: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Scripts

| Command           | Action                        |
| ----------------- | ----------------------------- |
| `npm run dev`     | Start local dev server (Vite) |
| `npm run build`   | Build for production          |
| `npm run preview` | Preview production build      |
| `npm run lint`    | Lint the code using ESLint    |

---

## 🔀 API Proxy Setup (Vite)

Your frontend is configured to proxy `/api` requests to the backend:

```js
// vite.config.js
server: {
  proxy: {
    '/api': 'https://twitter-clone-backend-f6w8.onrender.com'
  }
}
```

Make sure your backend routes are prefixed with `/api`.

---

## 🌿 Project Structure (Simplified)

```
frontend/
├── src/
│   ├── lib/api/               # Axios instance and helpers
│   ├── components/        # Shared and page-specific components
│   ├── hooks/             # Custom hooks (auth, queries, etc.)
│   ├── pages/             # Top-level route components
│   ├── utils/             # Constants, config, validation
│   ├── App.jsx            # App routing
│   └── main.jsx           # App entry point
├── public/
├── vite.config.js
└── tailwind.config.js
```

---

## 🧠 Key Architecture Highlights

- **Modular component system** — Clean separation of reusable logic
- **Custom Axios wrapper** — Centralized error handling, base URL, credentials
- **Query caching** — via `react-query` for optimized performance
- **Protected routes** — Route protection using context and middleware
- **Responsive layout** — Fluid grid for all screen sizes

---

## 🌍 Live Demo

https://twitter-clone-client-gray.vercel.app/

---

## 📇 Contact

**Author:** Muktadir Ahmed  
**Email:** 1996raiden27@gmail.com
**LinkedIn:** [https://portfolio-f53034xru-ahmeds-projects-15889820.vercel.app/](www.linkedin.com/in/muktadir-ahmed-arsalan)  
**Portfolio:** [https://portfolio-f53034xru-ahmeds-projects-15889820.vercel.app/](https://portfolio-f53034xru-ahmeds-projects-15889820.vercel.app/)

---

## 📃 License

MIT License  
© 2025 Ahmed
