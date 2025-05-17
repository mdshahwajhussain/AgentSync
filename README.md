# Agent Management System

A comprehensive MERN stack application for managing agents and distributing lists.

## Features

- Admin user authentication with JWT
- Agent creation and management
- CSV/Excel file upload and validation
- Automated distribution of list items among agents
- Dashboard with statistics
- Responsive design for all devices

## Tech Stack

- **Frontend:** React, TailwindCSS, Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Authentication:** JWT

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

## Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/agent-management-system.git
cd agent-management-system
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/agent-management
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

1. Start the development server

```bash
npm run start
```

This will start both the backend server and the frontend development server concurrently.

- Frontend will run on: http://localhost:5173
- Backend will run on: http://localhost:5000

## Project Structure

```
├── server/             # Backend code
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── uploads/        # Uploaded files (temporary)
│   └── server.js       # Main server file
├── src/                # Frontend code
│   ├── components/     # Reusable UI components
│   ├── context/        # Context providers
│   ├── pages/          # Page components
│   ├── services/       # API service functions
│   ├── App.tsx         # Main App component
│   └── main.tsx        # Entry point
└── .env                # Environment variables
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify token

### Agents

- `GET /api/agents` - Get all agents
- `GET /api/agents/:id` - Get agent by ID
- `POST /api/agents` - Create new agent
- `PUT /api/agents/:id` - Update agent
- `DELETE /api/agents/:id` - Delete agent
- `GET /api/agents/count` - Get agent count

### Lists

- `POST /api/lists/upload` - Upload and distribute list
- `GET /api/lists/agent/:agentId` - Get list items for an agent

### Distributions

- `GET /api/distributions` - Get all distributions
- `GET /api/distributions/:id` - Get distribution by ID
- `GET /api/distributions/:id/details` - Get distribution details with items

### Dashboard

- `GET /api/dashboard/stats` - Get dashboard statistics

## Default Admin User

To create an initial admin user, you'll need to manually add a user to the database or implement a seed script.

Example user:
- Email: admin@example.com
- Password: password123

## License

[MIT](LICENSE)