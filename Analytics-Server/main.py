from typing import Union
import logging
import json
from datetime import datetime
from uuid import UUID
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from clickhouse_driver import Client

# ClickHouse client
clickhouse_client = Client(
    host='localhost',
    port=9000,
    user='formAnalytics',
    password='test1234',
    settings={'use_numpy': False}
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    filename='analytics.log'
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: DB connection check and table creation
    try:
        # Check connection
        clickhouse_client.execute("SELECT 1")
        logger.info("Successfully connected to ClickHouse database")
        
        # Create tables if they don't exist
        clickhouse_client.execute("""
        CREATE TABLE IF NOT EXISTS form_sessions (
            session_id UUID,
            form_start_time DateTime64(3),
            form_end_time Nullable(DateTime64(3)),
            form_completion_time Nullable(Float64),
            form_submitted Bool,
            form_abandoned Bool,
            validation_error_count UInt16,
            export_reason String,
            created_at DateTime DEFAULT now()
        ) ENGINE = MergeTree()
        ORDER BY (session_id, form_start_time)
        """)
        
        clickhouse_client.execute("""
        CREATE TABLE IF NOT EXISTS form_fields (
            session_id UUID,
            field_category String,
            field_name String,
            field_value String,
            has_validation_errors Bool,
            validation_error_count UInt8,
            created_at DateTime DEFAULT now()
        ) ENGINE = MergeTree()
        ORDER BY (session_id, field_category, field_name)
        """)
        
        logger.info("Database tables verified/created successfully")
    except Exception as e:
        logger.error(f"Database initialization error: {str(e)}")
    
    yield
    
    # Shutdown logic (if needed)
    logger.info("Shutting down analytics server")

app = FastAPI(lifespan=lifespan)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/formAnalytics")
async def form_analytics(request: Request):
    try:
        data = await request.json()
        logger.info(f"Received form analytics data for session: {data.get('sessionId', 'unknown')}")
        
        # Store session data
        store_session_data(data)
        
        # Store field data
        store_field_data(data)
        
        return {"message": "Data stored successfully in ClickHouse", "status": "success"}
    except Exception as e:
        logger.error(f"Error processing analytics data: {str(e)}")
        return {"message": f"Error storing data: {str(e)}", "status": "error"}
    

@app.get("/getFormAnalytics")
async def get_form_analytics():
    """
    Fetch all form analytics data from the database and return it in a format
    compatible with the frontend application.
    """
    try:
        # Get all sessions data
        sessions_result = clickhouse_client.execute("""
            SELECT 
                toString(session_id) as session_id,
                toUnixTimestamp(form_start_time) * 1000 as form_start_time,
                toUnixTimestamp(form_end_time) * 1000 as form_end_time,
                form_completion_time * 1000 as form_completion_time, 
                form_submitted,
                form_abandoned,
                validation_error_count,
                export_reason
            FROM form_sessions
            ORDER BY form_start_time DESC
        """)

        # Get all fields data 
        fields_result = clickhouse_client.execute("""
            SELECT 
                toString(session_id) as session_id,
                field_category,
                field_name,
                field_value,
                has_validation_errors,
                validation_error_count
            FROM form_fields
            ORDER BY session_id, field_category, field_name
        """)

        # Process and structure the data to match the expected format
        sessions_data = {}
        for row in sessions_result:
            session_id, form_start_time, form_end_time, form_completion_time, \
            form_submitted, form_abandoned, validation_error_count, export_reason = row
            
            sessions_data[session_id] = {
                "sessionId": session_id,
                "formStartTime": form_start_time,
                "formEndTime": form_end_time,
                "formCompletionTime": form_completion_time,
                "formSubmitted": form_submitted,
                "formAbandoned": form_abandoned,
                "validationErrorCount": validation_error_count,
                "exportReason": export_reason,
                "fields": {},
                "tabs": {}
            }
        
        # Process fields and tabs data
        for row in fields_result:
            session_id, field_category, field_name, field_value, _, _ = row
            
            if session_id not in sessions_data:
                continue  # Skip if session not found
                
            if field_category == 'tabs':
                # Parse tab data
                tab_data = json.loads(field_value)
                sessions_data[session_id]["tabs"][field_name] = {
                    "visits": tab_data.get("visits", 0),
                    "totalTimeSpent": tab_data.get("totalTimeSpent", 0) * 1000  # Convert back to milliseconds
                }
            else:
                # Parse field data
                field_data = json.loads(field_value)
                field_id = field_data.get("id", field_name)
                
                # Recreate the field structure based on the stored JSON
                sessions_data[session_id]["fields"][field_name] = {
                    "id": field_id,
                    "validationErrors": field_data.get("validationErrors", [])
                }
        
        # Convert to the expected collection format
        result = {
            "sessions": list(sessions_data.values())
        }
        
        return result

    except Exception as e:
        logger.error(f"Error fetching analytics data: {str(e)}")
        return {"message": f"Error fetching data: {str(e)}", "status": "error"}

# Also add a method to get analytics for a specific session
@app.get("/formAnalytics/{session_id}")
async def get_session_analytics(session_id: str):
    """
    Fetch analytics data for a specific session
    """
    try:
        # Get session data
        session_result = clickhouse_client.execute("""
            SELECT 
                toString(session_id) as session_id,
                toUnixTimestamp(form_start_time) * 1000 as form_start_time,
                toUnixTimestamp(form_end_time) * 1000 as form_end_time,
                form_completion_time * 1000 as form_completion_time, 
                form_submitted,
                form_abandoned,
                validation_error_count,
                export_reason
            FROM form_sessions
            WHERE session_id = %(session_id)s
        """, {"session_id": UUID(session_id)})
        
        if not session_result:
            return {"message": "Session not found", "status": "error"}
        
        # Get fields data for this session
        fields_result = clickhouse_client.execute("""
            SELECT 
                field_category,
                field_name,
                field_value,
                has_validation_errors
            FROM form_fields
            WHERE session_id = %(session_id)s
        """, {"session_id": UUID(session_id)})
        
        # Process and structure the data
        session_data = {
            "sessionId": session_id,
            "formStartTime": session_result[0][1],
            "formEndTime": session_result[0][2],
            "formCompletionTime": session_result[0][3],
            "formSubmitted": session_result[0][4],
            "formAbandoned": session_result[0][5],
            "validationErrorCount": session_result[0][6],
            "exportReason": session_result[0][7],
            "fields": {},
            "tabs": {}
        }
        
        # Process fields and tabs data
        for row in fields_result:
            field_category, field_name, field_value, _ = row
            
            if field_category == 'tabs':
                # Parse tab data
                tab_data = json.loads(field_value)
                session_data["tabs"][field_name] = {
                    "visits": tab_data.get("visits", 0),
                    "totalTimeSpent": tab_data.get("totalTimeSpent", 0) * 1000  # Convert back to milliseconds
                }
            else:
                # Parse field data
                field_data = json.loads(field_value)
                field_id = field_data.get("id", field_name)
                
                # Recreate the field structure based on the stored JSON
                session_data["fields"][field_name] = {
                    "id": field_id,
                    "validationErrors": field_data.get("validationErrors", [])
                }
        
        return session_data
    
    except Exception as e:
        logger.error(f"Error fetching session data: {str(e)}")
        return {"message": f"Error fetching session data: {str(e)}", "status": "error"}




def store_session_data(data):
    """Store main session data in the form_sessions table"""
    try:
        # Convert timestamps from milliseconds to datetime objects
        form_start_time = datetime.fromtimestamp(data['formStartTime'] / 1000)
        
        form_end_time = None
        form_completion_time = None
        if data.get('formEndTime'):
            form_end_time = datetime.fromtimestamp(data['formEndTime'] / 1000)
            # Calculate completion time as seconds between end and start time
            form_completion_time = (form_end_time - form_start_time).total_seconds()
        
        # Insert into form_sessions table
        clickhouse_client.execute(
            """
            INSERT INTO form_sessions 
            (session_id, form_start_time, form_end_time, form_completion_time, 
            form_submitted, form_abandoned, validation_error_count, export_reason) 
            VALUES
            """,
            [(
                UUID(data['sessionId']),
                form_start_time,
                form_end_time,
                form_completion_time,
                data.get('formSubmitted', False),
                data.get('formAbandoned', False),
                data.get('validationErrorCount', 0),
                data.get('exportReason', 'unknown')
            )]
        )
        logger.info(f"Stored session data for {data['sessionId']}")
    except Exception as e:
        logger.error(f"Error storing session data: {str(e)}")
        raise

def store_field_data(data):
    """Store field-specific data in the form_fields table"""
    try:
        session_id = UUID(data['sessionId'])
        rows = []
        
        # Process fields data
        for field_name, field_data in data.get('fields', {}).items():
            field_category = get_field_category(field_name)
            has_errors = len(field_data.get('validationErrors', [])) > 0
            error_count = len(field_data.get('validationErrors', []))
            
            rows.append((
                session_id,
                field_category,
                field_name,
                json.dumps(field_data),  # Store the entire field data as JSON
                has_errors,
                error_count
            ))
        
        # Process tabs data (treated as a special field category)
        for tab_name, tab_data in data.get('tabs', {}).items():
            # Convert the tab data to a storable format
            tab_value = {
                'visits': tab_data.get('visits', 0),
                'totalTimeSpent': tab_data.get('totalTimeSpent', 0) / 1000,  # Convert to seconds
            }
            
            rows.append((
                session_id,
                'tabs',
                tab_name,
                json.dumps(tab_value),
                False,  # tabs don't have validation errors
                0       # no error count for tabs
            ))
        
        # Batch insert all rows
        if rows:
            clickhouse_client.execute(
                """
                INSERT INTO form_fields 
                (session_id, field_category, field_name, field_value, 
                has_validation_errors, validation_error_count) 
                VALUES
                """,
                rows
            )
            logger.info(f"Stored {len(rows)} field records for session {data['sessionId']}")
    except Exception as e:
        logger.error(f"Error storing field data: {str(e)}")
        raise

def get_field_category(field_name):
    """Determine which category a field belongs to based on its name"""
    personal_fields = [
        'firstName', 'lastName', 'email', 'dateOfBirth', 'gender', 
        'phone', 'address', 'city', 'country', 'zipCode'
    ]
    professional_fields = [
        'occupation', 'companyName', 'yearsOfExperience', 
        'skills', 'educationLevel'
    ]
    payment_fields = [
        'cardNumber', 'cardName', 'expiryDate', 'cvv'
    ]
    experience_fields = [
        'lifeGoals', 'problemSolvingApproach', 'ethicalDilemma',
        'satisfactionLevel', 'receiveUpdates'
    ]
    
    if field_name in personal_fields:
        return 'personal'
    elif field_name in professional_fields:
        return 'professional'
    elif field_name in payment_fields:
        return 'payment'
    elif field_name in experience_fields:
        return 'experience'
    else:
        return 'other'