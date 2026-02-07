# 🔧 MongoDB Atlas Connection - Troubleshooting Guide

## ❌ Current Status
**Authentication Failed**: bad auth

## ✅ Solution: MongoDB Atlas Configuration

The error indicates one of these issues:
1. **IP Address Not Whitelisted** (Most Common)
2. Wrong username or password
3. User lacks database permissions
4. Network connectivity issue

---

## 🔐 STEP 1: Fix IP Whitelist

### Method 1: Allow All IPs (Testing Only)
1. Go to https://cloud.mongodb.com
2. Login with your credentials
3. Click **"Cluster0"** (Your cluster name)
4. Go to **"Network Access"** tab
5. Click **"Edit"** on the IP whitelist rule
6. Change to **`0.0.0.0/0`** (allows all IPs)
7. Click **"Confirm"**
8. Wait 1-2 minutes for changes to apply

### Method 2: Add Your Current IP
1. Go to https://cloud.mongodb.com
2. Click **"Cluster0"**
3. Go to **"Network Access"** tab
4. Click **"Add IP Address"**
5. Click **"Use Current IP Address"**
6. Click **"Confirm"**
7. Wait 1-2 minutes

---

## 👤 STEP 2: Verify User Credentials

1. Go to https://cloud.mongodb.com
2. Click **"Database Access"** (left sidebar)
3. Find user **`ns28072005_db_user`**
4. Verify the password matches: `TdKUJyYCHTbsAvCI`
5. If unsure, click **"Edit"**, set a new password, and update `.env`

---

## 📋 STEP 3: Verify Database Permissions

1. Go to https://cloud.mongodb.com
2. Click **"Database Access"**
3. Click **"Edit"** on the user `ns28072005_db_user`
4. Under **"Database User Privileges"**, ensure:
   - **Database**: `hrms-lite` 
   - **Role**: `readWrite` (at minimum)
5. Click **"Update User"**

---

## 🧪 STEP 4: Test Connection

After making changes, wait **1-2 minutes** then run:

```bash
cd backend
python test_mongodb_connection.py
```

---

## ✨ STEP 5: If Still Not Working

### Try with Simplified URI (Fallback)
If the atlas connection fails, try connecting to a local MongoDB first:

Edit `backend/.env`:
```
MONGO_URI=mongodb://localhost:27017
```

Then start local MongoDB (if available):
```bash
mongod
```

### Or Try with Different Account
1. Create a new database user in MongoDB Atlas
2. Use that username/password in the URI
3. Ensure that user has access to `hrms-lite` database

---

## 📝 Connection String Format

Your current connection string:
```
mongodb+srv://ns28072005_db_user:TdKUJyYCHTbsAvCI@cluster0.vk64j1w.mongodb.net/hrms-lite?retryWrites=true&w=majority
```

**Breakdown:**
- **Protocol**: `mongodb+srv://` (correct for Atlas)
- **Username**: `ns28072005_db_user` ✓
- **Password**: `TdKUJyYCHTbsAvCI` ✓
- **Host**: `cluster0.vk64j1w.mongodb.net` ✓
- **Database**: `hrms-lite` ✓
- **Options**: `retryWrites=true&w=majority` ✓

---

## 🚀 After Fixing Connection

1. Restart the backend server:
   ```bash
   python main.py
   ```

2. Test the API:
   ```
   http://localhost:8000/docs
   ```

3. Try adding an employee to test the database write

---

## 📞 Quick Checklist

- [ ] MongoDB Atlas IP whitelist updated (0.0.0.0/0 or your IP)
- [ ] Database user `ns28072005_db_user` exists
- [ ] User has `readWrite` access to `hrms-lite`
- [ ] `.env` file has the connection string
- [ ] Waited 1-2 minutes after making Atlas changes
- [ ] Restarted backend server
- [ ] Test script passes

---

## 🆘 Still Not Working?

1. **Verify credentials in MongoDB Atlas:**
   - User: `ns28072005_db_user`
   - Check Database Access section

2. **Check IP whitelist:**
   - Go to Network Access
   - Should see 0.0.0.0/0 or your IP

3. **Test with MongoDB Compass:**
   - Download from https://www.mongodb.com/products/compass
   - Paste your connection string
   - If Compass connects, the issue is with the app

4. **Check server logs:**
   ```bash
   python main.py
   ```
   - Look for connection errors

5. **Try fallback to local MongoDB:**
   - Use `mongodb://localhost:27017` in `.env`

---

## ✅ Expected Result

When fixed, you should see:
```
=== MongoDB Atlas Connection Test ===
URI: mongodb+srv://ns28072005_db_user:...

URI Components:
  Protocol: mongodb+srv
  Username: ns28072005_db_user
  Password: ****************
  Host: cluster0.vk64j1w.mongodb.net/hrms-lite...

Attempting connection...
✓ MongoDB Atlas connection SUCCESSFUL
✓ Server Connected: True
✓ Server info: 7.0.0
✓ Database: hrms-lite accessible
✓ Collections found: 2
  Collections: ['attendance', 'employees']
✓ Collections accessible
  - employees: 0 documents
  - attendance: 0 documents

✅ SUCCESS! MongoDB Atlas is connected and working!
```

---

## 📚 Related Documentation

- [MongoDB Atlas Network Access](https://docs.mongodb.com/manual/reference/atlas-network-access/)
- [MongoDB Atlas Database Users](https://docs.mongodb.com/manual/reference/atlas-database-users/)
- [Connection String Formats](https://docs.mongodb.com/manual/reference/connection-string/)

---

**Do the steps above and let me know if it works!**
