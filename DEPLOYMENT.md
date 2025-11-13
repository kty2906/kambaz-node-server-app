# Backend Deployment to Render.com

## Quick Start

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/kambaz-node-server-app.git
   git push -u origin main
   ```

2. **Deploy to Render**:
   - Go to [Render.com](https://render.com)
   - New → Web Service
   - Connect GitHub repo
   - Settings:
     - Build: `npm install`
     - Start: `npm start`
     - Plan: Free

3. **Environment Variables** (in Render dashboard):
   ```
   SERVER_ENV=production
   CLIENT_URL=https://your-vercel-app.vercel.app
   SERVER_URL=your-app-name.onrender.com
   SESSION_SECRET=your-super-secret-phrase
   PORT=10000
   ```

4. **After Frontend is Deployed**:
   - Update `CLIENT_URL` with your Vercel URL
   - Update `SERVER_URL` with your actual Render domain

## Testing

Visit: `https://your-app.onrender.com/lab5/welcome`

Should return: "Welcome to Lab 5"

