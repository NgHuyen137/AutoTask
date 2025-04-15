import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import Database
from app.exceptions.baseExceptions import *
from app.exceptions.schedulingHourExceptions import *
from app.exceptions.taskExceptions import *
from app.routes.schedulingHourRoutes import scheduling_hour_router
from app.routes.taskRoutes import task_router

# Setup logging
logging.basicConfig(
	level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)


@asynccontextmanager
async def db_lifespan(app: FastAPI):
	await Database.connect()
	yield
	Database.close()


version = "v1"
version_prefix = f"/api/{version}"

app = FastAPI(
	title="Task Management Application",
	description="A REST API for the Task Management Application.",
	lifespan=db_lifespan,
	version=version,
	docs_url=f"{version_prefix}/docs",
	redoc_url=f"{version_prefix}/redoc",
	openapi_url=f"{version_prefix}/openapi.json",
)

# Add CORSMiddleware to allow the frontend to access the API
app.add_middleware(
	CORSMiddleware,
	allow_origins=["http://localhost:5173"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

# Exception handlers
app.add_exception_handler(
	TaskNotFoundError,
	creat_exception_handler(
		status_code=status.HTTP_404_NOT_FOUND, initial_detail="No task found."
	),
)

app.add_exception_handler(
	TaskAutoScheduleError,
	creat_exception_handler(
		status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
		initial_detail="Cannot find an appropriate free time slot to schedule the task.",
	),
)

app.add_exception_handler(
	SchedulingHourNotFoundError,
	creat_exception_handler(
		status_code=status.HTTP_404_NOT_FOUND, initial_detail="No scheduling hour found."
	),
)

app.include_router(task_router, prefix=version_prefix)
app.include_router(scheduling_hour_router, prefix=version_prefix)
