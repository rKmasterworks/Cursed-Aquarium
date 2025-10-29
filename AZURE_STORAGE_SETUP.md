# 🔧 Azure Blob Storage Setup - Fix Data Persistence

## The Problem
Azure Functions are **stateless** - they don't keep files when they restart (every ~20 minutes). This is why your passwords and shop items keep resetting!

**Solution:** Use Azure Blob Storage to save data permanently.

---

## 📋 Setup Steps

### Step 1: Create Azure Storage Account

1. Go to **Azure Portal**: https://portal.azure.com
2. Click **"Create a resource"**
3. Search for **"Storage account"**
4. Click **Create**

**Configuration:**
- **Subscription:** Your subscription
- **Resource Group:** Same as your Static Web App (or create new)
- **Storage account name:** `cursedaquariumdata` (must be unique, lowercase, no spaces)
- **Region:** Same as your Static Web App (e.g., West Europe)
- **Performance:** Standard
- **Redundancy:** LRS (Locally Redundant Storage) - cheapest option

5. Click **"Review + Create"** → **Create**
6. Wait for deployment to complete

---

### Step 2: Get Connection String

1. Go to your new Storage Account
2. In left menu, click **"Access keys"**
3. Under **key1**, click **"Show"** next to **Connection string**
4. Click **Copy** icon to copy the full connection string

It looks like:
```
DefaultEndpointsProtocol=https;AccountName=cursedaquariumdata;AccountKey=LONG_KEY_HERE;EndpointSuffix=core.windows.net
```

---

### Step 3: Add Connection String to Static Web App

1. Go to your **Static Web App** in Azure Portal
2. In left menu, click **"Configuration"**
3. Under **"Application settings"**, click **"+ Add"**
4. Add new setting:
   - **Name:** `AZURE_STORAGE_CONNECTION_STRING`
   - **Value:** Paste the connection string you copied
5. Click **OK**
6. Click **Save** at the top

---

### Step 4: Deploy Updated Code

The code is already updated to use Azure Blob Storage! Just push to GitHub:

```powershell
cd "c:\Projects\Cursed Aquarium"
git add .
git commit -m "Add Azure Blob Storage for persistent data"
git push
```

The GitHub Actions workflow will automatically deploy the update.

---

## ✅ How It Works Now

### Local Development (No Azure Setup)
- Uses `data.json` file as before
- Changes save locally while testing

### Azure Production (After Setup)
- **Automatically uses Azure Blob Storage**
- Creates container: `cursed-aquarium-data`
- Saves data in blob: `data.json`
- **Data persists forever** - survives restarts, redeployments, everything!

---

## 🔍 Verify It's Working

After deployment:

1. Go to your Storage Account → **Containers**
2. You should see: `cursed-aquarium-data`
3. Click it → you should see: `data.json`
4. Click `data.json` → **Download** to view current data

---

## 💰 Cost

**Azure Storage Account (Free Tier):**
- First 5 GB: **FREE**
- Your `data.json` is ~1 KB
- Operations: First 20,000 reads/month **FREE**
- **Total cost:** $0.00/month for your use case

---

## 🆘 Troubleshooting

### "Data still resets after 20 minutes"
- Check that you added `AZURE_STORAGE_CONNECTION_STRING` in Static Web App → Configuration
- Make sure you clicked **Save** after adding the setting
- Redeploy by pushing a new commit

### "Can't see the container"
- Wait a few minutes after first deployment
- The container is created automatically on first API call
- Try logging in to trigger API calls

### "Connection string doesn't work"
- Make sure you copied the **full connection string** (not just the key)
- Check for extra spaces or missing characters
- Try regenerating key1 and copying again

---

## 🎯 Next Steps

1. ✅ Create Storage Account
2. ✅ Copy connection string
3. ✅ Add to Static Web App Configuration
4. ✅ Push updated code
5. ✅ Test that changes persist after 30+ minutes

Your passwords and shop items will now **never reset**! 🎉
