# Full-Stack To-Do Application

A modern, full-stack to-do application built with React.js, Node.js, Express, and PostgreSQL. Features user authentication, CRUD operations, and a responsive Material-UI interface.

## 🚀 Features

- **User Authentication**: JWT-based signup and login with secure password hashing
- **CRUD Operations**: Create, read, update, and delete todo items
- **Responsive Design**: Material-UI components for modern, mobile-friendly UI
- **Real-time Updates**: Instant updates using React Context API
- **Form Validation**: Client-side and server-side validation with Joi
- **Secure Authentication**: Password hashing with bcryptjs and JWT tokens
- **Toast Notifications**: User-friendly success/error messages with react-toastify

## 🛠️ Tech Stack

### Frontend
- React.js 18+ with functional components and hooks
- Material-UI (MUI) for component library
- React Router v6 for navigation and protected routes
- Axios for HTTP requests with JWT interceptors
- React Context API for global state management
- React Toastify for notification system
- Custom CSS for authentication pages

### Backend
- Node.js with Express.js framework
- PostgreSQL database with foreign key relationships
- JWT (JSON Web Tokens) for stateless authentication
- Bcryptjs for secure password hashing
- Joi for request payload validation
- CORS middleware for cross-origin requests
- dotenv for environment variable management

### Database
- PostgreSQL with two normalized tables (users, items)
- Foreign key constraints for data integrity
- Timestamps for audit trails

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager
- Git for version control

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/todo-app.git
cd todo-app
```

### 2. Backend Setup

```bash
cd todo-backend
npm install
```

Create a `.env` file in the backend directory (copy from `.env.example`):

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tododb
DB_USER=postgres
DB_PASSWORD=your_password_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### 3. Database Setup

Create a PostgreSQL database and run these SQL commands:

```sql
CREATE DATABASE tododb;

\c tododb;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(100)
);

CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Frontend Setup

```bash
cd ../todo-frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENV=development

# Optional: Feature flags
REACT_APP_ENABLE_LOGGING=true
```

### 5. Running the Application

#### Start the Backend Server
```bash
cd todo-backend
npm start
```
Server will run on: http://localhost:3001

#### Start the Frontend Server
```bash
cd todo-frontend
npm start
```
Application will be available at: http://localhost:3000

## 📚 API Documentation

### Authentication Endpoints

#### POST /auth/signup
Register a new user account.

**Request Body:**
```json
{
  "name": "Tarun",
  "email": "Tarun@example.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Tarun",
  "email": "Tarun@example.com"
}
```

#### POST /auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "tarun@example.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Tarun",
    "email": "tarun@example.com"
  }
}
```

### Todo Items Endpoints (Protected)

All item endpoints require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

#### GET /items
Retrieve all todo items for authenticated user.

#### POST /items
Create a new todo item.

**Request Body:**
```json
{
  "title": "Buy groceries",
  "description": "Milk, bread, eggs"
}
```

#### PUT /items/:id
Update an existing todo item.

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description"
}
```

#### DELETE /items/:id
Delete a specific todo item by ID.

## 🔐 Environment Variables

### Backend Environment Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| DB_HOST | PostgreSQL database host | localhost | Yes |
| DB_PORT | Database port number | 5432 | Yes |
| DB_NAME | Database name | tododb | Yes |
| DB_USER | Database username | postgres | Yes |
| DB_PASSWORD | Database password | your_password | Yes |
| JWT_SECRET | Secret key for JWT signing | random_64_char_string | Yes |
| JWT_EXPIRES_IN | Token expiration time | 24h | No |
| PORT | Server port | 3001 | No |
| NODE_ENV | Environment mode | development | No |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:3000 | Yes |

### Frontend Environment Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| REACT_APP_API_URL | Backend API base URL | http://localhost:3001 | Yes |
| REACT_APP_ENV | Environment identifier | development | No |
| REACT_APP_ENABLE_LOGGING | Enable request logging | true | No |

## 📁 Project Structure

```
todo-app/
├── todo-backend/                 # Backend application
│   ├── routes/                  # API route handlers
│   │   ├── auth.js             # Authentication routes
│   │   └── items.js            # Todo items CRUD routes
│   ├── middleware/             # Custom middleware functions
│   │   └── authMiddleware.js   # JWT verification middleware
│   ├── config/                 # Configuration files
│   │   └── db.js              # Database connection setup
│   ├── app.js                 # Main Express server file
│   ├── .env                   # Environment variables (not in git)
│   ├── .env.example          # Environment template
│   ├── .gitignore            # Git ignore rules
│   ├── package.json          # Dependencies and scripts
│   └── README.md             # Backend documentation
├── todo-frontend/              # Frontend React application
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   ├── pages/            # Page-level components
│   │   │   ├── Login.js      # Login page component
│   │   │   ├── Login.css     # Login page styles
│   │   │   ├── Signup.js     # Signup page component
│   │   │   └── Signup.css    # Signup page styles
│   │   ├── context/          # React Context providers
│   │   │   └── ItemsContext.js # Global state management
│   │   ├── config/           # Configuration files
│   │   │   └── axiosConfig.js # Axios instance with interceptors
│   │   └── App.js            # Main application component
│   ├── public/               # Static assets
│   ├── .env                  # Environment variables (not in git)
│   ├── .env.example         # Environment template
│   ├── .gitignore           # Git ignore rules
│   ├── package.json         # Dependencies and scripts
│   └── README.md            # Frontend documentation
└── README.md                # Main project documentation (this file)
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration with validation
- [ ] User login with correct/incorrect credentials
- [ ] Create new todo items
- [ ] Edit existing todo items
- [ ] Delete todo items
- [ ] Logout functionality
- [ ] Protected route access control
- [ ] Responsive design on mobile devices

### API Testing with Postman
1. Test authentication endpoints
2. Verify JWT token generation
3. Test protected routes with and without tokens
4. Validate request/response payloads
5. Test error handling scenarios

## 🚀 Deployment

### Backend Deployment (Render/Railway/Heroku)
1. Push code to GitHub repository
2. Connect to your chosen deployment platform
3. Set all required environment variables
4. Configure PostgreSQL database instance
5. Update FRONTEND_URL to production domain
6. Deploy and verify API endpoints

### Frontend Deployment (Vercel/Netlify)
1. Push code to GitHub repository
2. Connect to deployment platform
3. Set build command: `npm run build`
4. Set REACT_APP_API_URL to production backend URL
5. Configure environment variables
6. Deploy and test application

### Database Migration
For production deployment:
1. Create production PostgreSQL database
2. Run schema creation scripts
3. Update connection strings in environment variables
4. Test database connectivity

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style Guidelines
- Use ESLint and Prettier for code formatting
- Follow React functional component patterns
- Use descriptive variable and function names
- Add JSDoc comments for complex functions
- Maintain consistent file and folder naming

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error:**
- Verify PostgreSQL is running
- Check database credentials in .env file
- Ensure database exists and tables are created

**JWT Token Issues:**
- Verify JWT_SECRET is set correctly
- Check token expiration settings
- Clear localStorage if using old tokens

**CORS Errors:**
- Verify FRONTEND_URL in backend .env
- Check axios configuration in frontend
- Ensure proper headers are set

## 📝 License(MIT)

Copyright 2025 Tarun

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 - see the [LICENSE](https://opensource.org/license/mit) file for details.

## 👥 Authors

-Tarun - [GitHub Profile](https://github.com/tarun-96)

## 🙏 Acknowledgments

- Material-UI team for excellent React components
- Express.js community for robust web framework
- PostgreSQL for reliable database system
- JWT.io for token debugging tools
- React community for comprehensive documentation