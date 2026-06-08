from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.auth import router as auth_router


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

app.include_router(auth_router, prefix="/auth", tags=["Authentication"])

@app.get("/", tags=["Root"])
async def root():
    return {"message": "Welcome to Puppet's Directory API!"}
