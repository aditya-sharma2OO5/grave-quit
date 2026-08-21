from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import patterns
from database import engine, Base

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Gravequit API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev only, update for prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(patterns.router)

@app.get("/")
def root():
    return {"message": "Gravequit API is running"}
