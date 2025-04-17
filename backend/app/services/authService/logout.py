from app.db.redis import blacklist_tokens


async def logout_user_account(access_token: str, refresh_token: str):
	# Invalidate the tokens by adding them to the blacklist
	await blacklist_tokens(access_token, refresh_token)
