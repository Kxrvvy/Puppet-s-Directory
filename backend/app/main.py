from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="Puppet's Directory API", 
    description="Inventory and Point-of-Sale Management System for Sampayan ni Puppet",
    version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

@app.get("/", tags=["Root"])
async def root():
    return {"message": "Welcome to Puppet's Directory API!"}
