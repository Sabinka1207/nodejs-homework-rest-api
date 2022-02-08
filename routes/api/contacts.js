/* eslint-disable new-cap */
const express = require("express");
const createError = require("http-errors");
const Contact = require("../../models/contact");
const { authenticate } = require("../../middlewares/authentificate");
const router = express.Router();

router.get("/", authenticate, async (req, res, next) => {
  try {
    const { _id } = req.user;
    const contacts = await Contact.find({ owner: _id }).populate("owner");
    if (!contacts) {
      throw new createError(404, "Not found");
    }
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const id = req.params.contactId;
    const contact = await Contact.findById(id);
    if (!contact) {
      throw new createError(404, "Not found");
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
});

router.post("/", authenticate, async (req, res, next) => {
  try {
    console.log(req.body);
    const data = { ...req.body, owner: req.user._id };
    const addedContact = await Contact.create(data);
    res.status(201).json(addedContact);
  } catch (error) {
    if (error.message.includes("validation failed")) {
      error.status = 400;
    }
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const id = req.params.contactId;
    const updatedList = await Contact.findByIdAndDelete(id);
    if (!updatedList) {
      throw new createError(404, "Not found");
    }
    res.json(updatedList);
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const id = req.params.contactId;
    const body = req.body;
    const updatedContact = await Contact.findByIdAndUpdate(id, body);
    if (!updatedContact) {
      throw new createError(404, "Not found");
    }
    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/favorite/", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
    if (!result) {
      throw new createError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
