# Smart Grievance Portal - Frontend

A modern, responsive web application for managing citizen grievances and complaints. This frontend provides role-based dashboards for citizens, officers, and administrators to submit, track, and resolve complaints efficiently.

## Features

- 🔐 **Role-Based Access Control** - Separate dashboards for Citizens, Officers, and Admins
- 📋 **Complaint Management** - Submit, view, filter, and track complaints
- 🔄 **Real-time Status Updates** - Track complaint status from submission to resolution
- 📊 **Admin Dashboard** - Manage all complaints and assign officers
- 👮 **Officer Dashboard** - View and update assigned complaints
- 🔍 **Advanced Filtering** - Filter by status, category, and more
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🎨 **Modern UI** - Built with shadcn-ui and Tailwind CSS

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn-ui** - High-quality React components
- **React Router** - Client-side routing
- **Lucide Icons** - Beautiful icon library

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Backend server running on `http://localhost:5000`

## Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/Anurag-Gahankari/smart-grievance-portal.git
   cd smart-grievance-portal/frontend
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the frontend root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```sh
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality
- `npm run test` - Run tests with Vitest

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── DashboardLayout.tsx    # Main dashboard layout
│   ├── PrivateRoute.tsx       # Protected route component
│   ├── StatusBadge.tsx        # Status display component
│   └── ui/                    # shadcn-ui components
├── context/             # React context for state management
│   └── AuthContext.tsx        # Authentication context
├── hooks/               # Custom React hooks
│   ├── use-mobile.tsx         # Mobile detection hook
│   └── use-toast.ts           # Toast notification hook
├── lib/                 # Utility functions
│   └── utils.ts               # Helper functions
├── pages/               # Page components
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── UserDashboard.tsx      # Citizen dashboard
│   ├── AdminDashboard.tsx     # Admin dashboard
│   ├── OfficerDashboard.tsx   # Officer dashboard
│   ├── UnauthorizedPage.tsx
│   └── NotFound.tsx
├── services/            # API client
│   └── api.ts                 # API service class
├── test/                # Test files
│   ├── setup.ts
│   └── example.test.ts
├── App.tsx              # Main app component
├── main.tsx             # Application entry point
└── index.css            # Global styles
```

## User Roles & Features

### Citizen
- Register and login
- Submit new complaints with title, description, and category
- View all their submitted complaints
- Track complaint status (Pending, In Progress, Resolved, Closed)
- Filter complaints by status

### Officer
- Login to assigned complaints view
- See only complaints assigned to them
- Update complaint status through workflow (Pending → In Progress → Resolved/Closed)
- View complaint details and citizen information

### Admin
- View all complaints from all citizens
- Assign complaints to officers
- Update complaint status
- Filter and manage all complaints in the system

## Authentication

The application uses JWT-based authentication:

1. User registers with email, name, password, and role
2. User logs in with email and password
3. JWT token is stored in localStorage
4. Token is sent with every API request via Authorization header
5. Session expires after 1 hour (configurable)
6. Expired sessions automatically redirect to login

## API Endpoints

The frontend communicates with the backend API:

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /complaints` - Fetch user's complaints (role-based filtering)
- `POST /complaints` - Create new complaint (citizen only)
- `PATCH /complaints/:id` - Update complaint status or assign officer (admin only)
- `DELETE /complaints/:id` - Delete complaint (admin only)

## Styling & Theming

The application uses:
- **Tailwind CSS** for utility-first styling
- **CSS variables** for theme customization in `index.css`
- **Responsive design** with mobile-first approach
- **Dark/Light mode support** via CSS variables

## Error Handling

- API errors are caught and displayed as toast notifications
- Session expiration automatically logs out user and redirects to login
- Unauthorized access (403) shows permission denial message
- Network errors are handled gracefully

## Development Tips

- Use `npm run dev` for hot-reload development
- Check browser console for API response details
- Verify backend is running before starting frontend
- Use React DevTools browser extension for debugging
- ESLint configuration helps maintain code quality

## Build & Deployment

```sh
# Build for production
npm run build

# Preview production build
npm run preview
```

The `dist` folder contains the production-ready files.

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## Related Documentation

- [Backend Documentation](../backend/DOCUMENTATION.md)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [shadcn-ui Documentation](https://ui.shadcn.com)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions, please open an issue on the [GitHub repository](https://github.com/Anurag-Gahankari/smart-grievance-portal).
