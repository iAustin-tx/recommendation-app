# RecommendMe — Recommendation Application

RecommendMe is a full-stack recommendation application that provides personalized recommendations based on user interactions such as views, clicks, likes, and saves.

The application includes user authentication, item discovery, activity tracking, personalized recommendations, and an admin dashboard for managing recommendation items.

## Live Application

Frontend:
https://recommendation-app-frontend-ijeb.onrender.com

Backend API:
https://recommendation-app-87ww.onrender.com

## Features

### User Authentication

- User registration
- User login and logout
- JWT authentication
- Password hashing
- Protected routes
- User and admin roles

### Item Discovery

Users can browse:

- Products
- Courses
- Content

The Explore page supports:

- Search
- Type filtering
- Item details
- Pricing
- Categories
- Tags

### User Activity

The application tracks interactions including:

- View
- Click
- Like
- Save

Users can also:

- Unlike items
- Unsave items
- View their activity history

Activities associated with deleted items are automatically cleaned up.

### Personalized Recommendations

RecommendMe generates recommendations using a weighted activity-based scoring system.

Activity weights:

| Activity | Weight |
| --- | ---: |
| View | 1 |
| Click | 2 |
| Save | 3 |
| Like | 4 |

The recommendation engine learns from categories, item types, and tags associated with a user's previous interactions.

Candidate items receive scores based on matching preferences:

- Category match: +3
- Type match: +1
- Tag match: +2

Items the user has already interacted with are excluded from recommendations.

If the user has no activity yet, the system returns recent active items as fallback recommendations.

## Admin Dashboard

Administrators can:

- Create items
- View items
- Edit items
- Delete items

Deleting an item also removes activity records associated with that item.

Public registration cannot be used to create an admin account.

## Technology Stack

### Frontend

- React
- Vite
- React Router
- Axios
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcrypt
- CORS
- dotenv

### Deployment

- Render
- MongoDB Atlas
- GitHub

## Project Structure

```text
Recommendation App/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── app.js
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
│
├── .gitignore
└── README.md
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/profile` | Get authenticated user's profile |

### Items

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/items` | Get items |
| GET | `/api/items/:id` | Get an item |
| POST | `/api/items` | Create an item (Admin) |
| PUT | `/api/items/:id` | Update an item (Admin) |
| DELETE | `/api/items/:id` | Delete an item (Admin) |

The item listing endpoint supports query parameters such as:

```text
?search=react
?type=course
?category=programming
?page=1
?limit=10
```

### Activities

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/activities` | Record an activity |
| GET | `/api/activities/me` | Get current user's activity |
| DELETE | `/api/activities` | Remove a like or save |

### Recommendations

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/recommendations` | Get personalized recommendations |

## Running the Project Locally

### Prerequisites

Install:

- Node.js
- npm
- MongoDB or MongoDB Atlas
- Git

### Clone the Repository

```bash
git clone https://github.com/iAustin-tx/recommendation-app.git
cd recommendation-app
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory.

Example:

```env
PORT=5002
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```

Do not commit the `.env` file or expose real credentials.

Start the backend:

```bash
npm run dev
```

The local backend runs at:

```text
http://localhost:5002
```

### Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend normally runs at:

```text
http://localhost:5173
```

The frontend API configuration supports:

```env
VITE_API_URL=http://localhost:5002/api
```

In production, `VITE_API_URL` points to the deployed backend API.

## Authorization

Some endpoints require a JWT.

Authenticated requests use:

```text
Authorization: Bearer <token>
```

Admin item-management endpoints additionally require the authenticated user to have the `admin` role.

## Production Deployment

The project is deployed using Render.

### Backend

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`

### Frontend

- Root directory: `frontend`
- Build command: `npm install && npm run build`
- Publish directory: `dist`

The frontend uses a rewrite rule for React Router:

```text
/*  →  /index.html  (Rewrite)
```

This allows direct URLs such as `/admin`, `/recommendations`, and `/items/:id` to work correctly after a browser refresh.

## Testing

The deployed application has been tested for:

- Registration
- Login and logout
- JWT authentication
- Protected routes
- Admin authorization
- Item creation
- Item editing
- Item deletion
- Search
- Type filtering
- Item details
- Views
- Likes and unlikes
- Saves and unsaves
- Activity history
- Activity cleanup after item deletion
- Personalized recommendations
- MongoDB Atlas persistence
- Production frontend/backend communication
- React Router direct-page refresh

## Security

The application uses:

- Password hashing
- JWT authentication
- Role-based authorization
- Protected API routes
- Environment variables for secrets
- CORS configuration
- Server-side validation
- MongoDB/Mongoose validation

Sensitive values such as database credentials and JWT secrets should never be committed to GitHub.

## Repository

GitHub:

https://github.com/iAustin-tx/recommendation-app