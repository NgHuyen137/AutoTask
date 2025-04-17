from .baseExceptions import BaseError


class UnauthorizedError(BaseError):
	"""An error for unauthorized access"""

	pass


class UserAlreadyExistsError(BaseError):
	"""An error for user already exists"""

	pass
