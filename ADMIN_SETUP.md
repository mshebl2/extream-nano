# Xtreme Nano - Admin Panel Setup

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/xtreme-nano?retryWrites=true&w=majority

# JWT Secret Key for Admin Authentication
JWT_SECRET_KEY=your-super-secure-secret-key-change-this-in-production

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create the `.env.local` file with your MongoDB connection string and admin credentials.

3. Run the development server:
```bash
npm run dev
```

4. Access the admin panel at: http://localhost:3000/admin

## Admin Panel Features

The admin panel includes:

- **Dashboard**: Overview of site statistics
- **Services Management**: Add, edit, and delete car care services (with Arabic/English support)
- **Site Images**: Update hero banners and section images
- **Settings**: Manage contact information and general site settings

## MongoDB Setup

You need a MongoDB database. You can use:
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier available)
- Local MongoDB installation

## File Structure

```
├── app/
│   ├── admin/
│   │   ├── login/           # Admin login page
│   │   └── (dashboard)/     # Protected dashboard pages
│   │       ├── services/    # Services management
│   │       ├── site-images/ # Site images management
│   │       └── settings/    # Site settings
│   └── api/
│       ├── admin/           # Auth API routes
│       ├── services/        # Services CRUD API
│       ├── settings/        # Settings API
│       └── site-images/     # Site images API
├── components/
│   └── admin/               # Admin panel components
├── lib/
│   ├── auth.ts              # JWT authentication utilities
│   └── db.ts                # MongoDB connection
└── models/                  # Mongoose models
    ├── Service.ts
    ├── Setting.ts
    └── SiteImage.ts
```
