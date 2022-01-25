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

async function addContact(name, email, phone) {
  const allContacts = await listContacts();
  const generatedId = allContacts.length + 1
  const data = {id: `${generatedId}`, name, email, phone};
  allContacts.push(data);
  await fs.writeFile(filePath, JSON.stringify(allContacts));
  return data;
}

const updateContact = async (contactId, body) => {
  const { name, email, phone } = body
  const allContacts = await listContacts();
  const index = allContacts.findIndex(contact => contact.id === `${contactId}`)
  if (index === -1 ) {
    return null;
  }
  allContacts[index] = { ...allContacts[index], name, email, phone }
  await fs.writeFile(filePath, JSON.stringify(allContacts));
  return allContacts[index];
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
