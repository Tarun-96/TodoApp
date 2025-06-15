# Todo App Backend

Express.js REST API server with JWT authentication, PostgreSQL database integration, and comprehensive validation middleware.

## Overview

This backend service provides a complete REST API for the Todo application, featuring secure user authentication, CRUD operations for todo items, and robust error handling. Built with Node.js and Express.js, it uses PostgreSQL for data persistence and JWT tokens for stateless authentication.

## 🏗️ Architecture

### Key Components
- **Express.js Server**: Main application framework with middleware pipeline
- **PostgreSQL Database**: Relational database with normalized schema
- **JWT Authentication**: Stateless token-based authentication system
- **Joi Validation**: Request payload validation and sanitization
- **CORS Middleware**: Cross-origin resource sharing configuration
- **Error Handling**: Centralized error handling with appropriate HTTP status codes

### Database Schema
```sql
-- Users table for authentication
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
);

-- Items table with foreign key relationship
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Quick Start

### Prerequisites
- Node.js v14+ installed
- PostgreSQL v12+ running
- npm or yarn package manager

### Installation

1. **Clone and Navigate**
```bash
git clone <repository-url>
cd todo-backend
```

2. **Install Dependencies**
```bash
npm install
```

3. **Environment Setup**
Copy `.env.example` to `.env` and configure:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tododb
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_key_minimum_32_characters
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

4. **Database Setup**
```bash
# Create database
createdb tododb

# Run schema (connect to psql and execute)
psql -d tododb -f schema.sql
```

5. **Start Development Server**
```bash
npm run dev
# or
npm start
```

Server will be available at `http://localhost:3001`

## 📡 API Reference

### Base URL
```
http://localhost:3001
```

### Authentication Endpoints

#### Register New User
```http
POST /auth/signup
Content-Type: application/json

{
  "name": "Tarun",
  "email": "tarun@example.com",
  "password": "securepassword123"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "Tarun",
  "email": "tarun@example.com"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input data
- `409 Conflict`: Email already registered

#### User Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**
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

**Error Responses:**
- `400 Bad Request`: Missing credentials
- `401 Unauthorized`: Invalid credentials

### Todo Items Endpoints (Protected)

All item endpoints require JWT authentication:
```http
Authorization: Bearer <jwt_token>
```

#### Get All User Items
```http
GET /items
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "title": "Buy groceries",
    "description": "Milk, bread, eggs",
    "created_at": "2023-06-14T10:30:00.000Z"
  }
]
```

#### Create New Item
```http
POST /items
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the todo app implementation"
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "user_id": 1,
  "title": "Complete project",
  "description": "Finish the todo app implementation",
  "created_at": "2023-06-14T11:45:00.000Z"
}
```

#### Update Existing Item
```http
PUT /items/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Updated title",
  "description": "Updated description",
  "created_at": "2023-06-14T10:30:00.000Z"
}
```

#### Delete Item
```http
DELETE /items/:id
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "message": "Item deleted successfully"
}
```

**Error Responses for Protected Endpoints:**
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Token expired or malformed
- `404 Not Found`: Item not found or doesn't belong to user
- `500 Internal Server Error`: Database or server error

## 🔧 Configuration

### Environment Variables

| Variable | Type | Required | Description | Default |
|----------|------|----------|-------------|---------|
| `DB_HOST` | string | Yes | PostgreSQL host address | - |
| `DB_PORT` | number | Yes | PostgreSQL port number | - |
| `DB_NAME` | string | Yes | Database name | - |
| `DB_USER` | string | Yes | Database username | - |
| `DB_PASSWORD` | string | Yes | Database password | - |
| `JWT_SECRET` | string | Yes | Secret key for JWT signing (min 32 chars) | - |
| `JWT_EXPIRES_IN` | string | No | Token expiration time | 24h |
| `PORT` | number | No | Server port number | 3001 |
| `NODE_ENV` | string | No | Environment mode | development |
| `FRONTEND_URL` | string | Yes | Frontend URL for CORS | - |

### Security Configuration

#### JWT Token Settings
- **Algorithm**: HS256 (HMAC with SHA-256)
- **Default Expiration**: 24 hours
- **Payload**: Contains user ID and email
- **Secret Rotation**: Change JWT_SECRET for security

#### Password Security
- **Hashing**: bcryptjs with salt rounds 10
- **Minimum Length**: Enforced client-side (consider server validation)
- **Storage**: Only hashed passwords stored in database

#### CORS Settings
- **Origin**: Configured via FRONTEND_URL environment variable
- **Credentials**: Enabled for cookie-based authentication
- **Methods**: GET, POST, PUT, DELETE, OPTIONS

## 📁 Project Structure

```
todo-backend/
├── routes/                    # API route handlers
│   ├── auth.js               # Authentication endpoints
│   └── items.js              # Todo CRUD endpoints
├── middleware/               # Custom middleware functions
│   └── authMiddleware.js     # JWT verification middleware
├── config/                   # Configuration modules
│   └── db.js                # Database connection setup
├── app.js                   # Main Express application
├── .env                     # Environment variables (not in repo)
├── .env.example            # Environment template
├── .gitignore              # Git ignore patterns
├── package.json            # Dependencies and scripts
└── README.md               # This documentation
```

### File Descriptions

#### `app.js`
Main Express application setup with middleware configuration, route mounting, and server initialization.

#### `config/db.js`
PostgreSQL connection pool configuration using environment variables with connection error handling.

#### `routes/auth.js`
Authentication route handlers for user registration and login with input validation and error handling.

#### `routes/items.js`
Todo item CRUD operations with user-specific data filtering and comprehensive validation.

#### `middleware/authMiddleware.js`
JWT token verification middleware for protecting routes and extracting user information.

## 🧪 Testing & Development

### Available Scripts

```bash
# Start production server
npm start

# Start development server with nodemon
npm run dev

# Run tests (if configured)
npm test

# Check for security vulnerabilities
npm audit

# Fix security issues
npm audit fix
```

### Development Tools

#### Database Tools
```bash
# Connect to database
psql -h localhost -U postgres -d tododb

# View tables
\dt

# Describe table structure
\d users
\d items

# Check user data
SELECT * FROM users;

# Check items data
SELECT * FROM items;
```

#### API Testing

**Using curl:**
```bash
# Test signup
curl -X POST http://localhost:3001/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Test login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test protected endpoint (replace TOKEN)
curl -X GET http://localhost:3001/items \
  -H "Authorization: Bearer TOKEN"
```

**Using Postman:**
1. Import provided Postman collection
2. Set environment variables for base URL and token
3. Run authentication flow tests
4. Test CRUD operations with valid tokens

### Debugging

#### Enable Debug Logging
```bash
# Set debug environment variable
DEBUG=app:* npm start
```

#### Common Debug Commands
```javascript
// Add to route handlers for debugging
console.log('Request body:', req.body);
console.log('User from token:', req.user);
console.log('Database query result:', result.rows);
```

## 🔒 Security Considerations

### Authentication Security
- Passwords hashed with bcryptjs before storage
- JWT tokens signed with strong secret key
- Tokens expire after configurable time period
- No sensitive data stored in JWT payload

### Database Security
- Prepared statements prevent SQL injection
- Foreign key constraints maintain data integrity
- User isolation through user_id filtering
- Connection pooling for performance and security

### API Security
- CORS configured for specific frontend origin
- Rate limiting recommended for production
- Input validation with Joi library
- Error messages don't expose sensitive information

### Production Security Checklist
- [ ] Use environment variables for all secrets
- [ ] Configure HTTPS in production
- [ ] Implement rate limiting
- [ ] Add request logging for monitoring
- [ ] Regular dependency updates
- [ ] Database connection encryption
- [ ] Error monitoring and alerting

## 🚀 Deployment

### Production Environment Setup

1. **Environment Variables**
```env
# Production .env
NODE_ENV=production
PORT=3001
DB_HOST=your-production-db-host
DB_NAME=your-production-db
DB_USER=your-production-user
DB_PASSWORD=your-secure-password
JWT_SECRET=your-production-secret-64-characters-minimum
FRONTEND_URL=https://your-frontend-domain.com
```

2. **Database Migration**
```sql
-- Run on production database
CREATE DATABASE your_production_db;
\c your_production_db;
-- Execute schema creation scripts
```

3. **Platform-Specific Deployment**

**Render:**
- Connect GitHub repository
- Set build command: `npm install`
- Set start command: `npm start`
- Configure environment variables in dashboard

**Railway:**
- Deploy from GitHub
- Set environment variables
- Configure PostgreSQL addon

**Heroku:**
- Install Heroku CLI
- Create new app: `heroku create your-app-name`
- Set environment variables: `heroku config:set KEY=value`
- Deploy: `git push heroku main`

## 🐛 Troubleshooting

### Common Issues

**Database Connection Failed**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solutions:**
- Verify PostgreSQL is running
- Check database credentials in .env
- Ensure database exists and is accessible

**JWT Token Errors**
```
Error: JsonWebTokenError: invalid signature
```
**Solutions:**
- Verify JWT_SECRET matches between environments
- Check token expiration settings
- Regenerate tokens if secret changed

**CORS Errors**
```
Access to fetch blocked by CORS policy
```
**Solutions:**
- Verify FRONTEND_URL in environment variables
- Check CORS middleware configuration
- Ensure proper headers in requests

**Validation Errors**
```
ValidationError: "email" must be a valid email
```
**Solutions:**
- Check Joi schema definitions
- Verify request payload format
- Review client-side form validation

### Debug Checklist
1. Check environment variables are loaded correctly
2. Verify database connection and table existence
3. Test API endpoints with proper headers
4. Validate request payloads match schema
5. Check server logs for detailed error messages

## 📚 Dependencies

### Production Dependencies
- **express**: ^4.18.2 - Web application framework
- **pg**: ^8.11.0 - PostgreSQL client for Node.js
- **bcryptjs**: ^2.4.3 - Password hashing library
- **jsonwebtoken**: ^9.0.0 - JWT implementation
- **joi**: ^17.9.2 - Data validation library
- **cors**: ^2.8.5 - Cross-origin resource sharing
- **dotenv**: ^16.1.4 - Environment variable loader

### Development Dependencies
- **nodemon**: ^2.0.22 - Development server with auto-restart

### Version Compatibility
- Node.js: >=14.0.0
- PostgreSQL: >=12.0.0
- npm: >=6.0.0

## 📄 License

This project is licensed under the MIT License. 

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request

### Development Guidelines
- Follow existing code style and patterns
- Add appropriate error handling
- Include input validation for new endpoints
- Update documentation for API changes
- Test thoroughly before submitting PR