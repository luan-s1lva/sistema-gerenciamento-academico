import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

BD_URL = os.getenv("MONGO_URI")
BD_NAME = os.getenv("MONGO_DB_NAME")

client = MongoClient(BD_URL)
bd = client[BD_NAME]

#TABELAS
users = bd["users"]
users = bd["courses"]
users = bd["classes"]
users = bd["quizzes"]
users = bd["submissions"]