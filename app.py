import sqlite3

from flask import Flask, redirect, render_template, request
from flask.helpers import url_for

app = Flask(__name__)

error = ""


def get_db():
    connection = sqlite3.connect("database.db")
    connection.row_factory = sqlite3.Row
    return connection


@app.route("/")
def home():
    db = get_db()
    contacts = db.execute("SELECT * FROM contacts").fetchall()
    db.close()

    num_contacts = len(contacts)
    return render_template(
        "index.html", error=error, contacts=contacts, numContacts=num_contacts
    )


@app.route("/add_contact", methods=["POST"])
def add_contact():
    global error
    name = request.form["name"]
    phone = request.form["phone"]
    email = request.form["email"] or 'N/A'

    print(f"Payload:\nName: {name}, Phone: {phone}, Email: {email}")

    if not name or not phone:
        error = "Invalid submission"
        return redirect(url_for("home"))

    db = get_db()
    _ = db.execute(
        "INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)",
        (name, email, phone),
    )

    db.commit()
    db.close()
    return redirect(url_for("home"))


@app.route('/delete/<int:id>', methods=["POST"])
def delete_contact(id):
    global error

    if not id:
        error = "Error deleting contact"
        return redirect(url_for("home"))
    
    db = get_db()
    _ = db.execute("DELETE FROM contacts WHERE id = ?", (id, ))
    db.commit()
    db.close()

    return redirect(url_for("home"))

if __name__ == "__main__":
    app.run(debug=True, port=8000)
