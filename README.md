# LinkUp

A full-stack language exchange platform that connects language learners worldwide. Find language partners, chat in real-time, and practice together through video calls.

![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb)
![Stream](https://img.shields.io/badge/Stream-Chat%20%26%20Video-005FFF?logo=stream)

## Features

- **Authentication** - Secure signup/login with JWT & HTTP-only cookies
- **User Profiles** - Complete onboarding with language preferences, bio, and profile picture
- **Friend System** - Discover language partners, send/accept friend requests
- **Notifications** - Real-time notification system for friend requests and updates
- **Real-time Chat** - 1-on-1 messaging powered by Stream Chat
- **Video Calls** - Video calling with Stream Video SDK
- **Theming** - 31+ themes with DaisyUI

## Tech Stack

### Frontend
- React 19 with Vite
- React Router v7
- TanStack Query (React Query)
- Zustand for state management
- Stream Chat React SDK
- Stream Video React SDK
- Tailwind CSS + DaisyUI

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- bcryptjs for password hashing
- Stream Chat SDK

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB database
- [Stream](https://getstream.io) account (free tier available)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/SOHAM2022/LinkUp.git
   cd LinkUp
   ```

2. Install dependencies
   ```bash
   npm run build
   ```
   Or install separately:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. Set up environment variables

   Create `backend/.env`:
   ```env
   PORT=5001
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET_KEY=your_jwt_secret
   NODE_ENV=development
   STREAM_API_KEY=your_stream_api_key
   STREAM_API_SECRET=your_stream_api_secret
   ```

   Create `frontend/.env`:
   ```env
   VITE_STREAM_API_KEY=your_stream_api_key
   ```

4. Run the development servers

   Backend:
   ```bash
   cd backend && npm run dev
   ```

   Frontend:
   ```bash
   cd frontend && npm run dev
   ```

5. Open `http://localhost:5173` in your browser

## Project Structure

```
LinkUp/
├── backend/
│   └── src/
│       ├── controllers/    # Route handlers
│       ├── models/         # Mongoose schemas
│       ├── routes/         # API routes
│       ├── middleware/     # Auth middleware
│       ├── lib/            # DB & Stream config
│       └── server.js       # Entry point
│
├── frontend/
│   └── src/
│       ├── pages/          # Page components
│       ├── components/     # Reusable components
│       ├── hooks/          # Custom React hooks
│       ├── lib/            # API & utilities
│       ├── store/          # Zustand stores
│       └── constants/      # App constants
│
└── package.json            # Monorepo scripts
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | User registration |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| POST | `/api/auth/onboarding` | Complete profile |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/users/` | Get recommended users |
| GET | `/api/users/friends` | Get user's friends |
| POST | `/api/users/friend-request/:id` | Send friend request |
| PUT | `/api/users/friend-request/:id/accept` | Accept request |
| GET | `/api/chat/token` | Get Stream token |
| GET | `/api/notifications/` | Get notifications |

## Deployment

The app is configured for deployment with:
```bash
npm run build    # Installs deps & builds frontend
npm run start    # Starts backend server
```

In production, the backend serves the frontend static files.

## License

ISC License

## Acknowledgments

- [Stream](https://getstream.io) for real-time chat and video infrastructure
- [DaisyUI](https://daisyui.com) for UI components
- [ui-avatars.com](https://ui-avatars.com) for avatar generation
