# TaskFlow – Simple Task Manager App

A fullstack web application for managing tasks with a clean, responsive interface. Built with React (frontend), Node.js + Express (backend), and MongoDB (database).

![TaskFlow App](https://img.shields.io/badge/TaskFlow-Task%20Manager-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=flat-square&logo=mongodb)

## 🚀 Features

- ✅ Create tasks with title, description, and status
- 📋 View all tasks in a responsive list
- 🔄 Update task status (Pending/Completed)
- ✏️ Edit task details inline
- 🗑️ Delete tasks with confirmation
- 🔍 Filter tasks by status (All, Pending, Completed)
- 📊 Sort tasks by date, title, or status
- 📱 Fully responsive design
- ⚡ Real-time error handling and validation
- 🧪 Comprehensive test coverage

## 🛠️ Technologies

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **express-validator** - Request validation
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Frontend
- **React** - UI library
- **Axios** - HTTP client
- **CSS3** - Custom styling with responsive design

### Testing
- **Jest** - Testing framework
- **Supertest** - HTTP assertion library
- **React Testing Library** - React component testing

## 📁 Project Structure

```
TaskFlow – Simple Task Manager App/
├── backend/                    # Backend Node.js application
│   ├── config/
│   │   └── database.js        # MongoDB connection
│   ├── controllers/
│   │   └── taskController.js  # Task business logic
│   ├── middleware/
│   │   └── validation.js      # Input validation rules
│   ├── models/
│   │   └── Task.js           # Task data model
│   ├── routes/
│   │   └── taskRoutes.js     # API routes
│   ├── __tests__/            # Backend tests
│   │   ├── models/
│   │   └── task.test.js
│   ├── .gitignore
│   ├── .env.example          # Environment variables template
│   ├── package.json
│   └── server.js             # Entry point
├── Frontend/                  # React frontend application
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskForm.js   # Task creation form
│   │   │   ├── TaskList.js   # Task list with filters
│   │   │   ├── TaskItem.js   # Individual task component
│   │   │   └── ErrorMessage.js # Error display component
│   │   ├── services/
│   │   │   └── api.js        # API service layer
│   │   ├── __tests__/        # Frontend tests
│   │   │   ├── components/
│   │   │   └── App.test.js
│   │   ├── App.js            # Main app component
│   │   ├── App.css          # App-specific styles
│   │   ├── index.js         # React entry point
│   │   ├── index.css        # Global styles
│   │   └── setupTests.js    # Test configuration
│   ├── .gitignore
│   ├── .env.example          # Environment variables template
│   └── package.json
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (v5 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/TaskFlow-Manager.git
   cd TaskFlow-Manager
   ```

2. **Set up the Backend**
   ```bash
   cd backend
   npm install
   
   # Copy environment variables
   cp .env.example .env
   
   # Edit .env with your MongoDB connection string
   # MONGODB_URI=mongodb://localhost:27017/taskflow
   # PORT=5000
   # NODE_ENV=development
   # FRONTEND_URL=http://localhost:3000
   ```

3. **Set up the Frontend**
   ```bash
   cd ../Frontend
   npm install
   
   # Copy environment variables
   cp .env.example .env
   
   # Edit .env if needed
   # REACT_APP_API_URL=http://localhost:5000/api
   # GENERATE_SOURCEMAP=false
   ```

4. **Start MongoDB**
   ```bash
   # If using MongoDB locally
   mongod
   
   # Or if using MongoDB service
   sudo systemctl start mongod
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

2. **Start the Frontend Development Server**
   ```bash
   cd Frontend
   npm start
   ```
   The frontend will run on `http://localhost:3000`

3. **Open your browser** and navigate to `http://localhost:3000`

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd Frontend
npm test
```

### Running Tests with Coverage
```bash
# Backend
cd backend
npm test -- --coverage

# Frontend
cd Frontend
npm test -- --coverage --watchAll=false
```

## 📡 API Endpoints

### Tasks
- `GET /api/tasks` - Retrieve all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Health Check
- `GET /api/health` - API health status

### Example API Usage

**Create a Task**
```javascript
POST /api/tasks
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive README and API documentation"
}
```

**Update Task Status**
```javascript
PUT /api/tasks/507f1f77bcf86cd799439011
Content-Type: application/json

{
  "status": "Completed"
}
```

## 🎨 Features in Detail

### Task Management
- **Create**: Add new tasks with title (required) and optional description
- **Read**: View all tasks with filtering and sorting options
- **Update**: Edit task details inline or change status
- **Delete**: Remove tasks with confirmation dialog

### User Interface
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Real-time Feedback**: Loading states, error messages, and success indicators
- **Intuitive Controls**: Clear buttons and forms with validation
- **Status Indicators**: Visual badges for task status and connection status

### Data Validation
- **Frontend**: Client-side validation with immediate feedback
- **Backend**: Server-side validation with detailed error messages
- **Sanitization**: Input trimming and length limits

## 🚀 Production Deployment

### Backend Deployment
1. Set up MongoDB Atlas or your preferred MongoDB hosting
2. Configure environment variables for production
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the production version:
   ```bash
   cd Frontend
   npm run build
   ```
2. Deploy the `build` folder to platforms like Netlify, Vercel, or GitHub Pages

### Environment Variables

**Backend (.env)**
```env
MONGODB_URI=your_production_mongodb_uri
PORT=5000
NODE_ENV=production
FRONTEND_URL=your_frontend_domain
```

**Frontend (.env)**
```env
REACT_APP_API_URL=your_backend_api_url
GENERATE_SOURCEMAP=false
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the excellent frontend library
- Express.js team for the robust backend framework
- MongoDB team for the flexible database solution
- All contributors who help improve this project

## 📞 Support

If you have any questions or need help with setup, please:
- Open an issue on GitHub
- Check the existing documentation
- Review the test files for usage examples

---

**Built with ❤️ by [Your Name]**

*Happy task managing! 📋✨*
