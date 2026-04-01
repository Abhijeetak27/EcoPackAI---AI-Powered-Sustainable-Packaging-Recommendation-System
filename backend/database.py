import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "ecopackai")

client: AsyncIOMotorClient = None


async def connect_db():
    global client
    client = AsyncIOMotorClient(MONGO_URL)
    # Create TTL index on sessions so they auto-expire after 7 days
    await client[DB_NAME]["sessions"].create_index(
        "created_at", expireAfterSeconds=60 * 60 * 24 * 7
    )


async def close_db():
    global client
    if client:
        client.close()


def get_db():
    return client[DB_NAME]
