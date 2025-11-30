# SkillSwap Deployment Guide

This guide walks you through deploying SkillSwap to production using **Vercel** (frontend) and **Render** (backend).

---

## 📋 Prerequisites

Before deploying, ensure you have:

1. **GitHub Account** - Code pushed to a GitHub repository
2. **MongoDB Atlas Account** - Production database (you already have this!)
3. **Vercel Account** - Free at [vercel.com](https://vercel.com)
4. **Render Account** - Free at [render.com](https://render.com)

---

## 🗄️ Step 1: Prepare MongoDB Atlas for Production

Your MongoDB Atlas cluster is already set up. Just ensure:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Navigate to **Network Access**
3. Click **Add IP Address**
4. Select **Allow Access from Anywhere** (0.0.0.0/0)
   - This is required for Render/Vercel to connect
5. Copy your connection string for later

---

## 🚀 Step 2: Deploy Backend to Render

### Option A: One-Click Deploy (Recommended)

1. Go to [render.com](https://render.com) and sign up/login
2. Click **New** → **Web Service**
3. Connect your GitHub account
4. Select the **SkillSwap** repository
5. Configure the service:

| Setting | Value |
|---------|-------|
| **Name** | `skillswap-api` |
| **Root Directory** | `server` |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node src/server.js` |
| **Plan** | `Free` |

6. Add **Environment Variables**:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | `mongodb+srv://...` (your Atlas connection string) |
| `JWT_SECRET` | (click "Generate" for a random secret) |
| `JWT_REFRESH_SECRET` | (click "Generate" for a random secret) |
| `JWT_EXPIRE` | `15m` |
| `JWT_REFRESH_EXPIRE` | `7d` |
| `CLIENT_URL` | `https://skillswap-YOUR_USERNAME.vercel.app` |

7. Click **Create Web Service**
8. Wait for deployment (takes 2-5 minutes)
9. Copy your backend URL: `https://skillswap-api.onrender.com`

---

## 🌐 Step 3: Deploy Frontend to Vercel

### Option A: Via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click **Add New** → **Project**
3. Import your **SkillSwap** GitHub repository
4. Configure the project:

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Vite` |
| **Root Directory** | `client` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

5. Add **Environment Variables**:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://skillswap-api.onrender.com/api` |

6. Click **Deploy**
7. Wait for deployment (takes 1-2 minutes)
8. Your app is live at: `https://skillswap-YOUR_USERNAME.vercel.app`

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to client folder
cd client

# Deploy
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: skillswap
# - Directory: ./
# - Override settings? No

# Set environment variable
vercel env add VITE_API_URL production
# Enter: https://skillswap-api.onrender.com/api

# Deploy to production
vercel --prod
```

---

## 🔄 Step 4: Update Backend CORS

After deploying the frontend, update the backend's `CLIENT_URL`:

1. Go to Render Dashboard → Your Service → Environment
2. Update `CLIENT_URL` to your actual Vercel URL
3. Click **Save Changes** (service will restart automatically)

---

## ✅ Step 5: Test Your Deployment

1. Visit your Vercel URL: `https://skillswap-xxx.vercel.app`
2. Try to:
   - View the home page
   - Browse skills
   - Register a new account
   - Login with a demo account
   - View skill details
   - Access dashboard

### Troubleshooting

**Issue: API calls failing**
- Check browser console for errors
- Verify `VITE_API_URL` is set correctly
- Check Render logs for backend errors

**Issue: CORS errors**
- Ensure `CLIENT_URL` in Render matches your Vercel URL exactly
- Include `https://` in the URL

**Issue: MongoDB connection failed**
- Verify connection string is correct
- Check IP whitelist in Atlas (should be 0.0.0.0/0)

---

## 🔧 Environment Variables Summary

### Backend (Render)

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/skillswap
JWT_SECRET=your-random-secret-32-chars-min
JWT_REFRESH_SECRET=your-random-refresh-secret-32-chars-min
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
CLIENT_URL=https://skillswap.vercel.app
MAX_FILE_SIZE=5242880
```

### Frontend (Vercel)

```env
VITE_API_URL=https://skillswap-api.onrender.com/api
```

---

## 📊 Monitoring & Logs

### Render (Backend)
- Dashboard → Your Service → Logs
- Real-time logs and error tracking

### Vercel (Frontend)
- Dashboard → Your Project → Deployments → Functions
- Analytics available on Pro plan

---

## 🔄 Continuous Deployment

Both Vercel and Render automatically deploy when you push to your main branch:

```bash
git add .
git commit -m "Update feature"
git push origin main
# ✨ Automatic deployment triggered!
```

---

## 💰 Cost Breakdown

| Service | Plan | Cost |
|---------|------|------|
| MongoDB Atlas | M0 (Free) | $0/month |
| Render | Free | $0/month |
| Vercel | Hobby | $0/month |
| **Total** | | **$0/month** |

### Free Tier Limitations

**Render Free:**
- Service spins down after 15 min of inactivity
- First request after idle takes ~30 seconds
- 750 hours/month

**Vercel Hobby:**
- 100GB bandwidth/month
- Serverless function limits apply

---

## 🚀 Upgrading for Production

For a production app with real users:

1. **Render Starter** ($7/month) - No spin-down, better performance
2. **MongoDB Atlas M10** ($57/month) - Better performance, backups
3. **Vercel Pro** ($20/month) - Analytics, more bandwidth
4. **Custom Domain** - Add your own domain to both services

---

## 📝 Quick Deploy Checklist

- [ ] MongoDB Atlas IP whitelist set to 0.0.0.0/0
- [ ] Backend deployed to Render
- [ ] Environment variables set in Render
- [ ] Frontend deployed to Vercel
- [ ] `VITE_API_URL` set in Vercel
- [ ] `CLIENT_URL` updated in Render
- [ ] Test registration and login
- [ ] Test API calls (browse skills, etc.)

---

## 🆘 Need Help?

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com

---

**Congratulations! Your SkillSwap app is now live! 🎉**
