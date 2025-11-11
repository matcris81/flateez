# Deployment Guide for Vercel

This guide will help you deploy the Rental Connect application to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. Vercel CLI installed: `npm install -g vercel`
3. A MongoDB Atlas account for the database (https://www.mongodb.com/cloud/atlas)

## Step 1: Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user with a password
4. Whitelist all IP addresses (0.0.0.0/0) for Vercel
5. Get your connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/rental-connect`)

## Step 2: Deploy Backend (API)

### Option A: Deploy from CLI

1. Navigate to the project root:
```bash
cd /path/to/your/project
```

2. Deploy the backend:
```bash
vercel --prod
```

3. Set environment variables in Vercel dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add these variables:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: A random secure string (e.g., generate with `openssl rand -base64 32`)
     - `NODE_ENV`: `production`
     - `PORT`: `3000`

### Option B: Deploy from GitHub

1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your repository
4. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: Leave as `.` (root)
   - **Build Command**: `cd server && npm install && npm run build`
   - **Output Directory**: `server/dist`
   - **Install Command**: `npm install`

5. Add environment variables (same as above)

## Step 3: Deploy Frontend

1. Update the API URL in your frontend:

Create `client/.env.production`:
```
VITE_API_URL=https://your-backend-url.vercel.app
```

2. Update `client/src/api/client.ts`:
```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
});
```

3. Deploy the frontend:

### Option A: From CLI
```bash
cd client
vercel --prod
```

### Option B: From GitHub (Recommended)

1. Create a new Vercel project for the frontend
2. Import your repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. Add environment variable:
   - `VITE_API_URL`: Your backend Vercel URL (e.g., `https://your-api.vercel.app`)

## Step 4: Seed the Database

After deployment, seed your database:

1. Clone your repo locally
2. Update `server/.env` with your production MongoDB URI
3. Run:
```bash
cd server
npm run seed
```

## Alternative: Deploy as Monorepo

If you want to deploy both frontend and backend together:

1. Update `vercel.json` in the root:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "server/src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/src/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "client/$1"
    }
  ]
}
```

2. Deploy:
```bash
vercel --prod
```

## Important Notes

1. **CORS**: Make sure your backend allows requests from your frontend domain
2. **Environment Variables**: Never commit `.env` files to Git
3. **MongoDB**: Use MongoDB Atlas (cloud) instead of local MongoDB
4. **Build Time**: First deployment may take a few minutes

## Troubleshooting

### Backend Issues
- Check Vercel function logs in the dashboard
- Ensure MongoDB connection string is correct
- Verify all environment variables are set

### Frontend Issues
- Check that `VITE_API_URL` points to your backend
- Ensure CORS is configured correctly on the backend
- Check browser console for errors

### Database Connection
- Whitelist all IPs (0.0.0.0/0) in MongoDB Atlas
- Use the correct connection string format
- Test connection locally first

## Post-Deployment

1. Test all features:
   - User registration/login
   - Property listings
   - Renter profiles
   - Messaging

2. Run the seed script to populate data

3. Monitor logs in Vercel dashboard

## Custom Domain (Optional)

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

## Support

For issues, check:
- Vercel Documentation: https://vercel.com/docs
- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com/
