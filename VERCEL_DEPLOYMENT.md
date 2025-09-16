# Vercel Deployment Guide for Wedding Planner

This guide will help you deploy your Wedding Planner application on Vercel.

## 🚀 Deployment Strategy

Since Vercel is optimized for frontend applications, we'll use a hybrid approach:
- **Frontend**: Deploy on Vercel (React app)
- **Backend**: Deploy on Railway or Render (Node.js API)
- **Database**: MongoDB Atlas (already configured)

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **MongoDB Atlas**: Already configured ✅
4. **Mapbox Token**: Already configured ✅

## 🔧 Step 1: Deploy Backend (Railway - Recommended)

### Why Railway for Backend?
- Free tier with 500 hours/month
- Easy deployment from GitHub
- Built-in environment variable management
- Automatic HTTPS

### Deploy Backend to Railway:

1. **Go to Railway.app**
   - Visit [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your wedding-planner repository

3. **Configure Backend Service**
   - Select the `backend` folder
   - Railway will auto-detect it's a Node.js app
   - Add environment variables:
     ```
     NODE_ENV=production
     MONGODB_URI=mongodb+srv://saink4831_db_user:Wedding@suresh-wedding.autdlq2.mongodb.net/wedding_planner?retryWrites=true&w=majority&appName=Suresh-Wedding
     MAPBOX_ACCESS_TOKEN=pk.eyJ1Ijoic3VyZXNoYmFyYWNoMjAwMSIsImEiOiJjbWYzcDh5a3MwMGV0MmtzNDQ3ODlkY3p6In0.OVdVP7rRea7wK1UEn1OSfw
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Note the generated URL (e.g., `https://your-app.railway.app`)

## 🎨 Step 2: Deploy Frontend on Vercel

### Deploy Frontend:

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"

2. **Import Repository**
   - Connect your GitHub account
   - Select your wedding-planner repository
   - Click "Import"

3. **Configure Frontend Build**
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

4. **Environment Variables**
   Add these environment variables in Vercel:
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app/api
   REACT_APP_MAPBOX_TOKEN=pk.eyJ1Ijoic3VyZXNoYmFyYWNoMjAwMSIsImEiOiJjbWYzcDh5a3MwMGV0MmtzNDQ3ODlkY3p6In0.OVdVP7rRea7wK1UEn1OSfw
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be available at `https://your-app.vercel.app`

## 🔄 Alternative: Deploy Both on Vercel

If you prefer to use Vercel for both frontend and backend:

### Backend on Vercel:
1. Create a new Vercel project
2. Select the `backend` folder
3. Add environment variables
4. Deploy

### Frontend on Vercel:
1. Create another Vercel project
2. Select the `frontend` folder
3. Set environment variables with backend URL
4. Deploy

## ⚙️ Configuration Files

### Frontend Vercel Config (`frontend/vercel.json`):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "https://your-backend-url.railway.app/api",
    "REACT_APP_MAPBOX_TOKEN": "your_mapbox_token"
  }
}
```

### Backend Vercel Config (`backend/vercel.json`):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production",
    "MONGODB_URI": "your_mongodb_connection_string",
    "MAPBOX_ACCESS_TOKEN": "your_mapbox_token"
  }
}
```

## 🔧 Environment Variables

### Frontend (Vercel):
- `REACT_APP_API_URL`: Your backend API URL
- `REACT_APP_MAPBOX_TOKEN`: Your Mapbox access token

### Backend (Railway/Vercel):
- `NODE_ENV`: production
- `MONGODB_URI`: MongoDB Atlas connection string
- `MAPBOX_ACCESS_TOKEN`: Your Mapbox access token

## 🚀 Quick Deploy Commands

### Using Vercel CLI:

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy Backend**:
   ```bash
   cd backend
   vercel --prod
   ```

3. **Deploy Frontend**:
   ```bash
   cd frontend
   vercel --prod
   ```

## 🔍 Testing Your Deployment

### Health Checks:
- **Backend**: `https://your-backend-url.railway.app/api/health`
- **Frontend**: `https://your-app.vercel.app`

### Test API Endpoints:
```bash
# Test backend health
curl https://your-backend-url.railway.app/api/health

# Test API endpoints
curl https://your-backend-url.railway.app/api/locations
```

## 🔄 Continuous Deployment

Both Vercel and Railway support automatic deployments:
- Push to `main` branch → Automatic deployment
- Push to other branches → Preview deployments

## 🛠️ Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in package.json
   - Verify Node.js version compatibility

2. **API Connection Issues**:
   - Verify backend URL in frontend environment variables
   - Check CORS configuration in backend
   - Ensure backend is deployed and running

3. **Environment Variables**:
   - Double-check variable names (case-sensitive)
   - Ensure all required variables are set
   - Redeploy after changing environment variables

4. **MongoDB Connection**:
   - Verify MongoDB Atlas IP whitelist
   - Check connection string format
   - Ensure database user has proper permissions

### Debug Commands:
```bash
# Check Vercel deployment status
vercel ls

# View deployment logs
vercel logs [deployment-url]

# Check environment variables
vercel env ls
```

## 📊 Monitoring

### Vercel Analytics:
- Built-in analytics for frontend
- Performance monitoring
- Error tracking

### Railway Monitoring:
- Application logs
- Resource usage
- Health checks

## 🔒 Security Considerations

1. **Environment Variables**:
   - Never commit sensitive data to Git
   - Use Vercel/Railway environment variable management
   - Rotate secrets regularly

2. **CORS Configuration**:
   - Configure CORS to allow only your frontend domain
   - Update CORS settings in backend

3. **MongoDB Security**:
   - Use strong passwords
   - Enable IP whitelisting
   - Use SSL/TLS connections

## 🎯 Next Steps

1. **Deploy Backend** to Railway
2. **Deploy Frontend** to Vercel
3. **Test** both deployments
4. **Configure Custom Domain** (optional)
5. **Set up Monitoring** and alerts

## 📞 Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **MongoDB Atlas**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)

Your Wedding Planner app will be live and accessible worldwide! 🌍
