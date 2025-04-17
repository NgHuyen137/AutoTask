from typing import Any, Callable

from fastapi import Request
from fastapi.responses import JSONResponse


class BaseError(Exception):
	"""Base exception"""

	pass


def creat_exception_handler(
	status_code: int, initial_detail: Any
) -> Callable[[Request, BaseError], JSONResponse]:
	async def exception_handler(request: Request, exc: BaseError):
		return JSONResponse(content=initial_detail, status_code=status_code)

	return exception_handler
