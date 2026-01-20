const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 8080;




app.use(express.json());

// File in same directory
const filePath = path.join(__dirname, "contacts.json");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.post("/contact", (req, res) => {
  const { name, phone, email, gender, note } = req.body;

  if (!name || !phone || !email) {
    return res.status(400).json({ message: "Name, phone and email are required" });
  }

  const newContact = {
    name,
    phone,
    email,
    gender,
    note,
    time: new Date().toISOString(),
  };

  // Read existing data
  fs.readFile(filePath, "utf8", (err, data) => {
    let contacts = [];

    if (!err && data) {
      try {
        contacts = JSON.parse(data);
      } catch (e) {
        return res.status(500).json({ message: "Corrupted JSON file" });
      }
    }

    // Push new contact
    contacts.push(newContact);

    // Write back to file
    fs.writeFile(filePath, JSON.stringify(contacts, null, 2), (err) => {
      if (err) {
        console.error("Write error:", err);
        return res.status(500).json({ message: "Failed to save contact" });
      }
      res.status(200).json({ message: "Contact saved successfully" });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
