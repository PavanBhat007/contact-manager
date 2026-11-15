from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os

load_dotenv()

URI = os.getenv("MONGO_URI")
client = MongoClient(URI, server_api=ServerApi('1'))

try:
    client.admin.command('ping')
    print("MongoDB instance pinged successfully. Connected to MongoDB")
except Exception as e:
    print(e)


try:
    db = client.contact_db
    collection = db["contact_db"]
    print("Contact DB collection created or already exists")
except Exception as e:
    print(e)