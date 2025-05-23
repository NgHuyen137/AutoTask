from .baseExceptions import BaseError


class PasswordAndConfirmPasswordMismatchError(BaseError):
  """Exception raised when the password and confirm password do not match."""

  pass
