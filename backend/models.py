from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Item(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    category = Column(String, default="Other")
    status = Column(String, default="active")  # active | quit | completed
    started_at = Column(DateTime, default=datetime.utcnow)
    ended_at = Column(DateTime, nullable=True)
    
    reason = relationship("QuitReason", uselist=False, back_populates="item")

class QuitReason(Base):
    __tablename__ = "quit_reasons"
    id = Column(Integer, primary_key=True)
    item_id = Column(Integer, ForeignKey("items.id"), nullable=False)
    reason_tag = Column(String, nullable=False)
    reason_text = Column(Text, nullable=True)
    voice_transcript = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    item = relationship("Item", back_populates="reason")
