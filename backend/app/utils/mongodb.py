from typing import Annotated
from pydantic import BeforeValidator

# Define the type for MongoDB's ObjectId
# Convert the primary key _id in the BSON type to the String type before validating
PyObjectId = Annotated[str, BeforeValidator(str)]