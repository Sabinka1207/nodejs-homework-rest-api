/* eslint-disable new-cap */
const express = require('express')
const createError = require("http-errors")
const Joi = require('joi')
const contactsSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required()
})

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts")

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const contacts = await listContacts()
    if (!contacts) { 
      throw new createError(404, "Not found")
    }
    res.json(contacts)  
  } catch (error) {
  
    next(error)
  }

})

router.get('/:contactId', async (req, res, next) => {
  try {
    const id = req.params.contactId
    const contact = await getContactById(id) 
    if (!contact) { 
      throw new createError(404, "Not found")

      // const error = new Error("Not found")
      // error.status = 404
      // throw error

    //   res.status(404).json({
    //   message: "Not found"
    // })
    }
    res.json(contact)
  } catch (error) {
    // res.status(500).json({
    //   message: "Server error"
    // })
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { error } = contactsSchema.validate(req.body)
    if (error) { 
      throw new createError(400, error.message)
    }
    const { name, email, phone } = req.body
    const addedContact = await addContact(name, email, phone)
    res.status(201).json(addedContact)   
  } catch (error) {
    
  }

})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const id = req.params.contactId
    const updatedList = await removeContact(id) 
    if (!updatedList) { 
      throw new createError(404, "Not found")
    }
    res.json(updatedList)
  } catch (error) {
      next(error)
  }
})

router.put('/:contactId', async (req, res, next) => {
  try {
    const { error } = contactsSchema.validate(req.body)
    if (error) { 
      throw new createError(400, error.message)
    }
    const id = req.params.contactId
    const body = req.body
    const updatedContact = await updateContact(id, body) 
    if (!updatedContact) { 
      throw new createError(404, "Not found")
    }
    res.json(updatedContact)
  } catch (error) {
      next(error)
  }
})

module.exports = router
