from pydantic import BaseModel
from datetime import datetime


class Contact(BaseModel):
    name: str
    phone: str
    email: str = ""
    is_deleted: bool = False
    created_at: int = int(datetime.timestamp(datetime.now()))
    updated_at: int = int(datetime.timestamp(datetime.now()))