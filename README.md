# petSitter

Start the frontend development server:

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
