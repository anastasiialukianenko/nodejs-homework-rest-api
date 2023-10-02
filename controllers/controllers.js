import * as contactsService from "../models/contacts.js";

import { HttpError } from "../helpers/index.js";

export async function listContacts(req, res, next) {
  try {
    const result = await contactsService.listContacts();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export async function getContactById(req, res, next) {
  try {
    const { contactId } = req.params;
    const result = await contactsService.getContactById(contactId);

    if (!result) {
      throw HttpError(404, `Not Found`);
    }
  res.json(result);   
  } catch (error) {
    next(error);
  }
};

export async function addContact(req, res, next) {
 try {
    const result = await contactsService.addContact(req.body);
    res.status(201).json(result);   
    
  } catch (error) {
    next(error);
  }
};

export async function updateContactById(req, res, next) {
 try {
    const { contactId } = req.params;

    const result = await contactsService.updateContactById(contactId, req.body);
    if (!result) {
      throw HttpError(404, `Not Found`);
    }
    res.status(200).json(result);   
    
  } catch (error) {
    next(error);
  }
};

export async function removeContact(req, res, next) {
 try { 
  const { contactId } = req.params;
  const result = await contactsService.removeContact(contactId);
 if (!result) {
      throw HttpError(404, `Not Found`);
  };
  res.status(200).json({
    message: "contact deleted"
  })

} catch (error) {
     next(error);
  }
};

