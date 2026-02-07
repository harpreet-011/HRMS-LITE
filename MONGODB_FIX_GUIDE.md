# 🔧 MongoDB Atlas - Database User Setup Fix

## Current Issue
```
❌ Connection failing: bad auth : Authentication failed.
❌ Frontend error: Failed to add employee: Network Error
✅ IP whitelist: Already configured (0.0.0.0/0)
```

## The Problem
The MongoDB user `ns28072005_db_user` either:
1. Does NOT exist yet
2. Has the wrong password
3. Doesn't have readWrite access to `hrms-lite` database

## Solution (3 Options)

### OPTION A: Create New User (If user doesn't exist)

**Steps:**
1. Go to: https://cloud.mongodb.com
2. Click **Database Access** (left sidebar)
3. Click **"+ ADD NEW DATABASE USER"** button
4. Fill in the form:
   - **Username**: `ns28072005_db_user`
   - **Password**: `TdKUJyYCHTbsAvCI`
   - **Authentication Method**: Password
   - **Database User Privileges**: 
     - Select database: `hrms-lite`
     - Role: `readWrite`
5. Click **"ADD USER"**
6. Wait for user to be created (takes ~5 minutes)
7. Then test connection: `python test_mongodb_connection.py`

### OPTION B: Reset Password (If user exists but wrong password)

**Steps:**
1. Go to: https://cloud.mongodb.com
2. Click **Database Access** (left sidebar)
3. Find user: `ns28072005_db_user`
4. Click the **"⋮" (three dots)** menu → **Edit Password**
5. Set password to: `TdKUJyYCHTbsAvCI`
6. Click **"Update Password"**
7. Wait 1-2 minutes
8. Then test connection: `python test_mongodb_connection.py`

### OPTION C: Fix Permissions (If user exists but missing access)

**Steps:**
1. Go to: https://cloud.mongodb.com
2. Click **Database Access** (left sidebar)
3. Find user: `ns28072005_db_user`
4. Click **"EDIT"** button
5. Under **"Database User Privileges"**:
   - Click **"Add Specific Privilege"**
   - Database: `hrms-lite`
   - Role: `readWrite`
   - Click **"Update User"**
6. Wait 1-2 minutes
7. Then test connection: `python test_mongodb_connection.py`

---

## Quick Decision Tree

**Do you know what's in MongoDB Atlas Database Access?**

If YES:
- Is the user `ns28072005_db_user` **listed**?
  - **NO** → Use **OPTION A** (Create user)
  - **YES** → Does it have `readWrite` on `hrms-lite`?
    - **NO** → Use **OPTION C** (Fix permissions)
    - **YES** → Use **OPTION B** (Reset password)

If NO:
- Send me a screenshot of Database Access page
- I'll tell you which option to follow

---

## Testing After Fix

After choosing an option above, run this to test:

```bash
cd backend
python test_mongodb_connection.py
```

**Expected output when fixed:**
```
✅ SUCCESS! MongoDB Atlas is connected and working!
Database: hrms_lite
Collections: ['employees', 'attendance']
```

---

## Current Credentials in `.env`
```
MONGO_URI=mongodb+srv://ns28072005_db_user:TdKUJyYCHTbsAvCI@cluster0.vk64j1w.mongodb.net/hrms-lite?retryWrites=true&w=majority
```

The system is expecting:
- Username: `ns28072005_db_user`
- Password: `TdKUJyYCHTbsAvCI`
- Database: `hrms-lite`
- Permission: `readWrite`

---

## Extra Help

### If you want to see all MongoDB users:
```bash
cd backend
python -c "
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()
uri = os.getenv('MONGO_URI')
try:
    client = MongoClient(uri)
    admin = client['admin']
    users = admin.command('usersInfo')
    for user in users.get('users', []):
        print(f\"User: {user['user']}\")
except Exception as e:
    print(f\"Error: {e}\")
"
```

### If credentials are REALLY wrong:
You can change `.env` to use a different user, or reset MongoDB entirely from MongoDB Atlas dashboard.

---

## Next Steps

1. **Take a screenshot of MongoDB Atlas > Database Access**
2. **Send screenshot to me OR**
3. **Tell me which option (A, B, or C) applies to you**
4. **Follow the steps**
5. **Run test command**
6. **Report if it worked**

🚀 **This should fix the issue!**
