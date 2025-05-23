from .baseExceptions import BaseError


class UnauthorizedError(BaseError):
  """An error for unauthorized access"""

  pass


class EmailVerificationError(BaseError):
  """An error for email verification"""

  pass


class AccessTokenExpiredError(BaseError):
  """An error for access token expired"""

  pass


class RefreshTokenExpiredError(BaseError):
  """An error for refresh token expired"""

  pass


class UserAlreadyExistsError(BaseError):
  """An error for user already exists"""

  pass


class UserNotFoundError(BaseError):
  """An error for user not found"""

  pass


class AccountNotVerifiedError(BaseError):
  """An error for account not verified"""

  pass


class InvalidTokenError(BaseError):
  """An error for invalid token"""

  pass
