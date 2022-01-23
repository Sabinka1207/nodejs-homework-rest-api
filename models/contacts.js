const fs = require('fs/promises')
const path = require("path")

const filePath = path.join(__dirname, "contacts.json")

async function listContacts() {
  const data = await fs.readFile(filePath)
  const arr = JSON.parse(data)
  return arr
}

async function getContactById(contactId) {
  const allContacts = await listContacts();
  const contact = allContacts.filter(item => item.id === `${contactId}`);
  if (contact.length === 0 ) {
    return null;
  }
  return contact;
}

async function removeContact(contactId) {
  const allContacts = await listContacts();
  const newContactList = allContacts.filter(item => item.id !== `${contactId}`);
  if (newContactList.length === allContacts.length ) {
    return null;
  }
  await fs.writeFile(filePath, JSON.stringify(newContactList));
  return newContactList;
}

// const addContact = async (body) => {}

async function addContact(name, email, phone) {
  const allContacts = await listContacts();
  const generatedId = allContacts.length + 1
  console.log("generatedId = ", generatedId)
  const data = {id: `${generatedId}`, name, email, phone};
  allContacts.push(data);
  await fs.writeFile(filePath, JSON.stringify(allContacts));
  return data;
}

const updateContact = async (contactId, body) => {}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
