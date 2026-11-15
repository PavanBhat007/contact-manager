"use client";

import { useEffect, useState } from "react";
import ContactForm from "./contactForm";

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [editContact, setEditContact] = useState({
    id: "",
    name: "",
    phone: "",
    email: "",
  });
  const apiUrl = import.meta.env.VITE_API_URL;
  const fetchContacts = async () => {
    try {
      const res = await fetch(`${apiUrl}/contacts`).then((data) => data.json());

      setContacts(res || []);
    } catch (error) {
      console.error("Error fetching contacts: " + error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleRefresh = () => {
    fetchContacts();
    setEditContact({
      id: "",
      name: "",
      phone: "",
      email: "",
    });
  };

  const handleDelete = async (contact_id: string) => {
    try {
        const res = await fetch(`${apiUrl}/contacts/${contact_id}`, {
            method: "DELETE"
        }).then((data) => data.json());

        if(res.status_code === 200) {
            console.log(res.message)
            handleRefresh()
        } else {
            console.error(`Error deleting contact: ${res.detail}`)
        }
    } catch(error) {
        console.error(`Error deleting contact: ${error}`)
    }
  }

  return (
    <div className="page-container">
      <header className="header-container">
        <div className="box-container">
          <div className="box-1"></div>
          <div className="box-2"></div>
          <div className="box-3"></div>
        </div>
        <h1 className="header-h1">Contact Manager</h1>
        <div className="box-container-rev">
          <div className="box-3"></div>
          <div className="box-2"></div>
          <div className="box-1"></div>
        </div>
      </header>

      <ContactForm initialData={editContact} onSuccess={handleRefresh} />

      <ul className="contact-container">
        {contacts ? (
          contacts.map((contact: Contact, idx: number) => (
            <li key={idx} className="contact">
              <div className="flex-container">
                <div></div>
                <p className="contact-name">{contact.name}</p>
              </div>
              <div className="flex-col-container">
                <p className="contact-phone">{contact.phone}</p>
                <p className="contact-email">{contact.email}</p>
              </div>

              <div className="actions">
                <div>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setEditContact(contact)}
                  >
                    Edit
                  </button>
                </div>
                <div>
                  <button type="button" className="btn btn-delete" onClick={() => handleDelete(contact.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))
        ) : (
          <div>
            <h3>No Contacts found</h3>
          </div>
        )}
      </ul>
    </div>
  );
}
