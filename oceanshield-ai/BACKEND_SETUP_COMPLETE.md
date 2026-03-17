# OceanShield AI - Backend Setup & Deployment Status

## ✅ Current Status - Development Environment

### Servers Running
- **Frontend Dev Server**: http://localhost:5173/OceanShield-Digital-Twin/
- **Backend API Server**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

### Dependencies Fixed
All Python dependencies have been updated for Python 3.14 compatibility:
- `fastapi==0.135.1` (latest, full Python 3.14 support)
- `uvicorn==0.42.0` (latest with reload support)
- `pydantic==2.12.5` (latest with all pre-built wheels)
- `gunicorn==25.1.0` (production WSGI server)
- `python-multipart==0.0.22` (form parsing)

---

## 🌍 GitHub Pages Deployment (Already Done)

**Frontend is LIVE at**: https://shanmukha2006-max.github.io/OceanShield-Digital-Twin/

**Files already configured**:
- ✅ `vite.config.js` - base path set to `/OceanShield-Digital-Twin/`
- ✅ `package.json` - deploy scripts added
- ✅ `src/services/api.js` - Smart API URL resolution for both local & cloud
- ✅ `CORS in main.py` - GitHub Pages origin added

---

## 🚀 Next: Cloud Backend Deployment

### Why "Backend Error" appears on GitHub Pages:
- GitHub Pages is static hosting (can't access your localhost)
- **You MUST deploy the backend to a cloud service**

### Choose ONE of these hosting platforms:

#### **Option 1: Render.com (Recommended)**
1. Go to https://render.com (free tier available)
2. Create new Web Service
3. Connect your GitHub repository
4. Render auto-detects the `render.yaml` we created
5. Deploy (takes ~2 minutes)
6. Copy your URL: `https://your-service-name.onrender.com`

#### **Option 2: Railway.app**
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select your repo
4. Railway auto-detects FastAPI
5. Copy your Railway URL

#### **Option 3: PythonAnywhere**
1. Upload code to PythonAnywhere
2. Configure web app
3. Use their provided domain

---

## 🔧 Rebuilding Frontend for Production

Once your backend is deployed:

### Windows (PowerShell):
```powershell
cd frontend
$env:VITE_API_URL='https://your-backend-url.com'
npm run deploy
```

### Mac/Linux:
```bash
cd frontend
export VITE_API_URL='https://your-backend-url.com'
npm run deploy
```

---

## 📋 Files Modified for Production

| File | Change | Purpose |
|------|--------|---------|
| `frontend/vite.config.js` | Added `base: '/OceanShield-Digital-Twin/'` | GitHub Pages asset routing |
| `frontend/package.json` | Added `homepage` & deploy scripts | Deploy to GitHub Pages |
| `frontend/src/services/api.js` | Smart URL resolution | Local & cloud API switching |
| `backend/main.py` | Added GitHub Pages origin to CORS | Allow requests from GitHub Pages |
| `backend/requirements.txt` | Updated versions, added gunicorn | Python 3.14 compatibility |
| `render.yaml` | CREATED | Automatic Render deployment |

---

## 🎯 Production Checklist

- [x] Frontend built and deployed to GitHub Pages
- [x] API configuration supports environment variables
- [x] Backend CORS allows GitHub Pages origin  
- [x] Requirements.txt updated with all dependencies
- [x] Render.yaml created for cloud deployment
- [ ] **Deploy backend to Render/Railway** ← YOU ARE HERE
- [ ] Set VITE_API_URL environment variable
- [ ] Rebuild and redeploy frontend with backend URL

---

## 🆘 Troubleshooting

### "Backend Error" still showing?
1. Confirm backend deployed (GET https://your-backend-url.com/api/health)
2. Verify CORS configured in main.py
3. Rebuild frontend with environment variable set
4. Clear browser cache

### Backend won't start locally?
1. Check Python version: `python --version` (need 3.8+)
2. Install dependencies: `pip install -r requirements.txt`
3. Run: `python -m uvicorn main:app --host 0.0.0.0 --port 8000`

### Frontend won't deploy?
1. Ensure git is updated:  `git push`
2. Check build succeeds: `npm run build`
3. Run deploy: `npm run deploy`

---

## 📚 Quick Reference Commands

```bash
# Install backend dependencies (one-time only)
cd backend
pip install -r requirements.txt

# Run backend locally
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Run frontend locally
cd frontend
npm run dev

# Deploy frontend to GitHub Pages
cd frontend
npm run deploy

# Build only (don't deploy)
npm run build
```

---

## 🔗 Important URLs

- **Local Frontend**: http://localhost:5173/OceanShield-Digital-Twin/
- **Local Backend API**: http://localhost:8000
- **Local Docs**: http://localhost:8000/docs
- **GitHub Pages**: https://shanmukha2006-max.github.io/OceanShield-Digital-Twin/
- **Backend when deployed**: https://your-service.onrender.com (or railway, etc.)

---

## 📞 Next Steps

1. **Choose a backend host** (Render/Railway/PythonAnywhere)
2. **Deploy your backend** (5 minute setup)
3. **Get your backend URL**
4. **Set environment variable** and rebuild frontend
5. **Test at GitHub Pages URL** ← Done!

Good luck! 🚀
