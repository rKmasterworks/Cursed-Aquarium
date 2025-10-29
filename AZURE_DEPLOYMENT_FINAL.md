# 🚀 Azure Static Web Apps Deployment - FINAL GUIDE

## ✅ What We've Done

I've converted your entire backend to **Azure Functions** so it works with Azure Static Web Apps!

### Changes Made:
1. ✅ Converted Express.js API → Azure Functions (in `/api` folder)
2. ✅ Created 8 Azure Functions: auth, schedule, shop, roster, balances, permissions, passwords, purchases
3. ✅ Updated all frontend API URLs from `http://localhost:3001/api` to `/api` (works automatically in Azure)
4. ✅ Added `staticwebapp.config.json` for routing
5. ✅ Backed up old Express API to `api-express-backup`

---

## 🎯 Deployment Steps (15 minutes)

### Step 1: Push to GitHub

```powershell
cd "C:\Projects\Cursed Aquarium"

# Initialize git if not already
git init

# Create .gitignore
@"
node_modules/
dist/
.env
*.log
.DS_Store
api-express-backup/
"@ | Out-File -FilePath .gitignore -Encoding utf8

# Add all files
git add .
git commit -m "Convert to Azure Static Web Apps with Functions"

# Create GitHub repo and push
# Go to github.com/new, create repo called 'cursed-aquarium'
git remote add origin https://github.com/YOUR_USERNAME/cursed-aquarium.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy via Azure Portal (EASIEST)

1. Go to https://portal.azure.com
2. Click "Create a resource"
3. Search for "Static Web App"
4. Click "Create"

**Fill in the form:**

- **Subscription:** Your subscription
- **Resource Group:** `rg-naudzius` (or create new)
- **Name:** `cursed-aquarium`
- **Plan type:** **Free**
- **Region:** West Europe 2

**Deployment details:**

- **Source:** GitHub
- Click "Sign in with GitHub" and authorize
- **Organization:** Your GitHub username
- **Repository:** `cursed-aquarium`
- **Branch:** `main`

**Build Details:**

- **Build Presets:** Vite
- **App location:** `/`
- **Api location:** `api`
- **Output location:** `dist`

5. Click **Review + create**
6. Click **Create**

### Step 3: Wait for Deployment (2-3 minutes)

- Azure will automatically build and deploy your app
- GitHub Actions will run automatically
- You'll see the URL once it's done

### Step 4: Get Your URL

Once deployed, your app will be available at:
```
https://cursed-aquarium.azurestaticapps.net
```

Or check in Azure Portal:
- Go to your Static Web App resource
- Look for "URL" in the Overview page

---

## Alternative: Deploy via Azure CLI

```powershell
# Login
az login

# Create Static Web App
az staticwebapp create \
  --name cursed-aquarium \
  --resource-group rg-naudzius \
  --source https://github.com/YOUR_USERNAME/cursed-aquarium \
  --location "WestEurope" \
  --branch main \
  --app-location "/" \
  --api-location "api" \
  --output-location "dist" \
  --login-with-github
```

---

## 📊 Cost & Limits

### Azure Static Web Apps FREE Tier:
- ✅ **Cost:** $0/month
- ✅ **Bandwidth:** 100 GB/month
- ✅ **API Calls:** 1 million/month
- ✅ **SSL:** Free & automatic
- ✅ **Custom Domains:** Included
- ✅ **24/7 uptime:** Yes!

**Perfect for your team!** No sleeping, always available.

---

## 🧪 Testing Your Deployment

### 1. Test the API directly:
```
https://cursed-aquarium.azurestaticapps.net/api/schedule
```
Should return: `[]` (empty array)

### 2. Test the frontend:
```
https://cursed-aquarium.azurestaticapps.net
```

### 3. Login:
- Username: `main dps`
- Password: `main dps`

### 4. Try all features:
- ✅ View schedule
- ✅ Check MVP shop
- ✅ Access admin panel
- ✅ Add schedule event
- ✅ Manage points
- ✅ Change permissions

---

## 🔄 Making Updates

Every time you push to GitHub, Azure automatically redeploys!

```powershell
# Make changes to your code
git add .
git commit -m "Added new feature"
git push

# Azure GitHub Actions automatically builds and deploys!
# Check progress: github.com/YOUR_USERNAME/cursed-aquarium/actions
```

---

## 🐛 Troubleshooting

### Issue: API returns 404
**Fix:** Make sure `api-location` is set to `api` in Static Web App config

### Issue: Frontend shows blank page
**Fix:** Check browser console for errors, ensure build completed successfully

### Issue: Login not working
**Fix:** 
1. Check `/api/auth/login` directly in browser
2. Verify `data.json` is in the `api` folder
3. Check GitHub Actions logs for errors

### Issue: "Module not found" errors
**Fix:** Run `npm install` in the `api` folder locally, commit `package-lock.json`

```powershell
cd api
npm install
cd ..
git add api/package-lock.json
git commit -m "Add package-lock.json"
git push
```

---

## 📱 Share with Your Team

Once deployed, share this URL with your team:
```
https://cursed-aquarium.azurestaticapps.net
```

They can:
- ✅ Access from any device
- ✅ Use their role login (tank/tank, etc.)
- ✅ View schedule and shop
- ✅ Admins can manage everything

---

## 🎉 You're Done!

Your app is now:
- ✅ Hosted on Azure (100% Azure solution!)
- ✅ Running 24/7 with no sleep
- ✅ FREE forever (Free tier)
- ✅ Auto-deploys from GitHub
- ✅ Has free SSL certificate
- ✅ Accessible to your whole team

**Total cost: $0/month** 💰

---

## Next Steps

1. **Custom Domain** (Optional):
   - Go to Azure Portal → Your Static Web App → Custom domains
   - Add your own domain if you have one

2. **Monitor Usage**:
   - Azure Portal → Your Static Web App → Metrics
   - See bandwidth, API calls, errors

3. **View Logs**:
   - Azure Portal → Your Static Web App → Log Stream
   - Real-time function logs

4. **GitHub Actions**:
   - github.com/YOUR_USERNAME/cursed-aquarium/actions
   - See deployment history and logs

---

## Need Help?

If you get stuck:
1. Check GitHub Actions logs for build errors
2. Check Azure Portal → Function Logs
3. Test API endpoints directly in browser
4. Check browser console for frontend errors

---

🎮 **Your Cursed Aquarium app is now live on Azure!** 🐠

Share it with your team and start managing those scrims! 🚀
