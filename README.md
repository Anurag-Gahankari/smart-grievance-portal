# Smart Grievance Portal

A comprehensive web-based complaint management system that enables citizens to submit and track grievances, while providing administrators and officers with tools to manage and resolve complaints efficiently.

## Overview

The Smart Grievance Portal is a full-stack application designed to streamline the complaint resolution process. Citizens can submit complaints about civic issues, track their status in real-time, and communicate with assigned officers. Administrators can manage complaints, assign officers, and monitor system-wide metrics. Officers can efficiently process assigned complaints and update their resolution status.

## Features

### 🔐 Authentication & Authorization
- JWT-based user authentication
- Role-based access control (Citizen, Officer, Admin)
- Secure password hashing with bcryptjs
- Session management with 1-hour token expiration

### 📋 Complaint Management
- Submit complaints with title, description, and category
- Real-time complaint tracking and status updates
- Multiple complaint categories (Sanitation, Water Supply, Roads, Electricity, Other)
- Status workflow (Pending → In Progress → Resolved/Closed)
- Pagination and filtering capabilities

### 👥 Role-Based Dashboards
- **Citizen Dashboard**: View personal complaints, submit new ones, track status
- **Officer Dashboard**: View assigned complaints, update resolution status
- **Admin Dashboard**: Manage all complaints, assign officers, system monitoring

### 📊 Advanced Features
- Complaint filtering by status and category
- Officer assignment and management
- Pagination with customizable page sizes
- Responsive design for all devices
- Real-time notifications via toast messages

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Environment Management**: dotenv
- **CORS**: Enabled for cross-origin requests

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn-ui
- **Routing**: React Router v6
- **Icons**: Lucide Icons
- **State Management**: React Context API
- **HTTP Client**: Fetch API with custom wrapper

## Project Structure

```
smart-grievance-portal/
├── backend/                          # Node.js Express server
│   ├── models/
│   │   ├── User.js                  # User schema (Citizen, Officer, Admin)
│   │   └── Complaint.js             # Complaint schema with references
│   ├── routes/
│   │   ├── auth.js                  # Authentication endpoints
│   │   └── complaints.js            # Complaint CRUD endpoints
│   ├── middleware/
│   │   └── auth.js                  # JWT verification & role authorization
│   ├── utils/
│   │   └── response.js              # Standardized response formatter
│   ├── server.js                    # Server initialization
│   ├── .env                         # Environment variables
│   └── package.json
│
└── frontend/                         # React TypeScript application
    ├── src/
    │   ├── components/
    │   │   ├── DashboardLayout.tsx
    │   │   ├── PrivateRoute.tsx
    │   │   ├── StatusBadge.tsx
    │   │   └── ui/               # shadcn-ui components
    │   ├── pages/
    │   │   ├── LoginPage.tsx
    │   │   ├── RegisterPage.tsx
    │   │   ├── UserDashboard.tsx
    │   │   ├── AdminDashboard.tsx
    │   │   └── OfficerDashboard.tsx
    │   ├── context/
    │   │   └── AuthContext.tsx      # Authentication state management
    │   ├── services/
    │   │   └── api.ts              # API client with request/response handling
    │   ├── hooks/
    │   ├── lib/
    │   └── main.tsx
    ├── index.html
    ├── tailwind.config.ts
    ├── vite.config.ts
    └── package.json
```

## Prerequisites

- **Node.js**: v16 or higher
- **npm** or **yarn**: Package manager
- **MongoDB**: Local or cloud instance (MongoDB Atlas)
- **Git**: Version control

## Installation & Setup

### 1. Clone the Repository

```sh
git clone https://github.com/Anurag-Gahankari/smart-grievance-portal.git
cd smart-grievance-portal
```

### 2. Backend Setup

```sh
cd backend

# Install dependencies
npm install

# Create .env file with your configuration
cat > .env << EOF
MONGO_URI=mongodb://127.0.0.1:27017/grievance_portal
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
EOF

# Start the development server
npm run dev
```

The backend will be available at `http://localhost:5000`

### 3. Frontend Setup

```sh
cd ../frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_API_BASE_URL=http://localhost:5000/api
EOF

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Available Scripts

### Backend

- `npm run dev` - Start development server with auto-reload
- `npm start` - Start production server
- `npm test` - Run tests

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests with Vitest

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login user | No |
| GET | `/officers` | Get all officers | No |

### Complaint Routes (`/api/complaints`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|----------------|------|
| POST | `/` | Create new complaint | Yes | Citizen |
| GET | `/` | Get complaints (role-based) | Yes | All |
| PATCH | `/:id` | Update complaint status/assign | Yes | Admin |
| DELETE | `/:id` | Delete complaint | Yes | Admin |

## Authentication Flow

1. **Register**: User provides email, name, password, and role
2. **Login**: User authenticates with email and password
3. **Token Generation**: JWT token issued with 1-hour expiration
4. **Token Storage**: Token stored in localStorage
5. **Request Authorization**: Token sent in Authorization header for protected routes
6. **Session Expiry**: Expired sessions redirect to login page

## Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['citizen', 'admin', 'officer'], default: 'citizen'),
  createdAt: Date,
  updatedAt: Date
}
```

### Complaint Model
```javascript
{
  title: String (required),
  description: String (required),
  category: String (enum: ['Sanitation', 'Water Supply', 'Roads', 'Electricity', 'Other']),
  status: String (enum: ['Pending', 'In Progress', 'Resolved', 'Closed'], default: 'Pending'),
  citizen: ObjectId (ref: User),
  assignedTo: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## User Roles & Workflows

### Citizen
- Register and login
- Submit complaints with category and description
- View personal complaints with real-time status
- Filter complaints by status
- Track complaint resolution

### Officer
- Login to view assigned complaints
- Update complaint status through workflow
- See complaint details and citizen information
- Cannot create or delete complaints

### Admin
- View all complaints in the system
- Assign complaints to officers
- Update complaint status
- Delete complaints if needed
- Manage all citizen and officer data

## Security Considerations

- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ JWT authentication with configurable expiration
- ✅ Role-based access control on all protected routes
- ✅ CORS enabled for frontend origin
- ✅ Environment variables for sensitive data
- ✅ Input validation on all API endpoints
- ✅ Error messages don't leak sensitive information

## Error Handling

The application implements comprehensive error handling:

- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient permissions for the action
- **404 Not Found**: Resource doesn't exist
- **500 Internal Server Error**: Server-side issues

All errors are returned with descriptive messages and appropriate HTTP status codes.

## Development Tips

- Use MongoDB Compass to visualize database
- Check browser DevTools for API request/response inspection
- Use Postman or similar tool to test backend APIs directly
- Enable React DevTools extension for debugging
- Monitor console for detailed error messages
- Test different user roles to verify access control

## Performance Optimizations

- Pagination limits large dataset queries
- Lazy loading of components
- Optimized database queries with proper indexing
- Minified production builds
- CSS modules for scoped styling

## Deployment

### Backend Deployment
- Deploy to Heroku, Railway, Render, or similar platform
- Set environment variables on hosting platform
- Ensure MongoDB connection string is accessible

### Frontend Deployment
- Build: `npm run build`
- Deploy `dist/` folder to Netlify, Vercel, GitHub Pages, or similar
- Set API base URL environment variable to production backend

## Testing

The project includes test setup with Vitest and React Testing Library. Run tests with:

```sh
npm run test
```

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## Documentation

- [Backend Documentation](./backend/DOCUMENTATION.md)
- [Frontend README](./frontend/README.md)

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Verify `MONGO_URI` in `.env` file
- Check network access if using MongoDB Atlas

### CORS Error
- Verify `VITE_API_BASE_URL` matches backend URL
- Check backend CORS middleware configuration

### Authentication Fails
- Clear localStorage and try logging in again
- Verify JWT_SECRET is set correctly
- Check token expiration time

### Data Not Showing
- Verify API calls in browser Network tab
- Check browser console for errors
- Ensure backend is running
- Verify user has appropriate role permissions

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support & Contact

For issues, bugs, or feature requests, please open an issue on the [GitHub repository](https://github.com/Anurag-Gahankari/smart-grievance-portal).

## Changelog

### v1.2
- Fixed database query execution issues
- Improved API response handling
- Enhanced error messages
- Added delete complaint endpoint
- Better officer role support

### v1.0
- Initial project setup
- Authentication system
- Basic CRUD operations
- Role-based dashboards
