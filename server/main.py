from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from bson.objectid import ObjectId
from datetime import datetime

from config import collection
from db.schemas import list_data
from db.models import Contact

app = FastAPI()
router = APIRouter()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_headers=["*"],
    allow_methods=["*"],
    allow_credentials=True,
)


@router.get("/contacts")
async def get_all_contacts():
    contacts = collection.find({"is_deleted": False})
    return list_data(contacts)


@router.post("/contacts")
async def create_contact(new_contact: Contact):
    try:
        res = collection.insert_one(document=dict(new_contact))
        return {"status_code": 200, "id": str(res.inserted_id)}
    except Exception as e:
        return HTTPException(status_code=500, detail=f"Error creating new contact: {e}")


@router.put("/contacts/{contact_id}")
async def update_contact(contact_id: str, updated_contact: Contact):
    try:
        oid = ObjectId(contact_id)
        existing_contact = collection.find_one({"_id": oid, "is_deleted": False})
        if not existing_contact:
            return HTTPException(
                status_code=404, detail=f"Contact with ID: {contact_id} not found"
            )

        updated_contact.updated_at = int(datetime.timestamp(datetime.now()))
        res = collection.update_one({"_id": oid}, {"$set": dict(updated_contact)})
        return {"status_code": 200, "message": "Contact updated successfully"}
    except Exception as e:
        return HTTPException(
            status_code=500, detail=f"Error occurred while updating contact {e}"
        )


@router.delete("/contacts/{contact_id}")
async def delete_contact(contact_id: str):
    try:
        oid = ObjectId(contact_id)
        contact = collection.find_one({"_id": oid, "is_deleted": False})
        if not contact:
            return HTTPException(
                status_code=404, detail=f"Contact with ID: {contact_id} not found"
            )

        res = collection.update_one({"_id": oid}, {"$set": {"is_deleted": True}})
        return {"status_code": 200, "message": "Contact deleted successfully"}
    except Exception as e:
        return HTTPException(
            status_code=500, detail=f"Error occurred while deleting contact: {e}"
        )


app.include_router(router=router)
