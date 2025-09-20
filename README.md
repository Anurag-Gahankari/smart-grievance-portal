# Smart Grievance Portal

A web application for managing and resolving complaints efficiently.

## Project Structure

- `backend/` - Node.js Express server, API routes, models, middleware
    - `models/` - Mongoose models for User and Complaint
    - `routes/` - API endpoints for authentication and complaints
    - `middleware/` - Custom middleware (e.g., authentication)
    - `server.js` - Main server file

## Getting Started

1. Clone the repository:
   ```sh
   git clone https://github.com/Anurag-Gahankari/smart-grievance-portal.git
   ```
2. Install dependencies:
   ```sh
   cd smart-grievance-portal/backend
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the `backend/` directory with your configuration (e.g., MongoDB URI, JWT secret).
4. Start the server:
   ```sh
   npm start
   ```

## Features
- User authentication (JWT)
- Complaint submission and tracking
- Admin management of complaints

## Technologies Used
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT for authentication

## License
MIT
