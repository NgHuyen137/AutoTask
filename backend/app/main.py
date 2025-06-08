import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware

from app.db.mongodb import Database
from app.config.security import security_settings
from app.exceptions.baseExceptions import creat_exception_handler
from app.exceptions.passwordExceptions import PasswordAndConfirmPasswordMismatchError
from app.exceptions.schedulingHourExceptions import SchedulingHourNotFoundError
from app.exceptions.taskExceptions import TaskAutoScheduleError, TaskNotFoundError
from app.exceptions.authExceptions import (
  AccountNotVerifiedError,
  InvalidTokenError,
  UnauthorizedError,
  EmailVerificationError,
  AccessTokenExpiredError,
  RefreshTokenExpiredError,
  UserAlreadyExistsError,
  UserNotFoundError
)
from app.routes.userRoutes import user_router
from app.routes.authRoutes import auth_router
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

app.add_middleware(SessionMiddleware, secret_key=security_settings.FASTAPI_SECRET_KEY)

# Add CORSMiddleware to allow the frontend to access the API
app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:5173", "https://auto-task-hazel.vercel.app"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

app.add_middleware(
  TrustedHostMiddleware,
  allowed_hosts=[
    "localhost",
    "127.0.0.1",
    "*.onrender.com",
    "autotask-api.onrender.com"
  ]
)

app.add_exception_handler(
  PasswordAndConfirmPasswordMismatchError,
  creat_exception_handler(
    status_code=status.HTTP_400_BAD_REQUEST,
    initial_detail="Password and Confirm password do not match.",
  )
)

app.add_exception_handler(
  InvalidTokenError,
  creat_exception_handler(
    status_code=status.HTTP_400_BAD_REQUEST, initial_detail="Invalid token."
  )
)

app.add_exception_handler(
  UnauthorizedError,
  creat_exception_handler(
    status_code=status.HTTP_401_UNAUTHORIZED, initial_detail="Invalid credentials."
  )
)

app.add_exception_handler(
  EmailVerificationError,
  creat_exception_handler(
    status_code=status.HTTP_403_FORBIDDEN,
    initial_detail="Email has not been verified."
  )
)

app.add_exception_handler(
  AccessTokenExpiredError,
  creat_exception_handler(
    status_code=status.HTTP_401_UNAUTHORIZED, initial_detail="Access token expired."
  )
)

app.add_exception_handler(
  RefreshTokenExpiredError,
  creat_exception_handler(
    status_code=status.HTTP_401_UNAUTHORIZED, initial_detail="Refresh token expired."
  )
)

app.add_exception_handler(
  UserNotFoundError,
  creat_exception_handler(
    status_code=status.HTTP_404_NOT_FOUND, initial_detail="User not found."
  )
)

app.add_exception_handler(
  UserAlreadyExistsError,
  creat_exception_handler(
    status_code=status.HTTP_409_CONFLICT, initial_detail="User already exists."
  )
)

app.add_exception_handler(
  AccountNotVerifiedError,
  creat_exception_handler(
    status_code=status.HTTP_403_FORBIDDEN, initial_detail="Account is not verified."
  )
)

app.add_exception_handler(
  TaskNotFoundError,
  creat_exception_handler(
    status_code=status.HTTP_404_NOT_FOUND, initial_detail="No task found."
  )
)

app.add_exception_handler(
  TaskAutoScheduleError,
  creat_exception_handler(
    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    initial_detail="Cannot find an appropriate free time slot to schedule the task.",
  )
)

app.add_exception_handler(
  SchedulingHourNotFoundError,
  creat_exception_handler(
    status_code=status.HTTP_404_NOT_FOUND, initial_detail="No scheduling hour found."
  )
)

app.include_router(user_router, prefix=version_prefix)
app.include_router(auth_router, prefix=version_prefix)
app.include_router(task_router, prefix=version_prefix)
app.include_router(scheduling_hour_router, prefix=version_prefix)
