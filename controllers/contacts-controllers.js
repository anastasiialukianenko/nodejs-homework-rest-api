import * as contactsService from "../models/contacts.js";

import { HttpError } from "../helpers/index.js";

import { ctrlWrapper } from "../decorators/index.js";

async function listContacts(req, res, next) {
  const result = await contactsService.listContacts();
    res.json(result);
};

async function getContactById(req, res, next) {
 const { contactId } = req.params;
    const result = await contactsService.getContactById(contactId);

    if (!result) {
      throw HttpError(404, `Not Found`);
    }
  res.json(result);   
};

async function addContact(req, res, next) {
 const result = await contactsService.addContact(req.body);
    res.status(201).json(result);   
};

 async function updateContactById(req, res, next) {
 const { contactId } = req.params;

    const result = await contactsService.updateContactById(contactId, req.body);
    if (!result) {
      throw HttpError(404, `Not Found`);
    }
    res.status(200).json(result);  
};

async function removeContact(req, res, next) {
 const { contactId } = req.params;
  const result = await contactsService.removeContact(contactId);
 if (!result) {
      throw HttpError(404, `Not Found`);
  };
  res.status(200).json({
    message: "contact deleted"
  })
};

export default {
    listContacts: ctrlWrapper(listContacts),
    getContactById: ctrlWrapper(getContactById),
    addContact: ctrlWrapper(addContact),
    updateContactById: ctrlWrapper(updateContactById),
    removeContact: ctrlWrapper(removeContact),
}