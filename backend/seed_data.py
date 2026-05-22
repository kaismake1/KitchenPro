"""
Seed data vào database - chạy 1 lần để insert sản phẩm và admin account
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.db import SessionLocal
from backend.models.orm import User, Product, ProductImage
from backend.services.auth import hash_password
from datetime import datetime

def seed_data():
    db = SessionLocal()
    
    try:
        # 1. Tạo Admin Account
        print("🔧 Creating admin account...")
        admin_user = User(
            id="admin-1",
            username="admin",
            email="admin@kitchenpro.com",
            hashed_password=hash_password("123"),
            role="admin",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        db.add(admin_user)
        db.commit()
        print("✅ Admin account created: username=admin, password=123")
        
        # 2. Seed sản phẩm
        products_data = [
            {
                "name": "Lò Nướng Điện Cao Cấp",
                "price": 29999900,
                "rating": 4.8,
                "reviews": 124,
                "category": "Lò Nướng",
                "brand": "Bosch",
                "stock": 15,
                "description": "Công nghệ lò nướng vòi điều khiển nhiệt độ độc lập. Tính năng 10 chế độ nấu nướng, chức năng tự làm sạch và thiết kế tiết kiệm năng lượng.",
                "status": "in-stock",
                "badge": "Bán Chạy Nhất",
                "image": "https://images.unsplash.com/photo-1772567733108-38d940269d86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFpbmxlc3MlMjBzdGVlbCUyMG92ZW58ZW58MXx8fHwxNzc2MjcyMDE5fDA&ixlib=rb-4.1.0&q=80&w=1080",
            },
            {
                "name": "Tủ Lạnh Thông Minh",
                "price": 56999800,
                "rating": 4.9,
                "reviews": 89,
                "category": "Tủ Lạnh",
                "brand": "Samsung",
                "stock": 8,
                "description": "Tủ lạnh thông minh hỗ trợ WiFi với màn hình cảm ứng. Các vùng nhiệt độ, camera tích hợp và điều khiển ứng dụng di động.",
                "status": "in-stock",
                "badge": "Mới",
                "image": "https://images.unsplash.com/photo-1771794980860-38f3291807e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHJlZnJpZ2VyYXRvciUyMG1vZGVybnxlbnwxfHx8fDE3NzYyNzIwMjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
            },
            {
                "name": "Máy Rửa Chén Sinh Thái",
                "price": 20799900,
                "rating": 4.7,
                "reviews": 156,
                "category": "Máy Rửa Chén",
                "brand": "Electrolux",
                "stock": 22,
                "description": "Máy rửa chén tiết kiệm năng lượng với 6 chương trình rửa. Hoạt động siêu yên tĩnh và hệ thống lọc nước tiên tiến.",
                "status": "in-stock",
                "badge": None,
                "image": "https://images.unsplash.com/photo-1668910225551-1080c3a12241?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFpbmxlc3MlMjBzdGVlbCUyMGRpc2h3YXNoZXJ8ZW58MXx8fHwxNzc2MjcyMDIwfDA&ixlib=rb-4.1.0&q=80&w=1080",
            },
            {
                "name": "Lò Vi Sóng Pro",
                "price": 7999900,
                "rating": 4.6,
                "reviews": 203,
                "category": "Lò Vi Sóng",
                "brand": "LG",
                "stock": 30,
                "description": "Lò vi sóng 1200W với chức năng nướng bằng lò nức. Công nghệ cảm biến thông minh và 15 chương trình nấu nướng được cài sẵn.",
                "status": "in-stock",
                "badge": None,
                "image": "https://images.unsplash.com/photo-1587892106866-e6b362b35449?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWNyb3dhdmUlMjBvdmVuJTIwYXBwbGlhbmNlfGVufDF8fHx8MTc3NjI0MjI0NXww&ixlib=rb-4.1.0&q=80&w=1080",
            },
            {
                "name": "Máy Hút Hơi Thiết Kế",
                "price": 18499900,
                "rating": 4.8,
                "reviews": 67,
                "category": "Máy Hút Hơi",
                "brand": "Siemens",
                "stock": 12,
                "description": "Thiết kế inox bạc sáng bóng với khả năng hút mạnh. Đèn LED và điều khiển bằng cảm ứng.",
                "status": "in-stock",
                "badge": None,
                "image": "https://images.unsplash.com/photo-1714358013380-b75b16127007?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHhraXRjaGVuJTIwY29va2VyJTIwaG9vZHxlbnwxfHx8fDE3NzYyNzIwMTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
            },
            {
                "name": "Lò Nướng Tích Hợp Deluxe",
                "price": 36999900,
                "rating": 4.9,
                "reviews": 94,
                "category": "Lò Nướng",
                "brand": "Miele",
                "stock": 5,
                "description": "Lò nướng cao cấp tích hợp với hệ thống khử mùi ngoài. Điều khiển touchscreen và 20 chế độ nấu nướng.",
                "status": "in-stock",
                "badge": "Cao Cấp",
                "image": "https://images.unsplash.com/photo-1754568401041-11ad5769ed7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMG92ZW4lMjBhcHBsaWFuY2V8ZW58MXx8fHwxNzc2MjcyMDE3fDA&ixlib=rb-4.1.0&q=80&w=1080",
            },
        ]
        
        print("🛒 Seeding products...")
        for idx, product_data in enumerate(products_data, 1):
            image_url = product_data.pop("image")
            
            product = Product(
                name=product_data["name"],
                price=product_data["price"],
                rating=product_data["rating"],
                reviews=product_data["reviews"],
                category=product_data["category"],
                brand=product_data["brand"],
                stock=product_data["stock"],
                description=product_data["description"],
                status=product_data["status"],
                badge=product_data["badge"],
                attributes={"power": "2400W", "zones": 4},
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
            )
            db.add(product)
            db.flush()  # Lấy ID sản phẩm
            
            # Thêm ảnh sản phẩm
            product_image = ProductImage(
                product_id=product.id,
                image_url=image_url,
                is_primary=True,
                order=1,
                created_at=datetime.utcnow(),
            )
            db.add(product_image)
            print(f"  ✅ Product {idx}: {product_data['name']}")
        
        db.commit()
        print("\n✅ Database seeding completed successfully!")
        print(f"📊 Total: 1 admin + {len(products_data)} products")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error during seeding: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_data()
