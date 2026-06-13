from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.models import Product, ProductVariant, RestockHistory, SalesInvoice, Transaction, User
from datetime import datetime, timedelta, timezone
from app.api.reports import generate_report
from app.dependencies import require_admin
from app.database import get_db


router = APIRouter()

@router.get("/admin-dashboard", summary="Admin Dashboard Overview", description="Shows the overall information of the sales, product, and account")
async def admin_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_admin)
):

    #Inventory 
    #Tota products
    total_product_entries = await db.execute(select(Product))
    products = total_product_entries.scalars().all()
    total_product = len(products)
    
    # total variants
    variant_entries = await db.execute(select(ProductVariant))
    variants = variant_entries.scalars().all()
    total_variants = len(variants)
    
    # Inactive Products
    inactive_entries = await db.execute(select(Product)
                                        .where(Product.status == "inactive"))
    inactive = inactive_entries.scalars().all()
    total_inactive = len(inactive)
    
    # Low Stock Count
    low_stock = await db.execute(select(ProductVariant)
                                 .where(ProductVariant.quantity_in_stock <= ProductVariant.stock_threshold))
    stock = low_stock.scalars().all()
    total_low_stock = len(stock)
    
    # daily sales
    start_date = datetime.now(timezone.utc) - timedelta(days=1)
    daily_data = await generate_report(db, start_date, "daily")
    
    todays_sale = daily_data["total_sales"]
    todays_transaction = daily_data["total_transaction"]
    top_items = daily_data["top_items"]
    
    
    # staff
    staff_entries = await db.execute(select(User).where(User.role == "staff"))
    staff = staff_entries.scalars().all()
    total_staff = len(staff)
    
    # Recent Transaction
    recent_tx_result = await db.execute(select(Transaction)
                                        .order_by(Transaction.purchased_at.desc())
                                        .limit(5))
    recent_transactions = recent_tx_result.scalars().all()
    
    # Low Stock Alert
    low_stock_alert_result = await db.execute(select(ProductVariant)
                                .options(selectinload(ProductVariant.product))
                                .where(ProductVariant.quantity_in_stock <= ProductVariant.stock_threshold))
    
    low_stock_alerts = low_stock_alert_result.scalars().all()

    low_stock_list = []
    for variant in low_stock_alerts:
        low_stock_list.append({
            "variant_id": variant.variant_id,
            "product_name": variant.product.item_name,
            "size": variant.size,
            "color": variant.color,
            "quantity_in_stock": variant.quantity_in_stock,
            "stock_threshold": variant.stock_threshold
        })
        
        
    return {
        "inventory": {
            "total_products": total_product,
            "total_variants": total_variants,
            "inactive_products": total_inactive,
            "low_stock_count": total_low_stock
        },
        "sales_today": {
            "total_sales": todays_sale,
            "total_transactions": todays_transaction,
            "top_items": top_items
        },
        "staff": {
            "total_staff": total_staff,
            "staff_list": [
                {
                    "user_id": s.user_id,
                    "username": s.username,
                    "email": s.email,
                    "created_at": s.created_at
                }
                for s in staff
            ]
        },
        "recent_transactions": [
            {
                "transaction_id": tx.transaction_id,
                "payment_method": tx.payment_method,
                "total_amount": tx.total_amount,
                "purchased_at": tx.purchased_at
            }
            for tx in recent_transactions
        ],
        "low_stock_alerts": low_stock_list
    }
        
    
    
