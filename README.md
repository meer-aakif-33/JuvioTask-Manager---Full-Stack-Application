#  Task Manager - Full-Stack Application

A production-ready task management system built with modern web technologies, featuring secure authentication, real-time updates, and a beautiful responsive UI.
## Development Approach & Methodology

### **Architecture Philosophy**

This project follows a **layered architecture** pattern with clear separation of concerns:

**Backend (3-Layer Architecture):**

```
Controllers → Services → Database
   ↓            ↓           ↓
Handle HTTP  Business    Data Access
Requests     Logic       (Prisma ORM)
```

**Frontend (Component-Based Architecture):**

```
Pages → Components → Hooks/Context → API Client
  ↓         ↓            ↓              ↓
Routes   Reusable    State Mgmt    Backend Comm
         UI Parts
```

### **Key Design Decisions**

**1. Type Safety First**

* Full TypeScript implementation on both frontend and backend
* Shared type definitions for consistency
* Compile-time error catching reduces runtime bugs

**2. Security by Design**

* Authentication implemented before features
* JWT with refresh tokens (industry standard)
* Input validation on both client and server
* Rate limiting and CORS protection built-in

**3. Scalability Considerations**

* Modular code structure for easy feature addition
* Database indexes for query optimization
* Stateless authentication (scales horizontally)
* Clear separation between layers

**4. Developer Experience**

* Clear folder structure and naming conventions
* Comprehensive error handling with helpful messages
* Environment-based configuration
* Code reusability through components and services

### **Technology Selection Rationale**

| Technology       | Why Chosen             | Benefits                                        |
| ---------------- | ---------------------- | ----------------------------------------------- |
| **Next.js 14**   | Modern React framework | SSR, routing, optimizations out-of-box          |
| **TypeScript**   | Type safety            | Catch errors early, better IDE support          |
| **Prisma**       | Modern ORM             | Type-safe queries, easy migrations              |
| **PostgreSQL**   | Robust RDBMS           | ACID compliance, excellent for relational data  |
| **JWT**          | Stateless auth         | Scalable, works with microservices              |
| **Tailwind CSS** | Utility-first CSS      | Rapid development, small bundle size            |
| **Zod**          | Schema validation      | Type-safe validation, same schema client/server |

### **Development Workflow**

1. **Backend First Approach**: Establish API contracts before UI
2. **Incremental Development**: Authentication → Core features → Polish
3. **Test as You Go**: Manual testing via Postman at each stage
4. **Security Conscious**: Validation and protection at every layer
5. **Documentation Driven**: Clear API docs and code comments

##  Key Features

### Authentication & Security
- JWT-based authentication with access & refresh tokens
- Secure password hashing with bcrypt (12 salt rounds)
- HTTP-only cookies for refresh token storage
- Protected API routes with middleware
- CSRF protection and rate limiting
- Input validation (client & server-side)

### Task Management
- **CRUD Operations**: Create, read, update, and delete tasks
- **Advanced Filtering**: Filter by status, priority, and search terms
- **Sorting Options**: Sort by date, priority, or title
- **Pagination**: Efficient data loading with pagination
- **Real-time Statistics**: Dashboard with task completion metrics

### User Experience
- Modern, responsive UI with Tailwind CSS
- Toast notifications for user feedback
- Loading states and error handling
- Form validation with helpful error messages
- Smooth animations and transitions

## 🛠 Technology Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js + TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Security**: helmet, cors, express-rate-limit

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios (with interceptors)
- **Notifications**: Sonner
- **Icons**: Lucide React

## 📁 Project Structure

```
task-manager/
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── models/         # Prisma schema
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Helper functions
│   │   └── index.ts        # App entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js pages
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # API client, auth context
│   │   └── types/          # TypeScript types
│   ├── .env.local.example
│   ├── package.json
│   └── tailwind.config.js
│
├── docker-compose.yml
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ installed
- PostgreSQL 15+ installed and running
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/taskmanager"
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_REFRESH_SECRET="your-super-secret-refresh-key"
   FRONTEND_URL="http://localhost:3000"
   ```

4. **Generate Prisma client and run migrations**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```
   
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   Application will run on `http://localhost:3000`

<!-- ## 🐳 Docker Deployment

### Using Docker Compose

1. **Set environment variables**
   ```bash
   export JWT_SECRET="your-production-jwt-secret"
   export JWT_REFRESH_SECRET="your-production-refresh-secret"
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:5000`
   - Database: `localhost:5432` -->

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123",
  "name": "John Doe"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123"
}

Response:
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "eyJhbG..."
  }
}
```

#### Refresh Token
```http
POST /auth/refresh
Cookie: refreshToken=...

Response:
{
  "success": true,
  "data": {
    "accessToken": "eyJhbG..."
  }
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer {token}
```

### User Endpoints

#### Get Profile
```http
GET /users/profile
Authorization: Bearer {token}
```

#### Update Profile
```http
PUT /users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Jane Doe",
  "avatar": "https://example.com/avatar.jpg"
}
```

#### Get Statistics
```http
GET /users/statistics
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "totalTasks": 15,
    "completedTasks": 8,
    "inProgressTasks": 5,
    "todoTasks": 2
  }
}
```

### Task Endpoints

#### Get All Tasks
```http
GET /tasks?page=1&limit=10&status=TODO&priority=HIGH&search=meeting
Authorization: Bearer {token}

Query Parameters:
- page: number (default: 1)
- limit: number (default: 10)
- status: TODO | IN_PROGRESS | COMPLETED
- priority: LOW | MEDIUM | HIGH
- search: string
- sortBy: createdAt | dueDate | priority | title
- sortOrder: asc | desc
```

#### Create Task
```http
POST /tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Complete documentation",
  "description": "Write README and API docs",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2024-12-31T23:59:59.000Z"
}
```

#### Update Task
```http
PUT /tasks/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "IN_PROGRESS",
  "priority": "MEDIUM"
}
```

#### Delete Task
```http
DELETE /tasks/:id
Authorization: Bearer {token}
```

## 🔐 Security Features

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### Token Management
- **Access Token**: 15-minute expiration
- **Refresh Token**: 7-day expiration
- Automatic token refresh on 401 errors
- Secure HTTP-only cookies

### API Protection
- Rate limiting (100 requests per 15 minutes)
- CORS configured for trusted origins
- Helmet.js for HTTP headers security
- Input validation on all endpoints
- SQL injection prevention via Prisma ORM

## 📈 Production Scaling Strategy

### Current Architecture
- Monolithic backend with modular structure
- PostgreSQL single instance
- Client-side rendering with Next.js

### Phase 1: Basic Scaling (0-10K users)
```
┌─────────────┐
│ Next.js App │ → CDN (Vercel/Cloudflare)
└─────────────┘
      ↓
┌─────────────┐
│ Load Balancer│
└─────────────┘
      ↓
┌─────────────┬─────────────┐
│  API Server │  API Server │ (Horizontal scaling)
└─────────────┴─────────────┘
      ↓
┌─────────────┐
│ PostgreSQL  │ + Connection pooling (PgBouncer)
└─────────────┘
```

**Implementation Steps:**
1. Deploy frontend to Vercel/Netlify with CDN
2. Add Nginx load balancer
3. Implement PgBouncer for connection pooling
4. Add Redis for session management
5. Enable database read replicas

### Phase 2: Microservices (10K-100K users)
```
┌─────────────┐
│  Frontend   │ → CDN
└─────────────┘
      ↓
┌─────────────┐
│ API Gateway │ (Kong/AWS API Gateway)
└─────────────┘
      ↓
┌─────────────┬──────────────┬──────────────┐
│Auth Service │ Task Service │ User Service │
└─────────────┴──────────────┴──────────────┘
      ↓              ↓              ↓
┌─────────────┬──────────────┬──────────────┐
│  Auth DB    │   Task DB    │   User DB    │
└─────────────┴──────────────┴──────────────┘
      ↓
┌─────────────┐
│ Redis Cache │
└─────────────┘
```

**Implementation Steps:**
1. Split into microservices (Auth, Tasks, Users)
2. Implement API Gateway
3. Add message queue (RabbitMQ/Kafka)
4. Implement distributed caching (Redis Cluster)
5. Database sharding by user_id

### Phase 3: Enterprise Scale (100K+ users)
```
┌─────────────┐
│Edge Caching │ (CloudFlare/Fastly)
└─────────────┘
      ↓
┌─────────────┐
│ Kubernetes  │ (Auto-scaling, self-healing)
└─────────────┘
      ↓
┌────────────────────────────────────────┐
│         Microservices Mesh             │
│  (Istio/Linkerd for service discovery) │
└────────────────────────────────────────┘
      ↓
┌─────────────┬──────────────┬───────────┐
│Multi-region │  Event Bus   │ Analytics │
│   Database  │ (Kafka/SQS)  │  (ELK)    │
└─────────────┴──────────────┴───────────┘
```

**Implementation Steps:**
1. Kubernetes orchestration
2. Service mesh (Istio)
3. Multi-region deployment
4. Event-driven architecture
5. Advanced monitoring (DataDog, New Relic)
6. Distributed tracing (Jaeger)

### Database Scaling Strategy

**Level 1: Vertical Scaling**
- Upgrade to larger instances
- Optimize queries and indexes
- Implement query caching

**Level 2: Read Replicas**
```
┌──────────────┐
│Primary (Write)│
└──────┬───────┘
       │
       ├───────┬───────┬───────┐
       ↓       ↓       ↓       ↓
   ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
   │Rep 1│ │Rep 2│ │Rep 3│ │Rep 4│ (Read)
   └─────┘ └─────┘ └─────┘ └─────┘
```

**Level 3: Sharding**
```
Users A-M → Shard 1
Users N-Z → Shard 2
```

### Caching Strategy

**Layer 1: CDN Caching**
- Static assets
- API responses with high TTL

**Layer 2: Application Cache (Redis)**
```typescript
// Cache frequently accessed data
const getUserTasks = async (userId: string) => {
  const cacheKey = `user:${userId}:tasks`;
  
  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);
  
  // Fetch from database
  const tasks = await prisma.task.findMany({ where: { userId } });
  
  // Cache for 5 minutes
  await redis.setex(cacheKey, 300, JSON.stringify(tasks));
  
  return tasks;
};
```

**Layer 3: Database Query Cache**
- PostgreSQL query caching
- Materialized views for analytics

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test                    # Run all tests
npm run test:watch         # Watch mode
```

### Frontend Tests
```bash
cd frontend
npm test                    # Run all tests
npm run test:e2e          # End-to-end tests
```

## Monitoring & Observability

### Logging
```typescript
// backend/src/utils/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Health Checks
```http
GET /health

Response:
{
  "status": "OK",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

### Metrics to Monitor
- Request latency (p50, p95, p99)
- Error rates by endpoint
- Database connection pool usage
- Memory and CPU usage
- Active user sessions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

##  License

This project is licensed under the MIT License.

## Authors

Aakif - Full-Stack Developer

##  Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- All open-source contributors

---

