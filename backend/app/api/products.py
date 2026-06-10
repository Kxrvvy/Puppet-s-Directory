from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models.product import Product
from app.dependencies import require_staff, require_admin
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse

router = APIRouter()

@router.post("/", summary="Add a new product", description="Admin only. Creates a new product.")
async def add_product(
    product_data: ProductCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(require_admin)
) -> ProductResponse:
    
    result = await db.execute(select(Product).where(Product.item_name == product_data.item_name))
    existing_product = result.scalar_one_or_none()
    
    if existing_product:
        raise HTTPException(status_code=400, detail="Product with this name already exists.")
    
    new_product = Product(
        item_name=product_data.item_name,
        desciption=product_data.desciption,
        base_price=product_data.base_price,
        category=product_data.category,
        image_url=product_data.image_url,
        status=product_data.status
    )
    
    db.add(new_product)
    await db.commit()
    await db.refresh(new_product)
    
    return new_product
    
@router.get("/", summary="Get All Products", description="Returns a list of all products.")
async def get_all_products(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(require_staff)
) -> list[ProductResponse]:
    
    result = await db.execute(select(Product))
    products = result.scalars().all()
    
    return products

@router.get("/{product_id}", summary="Get Product by ID", description="Returns a product by its ID.")
async def get_product(
    product_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(require_staff)
) -> ProductResponse:
    
    result = await db.execute(select(Product).where(Product.product_id == product_id))
    product = result.scalar_one_or_none()
    
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found.")
    
    return product
