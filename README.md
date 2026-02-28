# 🎓 Admission Management System

A comprehensive full-stack web application designed to streamline and automate the admission process for educational institutions. This system provides role-based access control for administrators, students, verifiers, and accountancy staff to manage admissions efficiently.

## ✨ Features

### 🔐 Role-Based Access Control
- **Admin**: Manage users, assign roles, oversee the entire admission process
- **Student**: Register, submit documents, track admission status
- **Verifier**: Review and verify student documents and credentials
- **Accountancy**: Manage payment records, track fee submissions, approve/reject payment proofs
- **CSAB Integration**: Handle CSAB allotment data and student assignments

### 📋 Core Functionalities
- User authentication and authorization with JWT
- Document upload and verification system
- Payment tracking and management
- CSV bulk import for CSAB allotment data
- Cloud-based document storage with Cloudinary
- Real-time status tracking for admission stages
- Comprehensive dashboard for each role
- Responsive and modern UI design

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer with Cloudinary integration
- **CSV Processing**: csv-parser
- **Environment Variables**: dotenv

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Radix UI Components
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local installation or MongoDB Atlas account)
- **Cloudinary** account for file storage
- **Git** for version control

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/admission-management-system.git
cd admission-management-system
```

### 2. Backend Setup

#### Navigate to Backend Directory
```bash
cd Backend
```

#### Install Dependencies
```bash
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `Backend` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

#### Start Backend Server
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

#### Navigate to Frontend Directory
```bash
cd ../Frontend
```

#### Install Dependencies
```bash
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `Frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:5000
```

#### Start Frontend Development Server
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
Admission-Management-System/
├── Backend/
│   ├── index.js              # Entry point
│   ├── src/
│   │   ├── app.js            # Express app configuration
│   │   ├── config/
│   │   │   └── db.js         # MongoDB connection
│   │   ├── controllers/      # Route controllers
│   │   │   ├── admin.controller.js
│   │   │   ├── auth.controller.js
│   │   │   ├── student.controller.js
│   │   │   ├── verifier.controller.js
│   │   │   ├── accountancy.controller.js
│   │   │   └── csab.controller.js
│   │   ├── middlewares/      # Custom middlewares
│   │   │   ├── authMiddleware.js
│   │   │   ├── roleMiddleware.js
│   │   │   ├── upload.js
│   │   │   └── uploadCsv.js
│   │   ├── models/           # Mongoose schemas
│   │   │   ├── user.model.js
│   │   │   ├── studentProfile.model.js
│   │   │   └── CsabAllotment.model.js
│   │   ├── routes/           # API routes
│   │   │   ├── auth.routes.js
│   │   │   ├── admin.routes.js
│   │   │   ├── student.routes.js
│   │   │   ├── verifier.routes.js
│   │   │   ├── accountancy.routes.js
│   │   │   └── csab.routes.js
│   │   ├── services/         # Business logic
│   │   │   └── assignment.services.js
│   │   └── utils/            # Utility functions
│   │       ├── cloudinary.js
│   │       ├── createAdmin.js
│   │       └── token.js
│   └── uploads/              # Temporary upload storage
│
├── Frontend/
│   ├── src/
│   │   ├── main.tsx          # Entry point
│   │   ├── App.tsx           # Root component
│   │   ├── components/       # Reusable components
│   │   │   ├── ui/           # Shadcn UI components
│   │   │   └── landing/      # Landing page sections
│   │   ├── pages/            # Page components
│   │   │   ├── Index.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Admin/
│   │   │   ├── Students/
│   │   │   ├── Verifier/
│   │   │   └── Accountancy/
│   │   ├── lib/
│   │   │   ├── api.ts        # API client configuration
│   │   │   └── utils.ts      # Utility functions
│   │   └── hooks/            # Custom React hooks
│   └── public/               # Static assets
│
└── README.md                 # This file
```

## 🌐 Deployment

### Backend Deployment (Render/Heroku/Railway)

1. **Prepare for Deployment**
   - Ensure all environment variables are set in your hosting platform
   - Update CORS settings to include your frontend domain

2. **Deploy to Render**
   ```bash
   # Connect your GitHub repository
   # Set build command: npm install
   # Set start command: npm start
   # Add environment variables from .env file
   ```

3. **Update Frontend Environment**
   ```env
   VITE_API_BASE_URL=https://your-backend-domain.onrender.com
   ```

### Frontend Deployment (Vercel/Netlify)

1. **Build the Frontend**
   ```bash
   cd Frontend
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   ```

3. **Deploy to Netlify**
   ```bash
   # Install Netlify CLI
   npm i -g netlify-cli
   
   # Deploy
   netlify deploy --prod --dir=dist
   ```

4. **Configure Environment Variables**
   - Add `VITE_API_BASE_URL` in your hosting platform's environment settings

## 🔑 Default Admin Credentials

On first run, an admin account can be created using the utility script:

```bash
cd Backend
node src/utils/createAdmin.js
```

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Admin Endpoints
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete user

### Student Endpoints
- `GET /api/student/profile` - Get student profile
- `PUT /api/student/profile` - Update student profile
- `POST /api/student/documents` - Upload documents

### Verifier Endpoints
- `GET /api/verifier/students` - Get students for verification
- `PUT /api/verifier/students/:id/verify` - Verify student documents

### Accountancy Endpoints
- `GET /api/accountancy/payments` - Get payment records
- `PUT /api/accountancy/payments/:id` - Update payment status

### CSAB Endpoints
- `POST /api/csab/upload` - Upload CSAB CSV data
- `GET /api/csab/allotments` - Get allotment data

## 🧪 Testing

```bash
# Backend tests
cd Backend
npm test

# Frontend tests
cd Frontend
npm test
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Radix UI for the component library
- Tailwind CSS for styling utilities
- Cloudinary for file storage
- MongoDB for database services

## 📧 Contact

For any queries or support, please contact:
- Email: your.email@example.com
- GitHub: [@yourusername](https://github.com/yourusername)

---

<div align="center">
Made with ❤️ for educational institutions
</div>
