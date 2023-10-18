import Contact from "../models/contact.js";

import { HttpError } from "../helpers/index.js";

import { ctrlWrapper } from "../decorators/index.js";

async function listContacts(req, res, next) {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite} = req.query;
  const skip = (page - 1) * limit; 

 let query = { owner };
  
  if (favorite) {
  query.favorite = favorite === 'true';
  }

  const result = await Contact.find(query, '-createdAt -updatedAt', { skip, limit });
    res.json(result);
};
 
async function getContactById(req, res, next) {
  const { contactId } = req.params;
   const { _id: owner } = req.user;
  const result = await Contact.findOne({ _id: contactId, owner }).populate("owner", "email subscription");
  // const result = await Contact.findById(contactId);

    if (!result) {
      throw HttpError(404, `Not Found`);
    }
  res.json(result);   
};

async function addContact(req, res, next) {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
    res.status(201).json(result);   
}; 

 async function updateContactById(req, res, next) {
 const { contactId } = req.params;
   const { _id: owner } = req.user;
   
    const result = await Contact.findOneAndUpdate({ _id: contactId, owner }, req.body);
    if (!result) {
      throw HttpError(404, `Not Found`);
    }
    res.status(200).json(result);  
};

 async function updateStatusContact(req, res, next) {
 const { contactId } = req.params;
const { _id: owner } = req.user;
   
    const result = await Contact.findOneAndUpdate({ _id: contactId, owner }, req.body);
    if (!result) {
      throw HttpError(404, `Not Found`);
    }
    res.status(200).json(result);  
};



async function removeContact(req, res, next) {
  const { contactId } = req.params;
  
  const { _id: owner } = req.user;
   
    const result = await Contact.findOneAndDelete({ _id: contactId, owner });
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
    updateStatusContact: ctrlWrapper(updateStatusContact),
    removeContact: ctrlWrapper(removeContact),
}