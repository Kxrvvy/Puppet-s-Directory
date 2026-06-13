from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.auth import router as auth_router
from app.api.user import router as user_router
from app.api.products import router as products_router
from app.api.variants import router as variants_router
from app.api.restock import router as restock_router
from app.api.pos import router as pos_router
from app.api.notification import router as notif_router
from app.api.reports import router as reports_router
from app.api.dashboard import router as dashboard_router

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
app.include_router(user_router, prefix="/users", tags=["Users"])
app.include_router(products_router, prefix="/products", tags=["Products"])
app.include_router(variants_router, prefix="/product_variants", tags=["Product Variants"])
app.include_router(restock_router, prefix="/restock", tags=["Restock"])
app.include_router(pos_router, prefix="/pos", tags = ["POS"])
app.include_router(notif_router, prefix="/notification", tags = ["Low Stock Alert"])
app.include_router(reports_router, prefix="/reports", tags=["Reports"])
app.include_router(dashboard_router, prefix="/dashboard", tags=["Dashboard"])

@app.get("/", tags=["Root"])
async def root():
    return {"message": "Welcome to Puppet's Directory API!"}
