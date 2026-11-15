"use client";

import { useEffect, useState } from "react";
import type { Contact } from "./contacts";

type ContactFormProps = {
  initialData?: Contact;
  onSuccess: () => void;
};

export default function ContactForm({
  initialData,
  onSuccess,
}: ContactFormProps) {
  const [contact, setContact] = useState(
    initialData || {
      id: "",
      name: "",
      phone: "",
      email: "",
    },
  );

  useEffect(() => {
    if (initialData) {
      setContact(initialData);
    }
  }, [initialData]);

  const isEditing: boolean = Boolean(contact.id);
  const apiUrl = import.meta.env.VITE_API_URL;
  const url = isEditing
    ? `${apiUrl}/contacts/${contact.id}`
    : `${apiUrl}/contacts`;

  const handleSubmit = async (e: any) => {
    console.log(
      `Contact submission request for contact: ${JSON.stringify(contact)}`,
    );
    e.preventDefault();

    try {
      const payload = {
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
      };

      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }).then((data) => data.json());

      const successMessage = isEditing
        ? res.message
        : `Contact added with ID: ${res.id}`;

      if (res.status_code === 200) {
        console.log(successMessage);
        onSuccess();
        if (isEditing) {
          setContact({ id: "", name: "", phone: "", email: "" });
        }
      } else {
        console.log(`Error adding contact`);
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <div className="input-block">
        <label className="input-label" htmlFor="name">
          Name
        </label>
        <input
          type="text"
          name="name"
          value={contact.name}
          onChange={(e) => setContact({ ...contact, name: e.target.value })}
          className="input-field"
        />
      </div>
      <div className="input-block">
        <label className="input-label" htmlFor="phone">
          Phone
        </label>
        <input
          type="text"
          name="phone"
          value={contact.phone}
          onChange={(e) => setContact({ ...contact, phone: e.target.value })}
          className="input-field"
        />
      </div>
      <div className="input-block">
        <label className="input-label" htmlFor="email">
          Email ID (optional)
        </label>
        <input
          type="email"
          name="email"
          value={contact.email}
          onChange={(e) => setContact({ ...contact, email: e.target.value })}
          className="input-field"
        />
      </div>

      <button className="btn btn-submit" type="submit">
        {isEditing ? "Update Contact" : "Create Contact"}
      </button>
    </form>
  );
}
