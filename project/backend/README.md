# NivaranAI Backend API

A scalable, secure, and real-time backend for the civic issue reporting platform.

## Features

- **RESTful API** with comprehensive endpoints for citizens and administrators
- **Real-time WebSocket communication** for instant updates
- **AI Integration** for automatic issue classification and department routing
- **JWT Authentication** with role-based access control
- **File Upload Support** for images and videos
- **Push Notifications** via FCM
- **Comprehensive Logging** and error handling
- **Database Migrations** and seeding
- **Rate Limiting** and security middleware

## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Real-time**: Socket.io for WebSocket communication
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Local filesystem (configurable for cloud storage)
- **Logging**: Winston
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd project/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=nivaran_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   
   # JWT
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d
   
   # AI API
   AI_API_URL=https://api.your-ai-service.com/v1/classify
   AI_API_KEY=your_ai_api_key_here
   ```

4. **Database Setup**
   ```bash
   # Create database
   createdb nivaran_db
   
   # Run migrations
   npm run migrate
   ```

5. **Create uploads directory**
   ```bash
   mkdir uploads logs
   ```

6. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "role": "citizen"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <jwt_token>
```

### Ticket Endpoints

#### Create Ticket
```http
POST /api/tickets
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

{
  "title": "Pothole on Main Street",
  "description": "Large pothole causing traffic issues",
  "category": "road_damage",
  "location": {
    "latitude": 23.35,
    "longitude": 85.33,
    "address": "Main Street, City"
  },
  "images": [file1, file2]
}
```

#### Get Ticket by ID
```http
GET /api/tickets/:id
Authorization: Bearer <jwt_token>
```

#### Get User's Tickets
```http
GET /api/tickets/my-tickets?page=1&limit=10&status=pending
Authorization: Bearer <jwt_token>
```

#### Update Ticket Status (Admin only)
```http
PUT /api/tickets/:id/status
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "status": "in_progress",
  "notes": "Work has started on this issue",
  "estimated_resolution": "2024-02-01T10:00:00Z"
}
```

### Admin Endpoints

#### Get Dashboard Stats
```http
GET /api/admin/dashboard/stats
Authorization: Bearer <jwt_token>
```

#### Get All Tickets (with filters)
```http
GET /api/admin/tickets?page=1&limit=20&status=pending&category=road_damage&priority=high
Authorization: Bearer <jwt_token>
```

#### Get Analytics
```http
GET /api/admin/analytics?period=30d
Authorization: Bearer <jwt_token>
```

## WebSocket Events

### Client to Server Events

#### Authentication
```javascript
socket.auth = { token: 'your_jwt_token' };
socket.connect();
```

#### Subscribe to Ticket Updates
```javascript
socket.emit('subscribe_ticket', ticketId);
```

#### Typing Indicators
```javascript
socket.emit('typing_start', { ticketId: 'ticket_id' });
socket.emit('typing_stop', { ticketId: 'ticket_id' });
```

### Server to Client Events

#### Ticket Status Updates
```javascript
socket.on('ticket_updated', (data) => {
  console.log('Ticket updated:', data);
});
```

#### New Ticket Notifications (Admin)
```javascript
socket.on('new_ticket_created', (data) => {
  console.log('New ticket:', data);
});
```

#### Real-time Notifications
```javascript
socket.on('notification', (notification) => {
  console.log('New notification:', notification);
});
```

## AI Integration

The system integrates with AI services for automatic issue classification:

### Classification Request Format
```json
{
  "image_url": "https://example.com/uploads/image.jpg",
  "location": {
    "latitude": "23.35",
    "longitude": "85.33"
  },
  "description": "Water pipeline leakage observed near street corner",
  "context": "civic_issue_classification"
}
```

### Expected AI Response
```json
{
  "issue_type": "water_leakage",
  "severity": "high",
  "recommended_department": "Department of Drinking Water and Sanitation",
  "confidence": 0.85,
  "notes": "Detected water leak with high confidence"
}
```

### Department Mapping
```javascript
{
  "water_leakage": "Department of Drinking Water and Sanitation",
  "garbage_dump": "Department of Urban Development & Housing",
  "road_damage": "Department of Road Construction",
  "streetlight": "Department of Urban Development & Housing",
  "health_hazard": "Department of Health, Medical Education & Family Welfare",
  "traffic_signal": "Department of Transport",
  "other": "General Administration Department"
}
```

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `password` (String, Hashed)
- `name` (String)
- `phone` (String)
- `role` (Enum: citizen, admin, department_head)
- `department` (String)
- `is_active` (Boolean)
- `fcm_token` (String)
- `created_at`, `updated_at` (Timestamps)

### Tickets Table
- `id` (UUID, Primary Key)
- `ticket_number` (String, Unique)
- `title` (String)
- `description` (Text)
- `category` (Enum)
- `status` (Enum: pending, acknowledged, in_progress, resolved, rejected)
- `priority` (Enum: low, medium, high, critical)
- `location` (JSONB)
- `images` (Array of Strings)
- `assigned_department` (String)
- `assigned_to` (UUID, Foreign Key)
- `citizen_id` (UUID, Foreign Key)
- `ai_classification` (JSONB)
- `resolution_notes` (Text)
- `resolved_at` (Timestamp)
- `created_at`, `updated_at` (Timestamps)

### Ticket Updates Table
- `id` (UUID, Primary Key)
- `ticket_id` (UUID, Foreign Key)
- `updated_by` (UUID, Foreign Key)
- `status` (Enum)
- `notes` (Text)
- `attachments` (Array of Strings)
- `is_public` (Boolean)
- `created_at`, `updated_at` (Timestamps)

## Security Features

- **JWT Authentication** with configurable expiration
- **Role-based Access Control** (RBAC)
- **Rate Limiting** to prevent abuse
- **Input Validation** using Joi schemas
- **SQL Injection Protection** via Sequelize ORM
- **CORS Configuration** for cross-origin requests
- **Helmet.js** for security headers
- **File Upload Validation** with size and type restrictions

## Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
DB_HOST=your_production_db_host
DB_NAME=your_production_db_name
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
JWT_SECRET=your_super_secure_jwt_secret
AI_API_URL=your_production_ai_api_url
AI_API_KEY=your_production_ai_api_key
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### PM2 Process Manager
```bash
npm install -g pm2
pm2 start src/server.js --name "nivaran-backend"
pm2 startup
pm2 save
```

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Monitoring and Logging

- **Winston Logger** with file and console transports
- **Request Logging** via Morgan
- **Error Tracking** with stack traces
- **Performance Monitoring** endpoints
- **Health Check** endpoint at `/health`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

This project is licensed under the MIT License.