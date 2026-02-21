# Smart Grievance Portal - Backend Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Functions & Methods](#functions--methods)
3. [Database Schemas](#database-schemas)
4. [API Endpoints](#api-endpoints)
5. [Middleware Functions](#middleware-functions)
6. [Utility Functions](#utility-functions)
7. [Quick Revision](#quick-revision)

---

## Project Overview

The Smart Grievance Portal is a Node.js/Express backend application that manages citizen complaints and grievances. It provides authentication, role-based access control, and complaint management features with support for three user roles: citizens, admins, and officers.

**Tech Stack:**
- Express.js (API Framework)
- MongoDB with Mongoose (Database)
- JWT (Authentication)
- bcryptjs (Password Hashing)
- CORS (Cross-Origin Resource Sharing)

---

## Functions & Methods

### Authentication Routes (`routes/auth.js`)

#### 1. **register()**
- **HTTP Method:** POST
- **Route:** `/api/auth/register`
- **Purpose:** Registers a new user in the system
- **Parameters:**
  - `name` (String, required): Unique username
  - `email` (String, required): Unique email address
  - `password` (String, required): User password (hashed before storage)
  - `role` (String, optional): User role - "citizen", "admin", or "officer" (default: "citizen")
- **Process:**
  1. Extracts user data from request body
  2. Hashes password using bcryptjs with 10 salt rounds
  3. Creates new user in database
  4. Returns user ID and success message
- **Response Status:** 201 (Created) on success, 500 on error

#### 2. **login()**
- **HTTP Method:** POST
- **Route:** `/api/auth/login`
- **Purpose:** Authenticates user and issues JWT token
- **Parameters:**
  - `email` (String, required): User email
  - `password` (String, required): User password
- **Process:**
  1. Finds user by email in database
  2. Compares provided password with stored hashed password using bcryptjs
  3. Generates JWT token if credentials are valid (expires in 1 hour)
  4. Returns token and user role
- **Response Status:** 200 on success, 401 on invalid credentials, 500 on error

### Complaint Routes (`routes/complaints.js`)

#### 3. **createComplaint()**
- **HTTP Method:** POST
- **Route:** `/api/complaints`
- **Purpose:** Creates a new complaint (Citizens only)
- **Access:** Requires authentication + "citizen" role
- **Parameters:**
  - `title` (String, required): Complaint title
  - `description` (String, required): Detailed complaint description
  - `category` (String, required): Category - "Sanitation", "Water Supply", "Roads", "Electricity", "Other"
- **Process:**
  1. Validates user authentication and role
  2. Extracts complaint details from request body
  3. Automatically assigns complaint to authenticated citizen
  4. Creates complaint with "Pending" status by default
  5. Returns created complaint object
- **Response Status:** 201 (Created) on success, 500 on error

#### 4. **getComplaints()**
- **HTTP Method:** GET
- **Route:** `/api/complaints`
- **Purpose:** Retrieves complaints based on user role
- **Access:** Requires authentication
- **Behavior:**
  - **Admin users:** See all complaints in the system
  - **Non-admin users:** See only their own complaints
- **Process:**
  1. Checks user authentication
  2. Queries database based on user role
  3. Populates citizen information (name, email) for admin view
  4. Returns array of complaints
- **Response Status:** 200 on success, 500 on error

#### 5. **updateComplaint()**
- **HTTP Method:** PATCH
- **Route:** `/api/complaints/:id`
- **Purpose:** Updates complaint status and/or assigns officer (Admin only)
- **Access:** Requires authentication + "admin" role
- **Parameters:**
  - `id` (URL parameter): Complaint ID to update
  - `status` (String, optional): New status - "Pending", "In Progress", "Resolved", "Closed"
  - `assignedTo` (ObjectId, optional): Officer's user ID to assign complaint
- **Process:**
  1. Validates user is admin
  2. Finds complaint by ID
  3. Updates status and/or assigned officer
  4. Runs validators on updated document
  5. Returns updated complaint object
- **Response Status:** 200 on success, 404 if complaint not found, 500 on error

### Middleware Functions (`middleware/auth.js`)

#### 6. **authMiddleware()**
- **Purpose:** Validates JWT token in request headers
- **Usage:** Applied to protected routes
- **Process:**
  1. Extracts token from Authorization header (Bearer token format)
  2. Verifies token using JWT_SECRET
  3. Decodes token and attaches user data to request object
  4. Proceeds to next middleware if valid
  5. Returns 401 if no token, 400 if invalid token
- **Sets:** `req.user` (contains user ID and role)

#### 7. **authorizeRoles()**
- **Purpose:** Role-based access control middleware factory
- **Parameters:** `...roles` (variable number of allowed roles)
- **Process:**
  1. Returns middleware function that checks user role
  2. Compares user's role against allowed roles array
  3. Returns 403 (Forbidden) if role not authorized
  4. Proceeds if role is authorized
- **Usage Example:** `authorizeRoles("admin", "officer")`

### Utility Functions (`utils/response.js`)

#### 8. **sendResponse()**
- **Purpose:** Standardizes API response format across all endpoints
- **Parameters:**
  - `res` (Response object): Express response object
  - `success` (Boolean): Success flag
  - `message` (String): Response message
  - `data` (Object, optional): Response payload/data (default: null)
  - `error` (String, optional): Error message (default: null)
  - `statuscode` (Number, optional): HTTP status code (default: 200)
- **Returns:** Standardized JSON response
- **Response Format:**
  ```json
  {
    "success": boolean,
    "message": "string",
    "data": null | object,
    "error": null | string
  }
  ```

### Server Setup (`server.js`)

#### 9. **App Initialization**
- **Purpose:** Initializes Express server and configures middleware
- **Middleware Stack:**
  1. `express.json()` - Parses incoming JSON requests
  2. `cors()` - Enables Cross-Origin Resource Sharing
  3. Route handlers for `/api/auth` and `/api/complaints`
- **Database Connection:**
  - Connects to MongoDB using Mongoose
  - Environment variable: `MONGO_URI`
- **Port:** Read from `PORT` environment variable or defaults to 5000
- **Error Handler:** Global error handler for unhandled exceptions

#### 10. **Test Route**
- **HTTP Method:** GET
- **Route:** `/`
- **Purpose:** Health check endpoint to verify API is running
- **Response:** "Smart Grievance Portal API is running..."

---

## Database Schemas

### User Schema

**Model Name:** `User`
**Collection:** `users`

| Field | Type | Properties | Description |
|-------|------|-----------|-------------|
| `name` | String | required, unique | User's full name/username |
| `email` | String | required, unique | User's email address |
| `password` | String | required | Hashed password (bcryptjs) |
| `role` | String (enum) | enum: ["citizen", "admin", "officer"], default: "citizen" | User's role in system |
| `createdAt` | Date | auto | Timestamp when user was created |
| `updatedAt` | Date | auto | Timestamp when user was last updated |

**Purpose:** Stores user authentication details and role information for access control.

---

### Complaint Schema

**Model Name:** `Complaint`
**Collection:** `complaints`

| Field | Type | Properties | Description |
|-------|------|-----------|-------------|
| `title` | String | required | Short title of complaint |
| `description` | String | required | Detailed description of grievance |
| `category` | String (enum) | enum: ["Sanitation", "Water Supply", "Roads", "Electricity", "Other"], required | Type of grievance |
| `status` | String (enum) | enum: ["Pending", "In Progress", "Resolved", "Closed"], default: "Pending" | Current status of complaint |
| `citizen` | ObjectId (ref: User) | required | Reference to the citizen who filed the complaint |
| `assignedTo` | ObjectId (ref: User) | optional | Reference to the officer assigned to handle complaint |
| `createdAt` | Date | auto | Timestamp when complaint was filed |
| `updatedAt` | Date | auto | Timestamp when complaint was last updated |

**Purpose:** Stores all grievance/complaint data with references to citizens and assigned officers.

**Relationships:**
- `citizen` → Links to User model (mandatory)
- `assignedTo` → Links to User model (optional, populated by admin)

---

## API Endpoints

### Authentication Endpoints

| Method | Route | Authentication | Role Required | Purpose |
|--------|-------|-----------------|----------------|---------|
| POST | `/api/auth/register` | ❌ | None | Register new user |
| POST | `/api/auth/login` | ❌ | None | User login & get JWT token |

### Complaint Endpoints

| Method | Route | Authentication | Role Required | Purpose |
|--------|-------|-----------------|----------------|---------|
| POST | `/api/complaints` | ✅ | citizen | Create new complaint |
| GET | `/api/complaints` | ✅ | Any | Get complaints (citizens see own, admins see all) |
| PATCH | `/api/complaints/:id` | ✅ | admin | Update complaint status/assign officer |

### System Endpoints

| Method | Route | Authentication | Purpose |
|--------|-------|-----------------|---------|
| GET | `/` | ❌ | Health check |

---

## Middleware Functions

### Request Flow with Middleware

1. **Express Middleware Stack**
   - `express.json()` → Parses JSON request body
   - `cors()` → Handles cross-origin requests

2. **Authentication Middleware**
   - Applied to protected routes (complaints)
   - Extracts and validates JWT token
   - Sets `req.user` with decoded token data

3. **Authorization Middleware**
   - Applied to role-restricted routes
   - Validates user has required role
   - Returns 403 if unauthorized

### Error Handling
- Global error handler catches unhandled exceptions
- Returns standardized error response with 500 status
- Each route has try-catch for specific error handling

---

## Utility Functions

### sendResponse()

**Function Signature:**
```javascript
sendResponse(res, success, message, data = null, error = null, statuscode = 200)
```

**Usage Examples:**
```javascript
// Success response
sendResponse(res, true, "Login successful", { token, role });

// Error response
sendResponse(res, false, "Invalid Credentials", null, "Invalid Credentials", 401);

// Creation response
sendResponse(res, true, "Complaint Created", { complaint }, null, 201);
```

**Benefits:**
- Ensures consistent response format across all endpoints
- Reduces code duplication
- Makes API responses predictable for frontend

---

## Quick Revision

### Key Concepts

**1. Authentication Flow**
- User registers with name, email, password, and optional role
- Password is hashed using bcryptjs (10 salt rounds)
- On login, user receives JWT token valid for 1 hour
- Token contains user ID and role, signed with JWT_SECRET

**2. Authorization Flow**
- Protected routes check JWT token in Authorization header
- Token is decoded to extract user information
- Role-based access control (RBAC) restricts actions by user role
- Admins have full control; citizens and officers have limited access

**3. Complaint Workflow**
- Citizens create complaints with title, description, and category
- Initial status is always "Pending"
- Admins can view all complaints and update status/assign officers
- Citizens can only view their own complaints
- Officers can potentially be assigned to complaints (structure ready)

**4. Database Design**
- User collection stores authentication and role data
- Complaint collection references User through citizen and assignedTo fields
- Timestamps automatically track creation and modification

**5. Role-Based Access Control**
- **Citizen:** Can create complaints and view only their own
- **Admin:** Can view all complaints, update status, and assign officers
- **Officer:** Structure prepared but not yet implemented in routes

**6. Response Format**
- All responses follow standardized JSON format
- Include success flag, message, data payload, and error details
- Status codes: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 500 (Server Error)

**7. Security Features**
- Password hashing with bcryptjs
- JWT-based authentication
- CORS enabled for cross-origin requests
- Role-based middleware for authorization
- Environment variables for sensitive data (.env)

**8. Dependencies Overview**
- **express:** Web framework for routing and middleware
- **mongoose:** MongoDB object modeling
- **bcryptjs:** Password hashing
- **jsonwebtoken:** JWT creation and verification
- **cors:** Cross-origin resource sharing
- **dotenv:** Environment variable management
- **nodemon:** Development auto-reload (dev only)

---

**Document Version:** 1.0
**Last Updated:** February 2026
**Status:** Complete Backend Documentation for v1.2
