# OceanShield AI - Production Deployment Guide

## Current Status
- ✅ **Frontend**: Deployed to GitHub Pages at `https://shanmukha2006-max.github.io/OceanShield-Digital-Twin/`
- ⏳ **Backend**: Not yet deployed (local only)

---

## 🚫 Why You're Seeing "Backend Error"

The GitHub Pages frontend cannot communicate with your local backend because:
- GitHub Pages is static hosting (runs in users' browsers)
- Browsers can't access `http://localhost:8000` from a remote HTTPS site
- The backend **must be deployed to a cloud service**

---

## ✅ SOLUTION: Deploy Backend to Cloud

### Option 1: Render.com (Recommended - Free Tier)
1. **Push your code to GitHub**
2. **Go to [Render.com](https://render.com)**
3. **Create new Web Service**:
   - Connect your GitHub repository
   - Use the `render.yaml` file we created
   - Set environment variables if needed
   - Deploy
4. **Copy your Render URL** (e.g., `https://oceanshield-ai.onrender.com`)

### Option 2: Railway.app
1. **Push code to GitHub**
2. **Go to [Railway.app](https://railway.app)**
3. **New Project → Deploy from GitHub**
4. **Select your repository**
5. **Railway auto-detects FastAPI setup**
6. **Copy your Railway URL**

### Option 3: PythonAnywhere (Alternative)
- Free tier allows hosting Python apps
- Upload code and set up web service
- Get your domain

---

## 🔧 Rebuild Frontend with Backend URL

Once your backend is deployed, rebuild the frontend:

```bash
cd frontend

# Set the backend URL (replace with your actual URL)
set VITE_API_URL=https://your-backend-url.com

# Or on Mac/Linux:
# export VITE_API_URL=https://your-backend-url.com

# Build and deploy
npm run deploy
```

---

## 🧪 Testing Locally (Without Cloud Deployment)

If you want to test the full app locally:

1. **Start the backend in one terminal:**
```bash
cd backend
python main.py
```

2. **In another terminal, start the frontend dev server:**
```bash
cd frontend
npm run dev
```

3. **Visit `http://localhost:5173`** in your browser
   - The frontend will automatically use `http://localhost:8000` for the backend
   - Everything should work! ✅

---

## 📝 Configuration Files

| File | Purpose | Status |
|------|---------|--------|
| `frontend/vite.config.js` | Vite config with GitHub Pages base | ✅ Updated |
| `frontend/package.json` | Deploy scripts | ✅ Updated |
| `frontend/src/services/api.js` | Dynamic API URL resolution | ✅ Updated |
| `backend/main.py` | CORS middleware with GitHub Pages origin | ✅ Updated |
| `backend/requirements.txt` | Dependencies with gunicorn | ✅ Updated |
| `render.yaml` | Render.com deployment config | ✅ Created |

---

## 🎯 Next Steps

1. **Deploy backend to Render/Railway** (takes ~5 minutes)
2. **Get your backend URL** (e.g., `https://oceanshield-ai.onrender.com`)
3. **Rebuild frontend:**
   ```bash
   cd frontend
   set VITE_API_URL=https://your-backend-url.com
   npm run deploy
   ```
4. **Visit GitHub Pages URL** and enjoy! 🚀

---

## 🆘 Troubleshooting

### Still seeing "Backend Error"?
- Check that backend is running (GET `https://your-backend-url.com/api/health`)
- Verify CORS is configured in `backend/main.py`
- Clear browser cache (Ctrl+Shift+Delete)

### Backend not responding?
- Check cloud service logs
- Verify `requirements.txt` is installed
- Ensure service is running (not in "build" state)

### CORS error?
Already fixed in `main.py` - allows:
- `http://localhost:*`
- `https://shanmukha2006-max.github.io`

---

## 📞 Support
For questions, check:
- [Render Docs](https://render.com/docs)
- [Railway Docs](https://docs.railway.app)
- [FastAPI CORS Docs](https://fastapi.tiangolo.com/tutorial/cors/)
