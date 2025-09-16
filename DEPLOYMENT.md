# Wedding Planner - Deployment Guide

This guide covers deploying the Wedding Planner application using Docker and free hosting platforms.

## 🐳 Docker Setup

### Prerequisites
- Docker Desktop installed on Windows
- Git repository cloned locally

### Development Environment

1. **Clone and Setup:**
   ```bash
   git clone <your-repo-url>
   cd wedding-planner
   ```

2. **Environment Configuration:**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start Development Environment:**
   ```bash
   docker-compose up -d
   ```

4. **Access Services:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB Express: http://localhost:8081
   - MongoDB: localhost:27017

### Production Environment

1. **Build and Start Production:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

2. **Environment Variables for Production:**
   ```bash
   # Set these in your production environment
   MONGO_ROOT_USERNAME=your_secure_username
   MONGO_ROOT_PASSWORD=your_secure_password
   MAPBOX_ACCESS_TOKEN=your_mapbox_token
   REACT_APP_API_URL=https://your-backend-domain.com/api
   ```

## 🚀 Free Deployment Options

### Option 1: Railway (Recommended)

**Advantages:**
- Free tier with 500 hours/month
- Easy Docker deployment
- Built-in MongoDB
- Automatic HTTPS
- Custom domains

**Steps:**
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Connect your repository
4. Deploy backend service:
   - Select backend folder
   - Add environment variables
   - Deploy
5. Deploy frontend service:
   - Select frontend folder
   - Add environment variables
   - Deploy

**Environment Variables for Railway:**
```
NODE_ENV=production
MONGODB_URI=railway_mongodb_connection_string
MAPBOX_ACCESS_TOKEN=your_mapbox_token
```

### Option 2: Render

**Advantages:**
- Free tier available
- Automatic deployments from Git
- Built-in database options
- Custom domains

**Steps:**
1. Go to [Render.com](https://render.com)
2. Sign up and connect GitHub
3. Create new Web Service:
   - Connect repository
   - Use Docker configuration
   - Set environment variables
4. Create MongoDB database
5. Deploy both services

### Option 3: Vercel (Frontend) + Railway (Backend)

**Advantages:**
- Vercel excellent for React apps
- Railway great for Node.js APIs
- Both have generous free tiers

**Steps:**
1. Deploy backend to Railway (see Option 1)
2. Deploy frontend to Vercel:
   - Go to [Vercel.com](https://vercel.com)
   - Import GitHub repository
   - Set build command: `cd frontend && npm run build`
   - Set output directory: `frontend/build`
   - Add environment variables

## 🔧 Environment Variables

### Required Variables
```bash
# Database
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=secure_password
MONGODB_URI=mongodb_connection_string

# API
NODE_ENV=production
PORT=5000

# Mapbox (Optional)
MAPBOX_ACCESS_TOKEN=your_mapbox_token

# Frontend
REACT_APP_API_URL=https://your-backend-url.com/api
REACT_APP_MAPBOX_TOKEN=your_mapbox_token
```

## 📊 Monitoring and Maintenance

### Health Checks
- Backend: `GET /api/health`
- Frontend: `GET /health`

### Logs
```bash
# Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Production logs (Railway)
railway logs
```

### Database Backup
```bash
# MongoDB backup
docker exec wedding-planner-mongodb mongodump --out /backup
```

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use:**
   ```bash
   # Kill process using port
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```

2. **Docker Build Fails:**
   ```bash
   # Clean Docker cache
   docker system prune -a
   ```

3. **Environment Variables Not Loading:**
   - Check .env file exists
   - Verify variable names match exactly
   - Restart containers after changes

4. **Database Connection Issues:**
   - Verify MongoDB is running
   - Check connection string format
   - Ensure network connectivity

### Performance Optimization

1. **Docker Image Size:**
   - Use multi-stage builds
   - Remove dev dependencies
   - Use Alpine Linux base images

2. **Database Optimization:**
   - Add indexes for frequently queried fields
   - Use connection pooling
   - Monitor query performance

## 🔒 Security Best Practices

1. **Environment Variables:**
   - Never commit .env files
   - Use strong passwords
   - Rotate secrets regularly

2. **Docker Security:**
   - Use non-root users
   - Keep base images updated
   - Scan for vulnerabilities

3. **Database Security:**
   - Use authentication
   - Enable SSL/TLS
   - Regular backups

## 📈 Scaling

### Horizontal Scaling
- Use load balancers
- Multiple backend instances
- Database clustering

### Vertical Scaling
- Increase container resources
- Optimize database queries
- Use CDN for static assets

## 🆘 Support

For issues and questions:
1. Check this documentation
2. Review Docker logs
3. Check platform-specific documentation
4. Create GitHub issue with details

