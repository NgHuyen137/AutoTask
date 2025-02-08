import logging
from pymongo.server_api import ServerApi
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config.mongodb import db_settings

class Database:
    mongo_client: AsyncIOMotorClient | None = None 
    database: AsyncIOMotorDatabase | None = None

    @staticmethod
    async def connect():
        logging.info("Starting the database...")
        Database.mongodb_client = AsyncIOMotorClient(db_settings.MONGODB_URI, server_api=ServerApi("1"))
        Database.database = Database.mongodb_client[db_settings.DB_NAME]
        ping_response = await Database.database.command("ping")
        
        if int(ping_response["ok"]) != 1:
            raise Exception("Problem connecting to database cluster.")
        else:
            logging.info("Connected to database cluster.")
    
    @staticmethod
    def close():
        logging.info("Closing the database...")
        Database.mongodb_client.close()
        logging.info("Closed the database successfully!")

    @staticmethod
    def get_db() -> AsyncIOMotorDatabase:
        return Database.database