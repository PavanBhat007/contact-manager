def individual_data(contact):
    return {
        "id": str(contact["_id"]),
        "name": contact["name"],
        "phone": contact["phone"],
        "email": contact["email"],
    }


def list_data(contacts):
    return [individual_data(contact) for contact in contacts]
