from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.models.orm import User, Order


def assign_shipper_to_order(db: Session, order_id: str) -> bool:
    """
    Auto-assign a shipper to an order.
    Priority:
    1. Shipper with no orders
    2. Shipper with the fewest orders
    
    Returns True if successfully assigned, False otherwise.
    """
    try:
        # Find all active shippers
        shippers = db.query(User).filter(User.role == "shipper").all()
        
        if not shippers:
            # No shippers available
            print(f"No shippers available to assign to order {order_id}")
            return False
        
        # Count orders for each shipper, prioritizing those with no orders
        shipper_order_counts = []
        
        for shipper in shippers:
            order_count = db.query(func.count(Order.id)).filter(
                Order.shipper_id == shipper.id
            ).scalar() or 0
            
            shipper_order_counts.append({
                "shipper": shipper,
                "shipper_id": shipper.id,
                "order_count": order_count
            })
        
        # Sort by order count (ascending)
        shipper_order_counts.sort(key=lambda x: x["order_count"])
        
        # Assign the shipper with the fewest orders
        selected_shipper = shipper_order_counts[0]["shipper"]
        selected_shipper_id = selected_shipper.id
        
        order = db.query(Order).filter(Order.id == order_id).first()
        if order:
            order.shipper_id = selected_shipper_id
            order.shipper = selected_shipper.username  # Set shipper name
            order.shipper_phone = selected_shipper.phone  # Set shipper phone
            db.commit()
            print(f"Order {order_id} assigned to shipper {selected_shipper.username} (Phone: {selected_shipper.phone}, ID: {selected_shipper_id})")
            return True
        
        return False
        
    except Exception as e:
        print(f"Error assigning shipper: {str(e)}")
        return False
