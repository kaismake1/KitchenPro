from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.db import init_db
from backend.api import auth, products, checkout, admin, shipper

# Initialize database
init_db()

# Create FastAPI app
app = FastAPI(
    title="E-Commerce API",
    description="Advanced kitchen appliances e-commerce backend",
    version="1.0.0",
)

# Add CORS middleware (allow frontend to call backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(checkout.router)
app.include_router(admin.router)
app.include_router(shipper.router)


@app.get("/")
def read_root():
    return {
        "message": "E-Commerce API is running",
        "docs": "/docs",
        "openapi": "/openapi.json",
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
