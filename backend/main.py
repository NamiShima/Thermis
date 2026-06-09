from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import zones, alerts, sensor, history
from database import Base, engine, SessionLocal, ZoneReading, Alert, SensorReading

Base.metadata.create_all(bind=engine)
app = FastAPI(title='THERMIS API', version='1.0.0')
app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_methods=['*'], allow_headers=['*'])
app.include_router(zones.router, prefix='/zones', tags=['Zones'])
app.include_router(alerts.router, prefix='/alerts', tags=['Alerts'])
app.include_router(sensor.router, prefix='/sensor', tags=['Sensor'])
app.include_router(history.router, prefix='/history', tags=['History'])

@app.get('/')
def root():
    return {'status': 'THERMIS online', 'version': '1.0.0'}

@app.on_event('startup')
def populate_db():
    db = SessionLocal()
    if db.query(ZoneReading).count() == 0:
        db.add_all([
            ZoneReading(zone_name='Centro', lst=44.2, label='Critica', level=4),
            ZoneReading(zone_name='Bras', lst=43.1, label='Critica', level=4),
            ZoneReading(zone_name='Mooca', lst=42.8, label='Critica', level=4),
            ZoneReading(zone_name='Pinheiros', lst=34.4, label='Moderada', level=2),
            ZoneReading(zone_name='Parelheiros', lst=24.1, label='Normal', level=1),
        ])
        db.add_all([
            Alert(zone='Centro', severity='critical', message='Temperatura acima da media historica.', lst=44.2),
            Alert(zone='Bras', severity='critical', message='Ilha de calor intensificada.', lst=43.1),
        ])
        db.commit()
    db.close()

@app.get('/db/zones', tags=['Database'])
def get_db_zones():
    db = SessionLocal()
    r = db.query(ZoneReading).all()
    db.close()
    return [{'id': x.id, 'zone': x.zone_name, 'lst': x.lst, 'label': x.label, 'level': x.level, 'timestamp': x.timestamp.isoformat()} for x in r]

@app.get('/db/alerts', tags=['Database'])
def get_db_alerts():
    db = SessionLocal()
    a = db.query(Alert).all()
    db.close()
    return [{'id': x.id, 'zone': x.zone, 'severity': x.severity, 'message': x.message, 'lst': x.lst, 'timestamp': x.timestamp.isoformat()} for x in a]

@app.get('/db/stats', tags=['Database'])
def get_db_stats():
    db = SessionLocal()
    result = {'total_zone_readings': db.query(ZoneReading).count(), 'total_alerts': db.query(Alert).count(), 'total_sensor_readings': db.query(SensorReading).count(), 'critical_zones': db.query(ZoneReading).filter(ZoneReading.level == 4).count(), 'database': 'SQLite', 'status': 'online'}
    db.close()
    return result
