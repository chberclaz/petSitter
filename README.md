# PetSitter - Pet Sitting Web Application

PetSitter is a comprehensive web application that connects pet owners with pet sitters. This platform allows users to create profiles, register their pets, set availability for pet sitting, create sitting requests, and apply to fulfill sitting requests.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Local Development and Testing](#local-development-and-testing)
  - [Setting Up Local Environment](#setting-up-local-environment)
  - [Running Locally](#running-locally)
  - [Test Data Generation](#test-data-generation)
- [Usage Guide](#usage-guide)
  - [For Pet Owners](#for-pet-owners)
  - [For Pet Sitters](#for-pet-sitters)
  - [For Administrators](#for-administrators)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Features

- **User Management**

  - Registration and authentication
  - Profile management with certifications and work experience uploads
  - Public profile pages for pet sitters

- **Pet Management**

  - Detailed pet profiles with health information
  - Support for multiple pets per user
  - Pet attributes including animal type, breed, age, allergies, diet, etc.

- **Availability System**

  - Calendar-based availability slots
  - Maximum pets per slot configuration
  - Pet type preferences for each availability slot

- **Request System**

  - Create sitting requests for pets
  - Apply to sitting requests as a sitter
  - Complete assignments and leave reviews

- **Admin Features**
  - User management
  - Certificate verification
  - System statistics and monitoring

## Technology Stack

- **Frontend**: React, Material-UI
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based auth
- **File Storage**: AWS S3 for production, local storage for development

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm (v6+) or yarn (v1.22+)
- PostgreSQL (v12+)
- Git

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/petsitter.git
cd petsitter
```

2. **Set up the backend**

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create environment file from example
cp .env.example .env.local

# Edit .env.local with your database credentials and other settings
# For local development, the default settings should work if you have PostgreSQL installed
```

3. **Set up the frontend**

```bash
# Navigate to the frontend directory
cd ../frontend

# Install dependencies
npm install

# Create environment file from example
cp .env.example .env.local
```

4. **Set up the database**

```bash
# Navigate back to the backend directory
cd ../backend

# Initialize the database with Prisma
npx prisma migrate dev --name init

# This will create all the necessary tables in your database
```

### Running the Application

1. **Start the backend server**

```bash
# In the backend directory
npm run dev

# The server will start on http://localhost:5000
# You should see: "Server running on port 5000 in development mode"
```

2. **Start the frontend development server**

```bash
# In a new terminal, navigate to the frontend directory
cd frontend

# Start the development server
npm start

# The frontend will start on http://localhost:3000
# Your browser should automatically open to this address
```

3. **Access the application**

Open your browser and navigate to:

```bash
npm start
```

The application should now be running at `http://localhost:3000`.

## Database Setup

The application uses PostgreSQL with Prisma ORM. The database schema includes tables for:

- Users
- Pets
- Certificates
- Work Experiences
- Availability Slots
- Sitting Requests
- Sitting Assignments

The initial migration will create all necessary tables.

## AWS S3 Setup

1. Create an AWS account if you don't have one
2. Create an S3 bucket for storing certificate files
3. Create an IAM user with programmatic access and S3 permissions
4. Add the access key, secret key, region, and bucket name to your `.env` file

## User Guide

### For Pet Owners

1. **Registration and Profile Setup**

   - Sign up for an account
   - Complete your profile with personal information
   - Add your professional certificates (if applicable)
   - Add your work experience (if applicable)

2. **Adding Pets**

   - Navigate to "My Pets" section
   - Click "Add Pet"
   - Fill in all pet details including animal type, breed, age, etc.
   - Save the pet profile

3. **Creating a Sitting Request**

   - Navigate to "My Requests" section
   - Click "Create Request"
   - Select the pet that needs sitting
   - Specify the start and end dates/times
   - Add any special notes or instructions
   - Submit the request

4. **Managing Requests**
   - View all your requests in the "My Requests" section
   - Check the status of each request (pending, accepted, completed)
   - Leave reviews for completed sittings

### For Pet Sitters

1. **Setting Availability**

   - Navigate to "My Availability" section
   - Click "Add Availability"
   - Select dates and times when you're available for pet sitting
   - Specify how many pets you can handle at once
   - Select which pet types you're willing to sit for
   - Save your availability slots

2. **Finding Sitting Opportunities**

   - Check the dashboard for available sitting requests that match your availability
   - View pet and owner details
   - Apply for requests you're interested in

3. **Managing Assignments**
   - View all your accepted sitting assignments in the "My Assignments" section
   - Mark assignments as completed when finished
   - View reviews from pet owners

### For Administrators

1. **Accessing Admin Panel**

   - Log in with an admin account
   - Navigate to the Admin Dashboard

2. **Managing Users**

   - View all users
   - Promote users to admin status if needed

3. **Verifying Certificates**

   - Review pending certificate verifications
   - Approve or reject certificates

4. **Monitoring System**
   - View system statistics
   - Monitor sitting requests and assignments

## Deployment

### Backend Deployment

1. Set up a PostgreSQL database (AWS RDS, Heroku Postgres, etc.)
2. Deploy the Node.js backend to a cloud provider (AWS, Heroku, DigitalOcean, etc.)
3. Configure environment variables for database connection, JWT secret, and AWS S3 credentials

### Frontend Deployment

1. Build the React application: `npm run build`
2. Deploy the static files to a hosting service (Netlify, Vercel, AWS S3 + CloudFront, etc.)
3. Configure the API URL to point to your deployed backend

## Troubleshooting

- **Database Connection Issues**: Ensure your PostgreSQL server is running and the connection string in `.env` is correct
- **S3 Upload Errors**: Verify your AWS credentials and bucket permissions
- **JWT Authentication Errors**: Check that your JWT_SECRET is properly set

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Local Development and Testing

### Setting Up Local Environment

#### Prerequisites for Local Development

- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn

#### 1. Database Setup

You can either use a local PostgreSQL installation or run PostgreSQL in Docker:

**Option A: Local PostgreSQL**

1. Install PostgreSQL on your machine
2. Create a new database:

   ```
   createdb petsitter
   ```

3. Update your `.env.local` file with your database credentials:

```
DATABASE_URL="postgresql://yourusername:yourpassword@localhost:5432/petsitter"
```

**Option B: PostgreSQL in Docker**

1. Install Docker on your machine
2. Run PostgreSQL container:

   ```bash
   docker run --name petsitter-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=petsitter -p 5432:5432 -d postgres:13
   ```

3. Your `.env.local` file should contain:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/petsitter"
```

#### 2. Local File Storage (Instead of AWS S3)

For local development, you can use local file storage instead of AWS S3:

```bash
# Create upload directories
mkdir -p backend/uploads/certificates
mkdir -p backend/uploads/profile-images
```

#### 3. Backend Setup for Local Testing

```bash
cd backend

# Install dependencies
npm install

# Create a .env file for local development
cp .env.example .env.local
```

Edit the `.env.local` file with the following content:

```
# Database
DATABASE_URL="postgresql://yourusername:yourpassword@localhost:5432/petsitter"

# JWT
JWT_SECRET="local-development-secret-key"
JWT_EXPIRES_IN="7d"

# File Storage - Local Development
NODE_ENV="development"
UPLOAD_DIR="./uploads"

# Server
PORT=5000
```

### Running the Application Locally

#### 1. Start the Backend

```bash
cd backend
npm run dev
```

The backend will start on http://localhost:5000

#### 2. Start the Frontend

```bash
cd frontend
npm start
```

The frontend will start on http://localhost:3000

### Local Testing Features

#### Mock Data Generation

You can generate mock data for testing purposes:

```bash
cd backend
npm run seed
```

This will create:

- 5 test users (including 1 admin)
- 10 pets of various types
- Sample availability slots
- Sample sitting requests

#### Test User Accounts

After running the seed script, you can use these test accounts:

1. **Admin User**:

   - Email: admin@example.com
   - Password: password123

2. **Regular Users**:
   - Email: user1@example.com through user4@example.com
   - Password: password123

#### Testing File Uploads

When running in development mode, files will be stored locally in the `backend/uploads` directory and served via the Express static middleware.

### Switching Between Local and Production Configurations

You can easily switch between local and production configurations by changing the environment variables:

```bash
# For local testing
export NODE_ENV=development

# For production-like testing
export NODE_ENV=production
```

When NODE_ENV is set to 'development', the application will:

- Use local file storage instead of AWS S3
- Show more detailed error messages
- Enable CORS for all origins

You should see the PetSitter home page. You can now register a new account or use one of the test accounts if you've generated test data.
