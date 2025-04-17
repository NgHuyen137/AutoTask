from app.schemas.userSchema import UserCreate
from app.services.userService.crud import create_user, get_user_by_email
from app.utils.auth import get_password_hash


async def signup_user_account(user: UserCreate):
	# Check if the user already exists
	existing_user = await get_user_by_email(user.email)
	if existing_user:
		return None

	new_user_dict = user.model_dump(exclude=["password"])
	new_user_dict["hashed_password"] = get_password_hash(user.password)

	new_user = create_user(new_user_dict["email"], new_user_dict["hashed_password"])
	if new_user:
		return new_user
	return None
