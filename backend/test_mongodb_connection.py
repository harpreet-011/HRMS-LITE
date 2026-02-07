import os
from dotenv import load_dotenv
from pymongo import MongoClient
import urllib.parse

load_dotenv()
uri = os.getenv('MONGO_URI')
print('=== MongoDB Atlas Connection Test ===')
print(f'URI: {uri[:60]}...' if uri else 'No URI found')
print()

# Extract credentials from URI for debugging
try:
    if uri:
        print('URI Components:')
        # Parse the connection string
        if '://' in uri:
            protocol, rest = uri.split('://', 1)
            print(f'  Protocol: {protocol}')
            
            if '@' in rest:
                creds, host_db = rest.split('@', 1)
                user, pwd = creds.split(':', 1)
                print(f'  Username: {user}')
                print(f'  Password: {"*" * len(pwd)}')
                print(f'  Host: {host_db[:50]}...')
except Exception as e:
    print(f'  Could not parse URI: {e}')

print()
print('Attempting connection...')

try:
    # Test basic connection
    client = MongoClient(uri, serverSelectionTimeoutMS=10000, connectTimeoutMS=10000)
    
    # This will trigger the actual connection (use ping)
    result = client.admin.command('ping')
    print('MongoDB Atlas connection SUCCESSFUL')
    print(f'Server responded to ping: {result.get("ok") == 1}')
    
    # Try to access the database. Prefer the DB in the URI, otherwise fall back.
    try:
        db = client.get_default_database()
    except Exception:
        db = client['hrms_lite']
    collections = db.list_collection_names()
    print(f'Database accessible (collections found: {len(collections)})')
    if collections:
        print(f'  Collections: {collections}')
    else:
        print('  (No collections yet - will be created on first insert)')
    
    # Test operations
    employees_col = db['employees']
    attendance_col = db['attendance']
    
    emp_count = employees_col.count_documents({})
    att_count = attendance_col.count_documents({})
    
    client.close()
    print('\nSUCCESS: MongoDB Atlas is connected and working!')
    print(f'  Collections accessible (employees: {emp_count}, attendance: {att_count})')
    
except Exception as e:
    error_str = str(e)
    print('Connection FAILED')
    print(f'  Error: {error_str}')

    # If auth failed, attempt a retry with URL-encoded password (common cause when
    # the password contains special characters that need percent-encoding).
    try:
        if 'bad auth' in error_str.lower() and uri and '@' in uri and '://' in uri:
            print('\nDetected authentication error — attempting retry with URL-encoded password...')
            prefix, rest = uri.split('://', 1)
            creds, host_and_more = rest.split('@', 1)
            user, pwd = creds.split(':', 1)
            encoded_pwd = urllib.parse.quote_plus(pwd)
            rebuilt = f"{prefix}://{user}:{encoded_pwd}@{host_and_more}"

            # Try again with encoded password
            client = MongoClient(rebuilt, serverSelectionTimeoutMS=10000, connectTimeoutMS=10000)
            retry_result = client.admin.command('ping')
            if retry_result.get('ok') == 1:
                print('Retry succeeded: connection OK using URL-encoded password.')
                db = client.get_default_database() or client['hrms_lite']
                collections = db.list_collection_names()
                print(f'  Collections found after retry: {len(collections)}')
                client.close()
            else:
                print('Retry attempt did not return OK from server.')
    except Exception as e2:
        print(f'Retry FAILED: {e2}')

    print()
    print('Possible causes:')
    print('  1. Wrong username or password')
    print('  2. IP address not whitelisted in MongoDB Atlas')
    print('  3. User does not have access to hrms-lite database')
    print('  4. Network connectivity issue')
    print()
    print('To fix:')
    print('  1. Log into MongoDB Atlas (https://cloud.mongodb.com)')
    print('  2. Go to your cluster')
    print('  3. Check Database Access > Database Users')
    print('  4. Check Network Access > IP Whitelist')
    print('  5. Ensure your IP is whitelisted (or use 0.0.0.0/0 for testing)')

