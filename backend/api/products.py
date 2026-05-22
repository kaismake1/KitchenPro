from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from backend.db import get_db
from backend.models.orm import Product, ProductImage
from backend.services.search import get_product_with_images, search_products

router = APIRouter(prefix="/api/products", tags=["products"])


class ProductResponse(BaseModel):
    id: int
    name: str
    description: str
    price: float
    category: str
    brand: str
    stock: int
    status: str
    rating: float
    reviews: int
    badge: str
    attributes: dict
    images: list


class ProductCreateUpdate(BaseModel):
    name: str
    description: str
    price: float
    category: str
    stock: int
    status: str
    image: str = None
    brand: str = ""


class ProductDetailResponse(BaseModel):
    id: int
    name: str
    description: str
    price: float
    category: str
    brand: str
    stock: int
    status: str
    rating: float
    reviews: int
    badge: str
    attributes: dict
    images: list

    class Config:
        from_attributes = True


@router.get("/", response_model=list)
def list_products(
    page: int = 0,
    size: int = 20,
    db: Session = Depends(get_db)
):
    """List all products with pagination."""
    query = db.query(Product)
    total = query.count()
    products = query.offset(page * size).limit(size).all()

    result = []
    for p in products:
        result.append({
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "price": p.price,
            "category": p.category,
            "brand": p.brand,
            "stock": p.stock,
            "status": p.status,
            "rating": p.rating,
            "reviews": p.reviews,
            "badge": p.badge,
            "attributes": p.attributes,
            "image": p.images[0].image_url if p.images else None,
            "images": [
                {
                    "image_url": img.image_url,
                    "is_primary": img.is_primary
                }
                for img in p.images
            ] if p.images else [],
        })

    return result


@router.get("/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Get product details with images."""
    product = get_product_with_images(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.get("/search/query")
def search(
    q: str = "",
    brand: str = None,
    min_price: float = None,
    max_price: float = None,
    category: str = None,
    page: int = 0,
    size: int = 20,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    db: Session = Depends(get_db)
):
    """
    Advanced search with fuzzy matching, filters, and sorting.
    - q: search query (fuzzy match on name/description)
    - brand, min_price, max_price, category: exact filters
    - sort_by: "created_at", "price", "rating"
    - sort_order: "asc", "desc"
    """
    products, total = search_products(
        db=db,
        query=q,
        brand=brand,
        min_price=min_price,
        max_price=max_price,
        category=category,
        page=page,
        size=size,
        sort_by=sort_by,
        sort_order=sort_order,
    )

    result = []
    for p in products:
        result.append({
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "price": p.price,
            "category": p.category,
            "brand": p.brand,
            "stock": p.stock,
            "status": p.status,
            "rating": p.rating,
            "reviews": p.reviews,
            "badge": p.badge,
            "image": p.images[0].image_url if p.images else None,
        })

    return {"data": result, "total": total, "page": page, "size": size}


# CREATE: Add new product
@router.post("/", response_model=dict)
def create_product(
    product_data: ProductCreateUpdate,
    db: Session = Depends(get_db)
):
    """Create a new product."""
    try:
        # Create product
        new_product = Product(
            name=product_data.name,
            description=product_data.description,
            price=product_data.price,
            category=product_data.category,
            brand=product_data.brand or "",
            stock=product_data.stock,
            status=product_data.status,
            rating=0,
            reviews=0,
            badge=None,
            attributes={}
        )
        db.add(new_product)
        db.flush()  # Get the product ID
        
        # Add image if provided
        if product_data.image:
            product_image = ProductImage(
                product_id=new_product.id,
                image_url=product_data.image,
                is_primary=True,
                order=0
            )
            db.add(product_image)
        
        db.commit()
        db.refresh(new_product)
        
        # Return product data
        return {
            "id": new_product.id,
            "name": new_product.name,
            "description": new_product.description,
            "price": new_product.price,
            "category": new_product.category,
            "brand": new_product.brand,
            "stock": new_product.stock,
            "status": new_product.status,
            "rating": new_product.rating,
            "reviews": new_product.reviews,
            "badge": new_product.badge,
            "image": product_data.image or "",
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


# UPDATE: Update existing product
@router.put("/{product_id}", response_model=dict)
def update_product(
    product_id: int,
    product_data: ProductCreateUpdate,
    db: Session = Depends(get_db)
):
    """Update an existing product."""
    try:
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Update product fields
        product.name = product_data.name
        product.description = product_data.description
        product.price = product_data.price
        product.category = product_data.category
        product.brand = product_data.brand or ""
        product.stock = product_data.stock
        product.status = product_data.status
        
        # Update or add image
        if product_data.image:
            # Remove old images
            for img in product.images:
                db.delete(img)
            
            # Add new image
            product_image = ProductImage(
                product_id=product.id,
                image_url=product_data.image,
                is_primary=True,
                order=0
            )
            db.add(product_image)
        
        db.commit()
        db.refresh(product)
        
        return {
            "id": product.id,
            "name": product.name,
            "description": product.description,
            "price": product.price,
            "category": product.category,
            "brand": product.brand,
            "stock": product.stock,
            "status": product.status,
            "rating": product.rating,
            "reviews": product.reviews,
            "badge": product.badge,
            "image": product_data.image or "",
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


# DELETE: Delete product
@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    """Delete a product."""
    try:
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        db.delete(product)
        db.commit()
        
        return {"message": "Product deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
