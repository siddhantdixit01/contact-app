const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const cors = require('cors');
const mongoose = require('mongoose');
const Contact = require('./models/Contact');

const app = express();
const PORT = process.env.PORT || 5000;
const mongoUri = 'mongodb+srv://siddhantdixit97:StG7MYhISzSAOdgy@cluster0.cqtxqdf.mongodb.net/contacts';

app.use(cors(
  origin:["https://contact-fs1v0098o-sids-projects-57488fea.vercel.app/"],
  methods:["POST","GET"],
  credentials: true
));
app.use(express.json());
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'contacts' }); 


app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/import-contacts', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const buffer = req.file.buffer;
  const fileExtension = req.file.originalname.split('.').pop().toLowerCase();

  const existingContacts = await Contact.find();

  if (fileExtension === 'csv') {
    const contacts = [];
    csv()
    .on('data', (data) => {
      if (data.name) {
        if (
          !existingContacts.some(
            (contact) =>
              contact.name === data.name &&
              contact.phoneNumber === data.phoneNumber &&
              contact.email === data.email
          )
        ) {
          contacts.push(data);
        }
      }
    })
    .on('end', async () => {
      try {
        const sortedContacts = contacts
          .filter((contact) => contact.name)
          .sort((a, b) => a.name.localeCompare(b.name));
        const savedContacts = await Contact.insertMany(sortedContacts);
        res.json(savedContacts);
      } catch (error) {
        console.error('CSV Import Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    })
    .end(buffer.toString());
  
  } else if (fileExtension === 'xlsx') {
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const contacts = xlsx.utils.sheet_to_json(worksheet);

    const uniqueContacts = contacts.filter(
      (contact) =>
        !existingContacts.some(
          (existingContact) =>
            existingContact.name === contact.name &&
            existingContact.phoneNumber === contact.phoneNumber &&
            existingContact.email === contact.email
        )
    );

    try {
      const sortedContacts = uniqueContacts.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      const savedContacts = await Contact.insertMany(sortedContacts);
      res.json(savedContacts);
    } catch (error) {
      console.error('XLSX Import Error:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(400).json({ error: 'Unsupported file format' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
