from sqlalchemy import create_engine, Column, Integer, Float, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

engine = create_engine('sqlite:///thermis.db', echo=False)
Base = declarative_base()

class ZoneReading(Base):
    __tablename__ = 'zone_readings'
    id        = Column(Integer, primary_key=True, index=True)
    zone_name = Column(String, nullable=False)
    lst       = Column(Float, nullable=False)
    label     = Column(String, nullable=False)
    level     = Column(Integer, nullable=False)
    timestamp = Column(DateTime, default=datetime.now)

class Alert(Base):
    __tablename__ = 'alerts'
    id        = Column(Integer, primary_key=True, index=True)
    zone      = Column(String, nullable=False)
    severity  = Column(String, nullable=False)
    message   = Column(String, nullable=False)
    lst       = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.now)

class SensorReading(Base):
    __tablename__ = 'sensor_readings'
    id          = Column(Integer, primary_key=True, index=True)
    device_id   = Column(String, nullable=False)
    temperature = Column(Float, nullable=False)
    humidity    = Column(Float, nullable=False)
    heat_index  = Column(Float, nullable=False)
    timestamp   = Column(DateTime, default=datetime.now)

Base.metadata.create_all(bind=engine)
SessionLocal = sessionmaker(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
