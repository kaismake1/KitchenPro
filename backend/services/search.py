from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from rapidfuzz import fuzz
from backend.models.orm import Product, ProductImage
from datetime import datetime


def search_products(
    db: Session,
    query: str = "",
    brand: str = None,
    min_price: float = None,
    max_price: float = None,
    category: str = None,
    attrs: dict = None,
    page: int = 0,
    size: int = 20,
    sort_by: str = "created_at",
    sort_order: str = "desc",
):
    """
    Advanced search with fuzzy matching, filters, and sorting.
    Fuzzy search matches product names; exact filters on brand, price range, category.
    """
    query_obj = db.query(Product)

    # Category filter
    if category:
        query_obj = query_obj.filter(Product.category == category)

    # Brand filter
    if brand:
        query_obj = query_obj.filter(Product.brand == brand)

    # Price range filter
    if min_price is not None:
        query_obj = query_obj.filter(Product.price >= min_price)
    if max_price is not None:
        query_obj = query_obj.filter(Product.price <= max_price)

    # Attributes filter (power, zones, etc.)
    if attrs:
        for key, value in attrs.items():
            query_obj = query_obj.filter(Product.attributes[key].astext == str(value))

    # Fetch all candidates
    candidates = query_obj.all()

    # Fuzzy matching on name/description if query provided
    if query:
        scored = []
        query_lower = query.lower()
        for product in candidates:
            name_score = fuzz.partial_ratio(query_lower, product.name.lower())
            desc_score = fuzz.partial_ratio(
                query_lower, (product.description or "").lower()
            ) if product.description else 0
            combined_score = max(name_score, desc_score)

            if combined_score >= 50:  # Threshold for fuzzy match
                scored.append((product, combined_score))

        # Sort by fuzzy score descending
        scored.sort(key=lambda x: x[1], reverse=True)
        results = [p for p, score in scored]
    else:
        results = candidates

    # Sort by requested field
    if sort_by == "price":
        results.sort(key=lambda p: p.price, reverse=(sort_order == "desc"))
    elif sort_by == "rating":
        results.sort(key=lambda p: p.rating, reverse=(sort_order == "desc"))
    elif sort_by == "created_at":
        results.sort(key=lambda p: p.created_at, reverse=(sort_order == "desc"))

    # Pagination
    total = len(results)
    paginated = results[page * size : (page + 1) * size]

    return paginated, total


def get_product_with_images(db: Session, product_id: int):
    """Fetch product with all images."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        return None
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
        "attributes": product.attributes,
        "images": [
            {
                "id": img.id,
                "url": img.image_url,
                "is_primary": img.is_primary,
                "order": img.order,
            }
            for img in sorted(product.images, key=lambda x: x.order)
        ],
    }


def decrement_stock(db: Session, product_id: int, quantity: int) -> bool:
    """Decrement product stock by quantity. Return True if success."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product or product.stock < quantity:
        return False
    product.stock -= quantity
    if product.stock == 0:
        product.status = "out-of-stock"
    db.commit()
    return True
