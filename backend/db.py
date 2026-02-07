import os
import urllib.parse
from dotenv import load_dotenv
# Prefer using certifi on hosted platforms so OpenSSL has a proper CA bundle
try:
	import certifi
	CA_BUNDLE = certifi.where()
except Exception:
	CA_BUNDLE = None
from pymongo import MongoClient
from pymongo.errors import OperationFailure

load_dotenv()

# Load URI from environment (Atlas SRV or local)
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

# Create client with a short server selection timeout so failures are detected quickly
def make_client(uri):
	opts = {"serverSelectionTimeoutMS": 5000, "connectTimeoutMS": 10000, "socketTimeoutMS": None}
	if CA_BUNDLE:
		opts["tls"] = True
		opts["tlsCAFile"] = CA_BUNDLE
	return MongoClient(uri, **opts)

# Try creating a client and verify with a lightweight ping
client = make_client(MONGO_URI)
try:
	client.admin.command("ping")
except OperationFailure as e:
	# Authentication failed — attempt to URL-encode password and reconnect if possible
	try:
		if "@" in MONGO_URI and ":" in MONGO_URI.split("@", 1)[0]:
			# uri like scheme://user:pass@host/...
			prefix, rest = MONGO_URI.split("://", 1)
			creds, host_and_more = rest.split("@", 1)
			user, pwd = creds.split(":", 1)
			encoded_pwd = urllib.parse.quote_plus(pwd)
			rebuilt = f"{prefix}://{user}:{encoded_pwd}@{host_and_more}"
			client = make_client(rebuilt)
			# re-raise if still failing
			client.admin.command("ping")
	except Exception:
		# Keep original client — operations will surface the auth error later
		pass
except Exception:
	# Any other error (network, DNS) will be surfaced when operations are attempted
	pass

# Prefer the database specified in the URI (if any). Fall back to a known name.
try:
	db = client.get_default_database()
except Exception:
	db = client["hrms_lite"]

# Collections
employees_col = db["employees"]
attendance_col = db["attendance"]

# Export client for startup tests
__all__ = ["employees_col", "attendance_col", "client", "db"]

