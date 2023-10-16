import express from 'express';
import contactsController from '../../controllers/contacts.js';

import {authenticate, isEmptyBody, isEmptyFavoriteBody, isValidId} from "../../middlewares/index.js";

import {validateBody} from "../../decorators/index.js";
import { contactAddSchema, contactUpdateFavoriteSchema} from '../../models/contact.js';


const contactAddValidate = validateBody(contactAddSchema);
const contactUpdateFavoriteValidate = validateBody(contactUpdateFavoriteSchema);


const router = express.Router()

router.use(authenticate);

router.get('/', contactsController.listContacts);

router.get('/:contactId', isValidId, contactsController.getContactById);

router.post('/', isEmptyBody, contactAddValidate, contactsController.addContact);

router.put('/:contactId', isValidId, isEmptyBody, contactAddValidate, contactsController.updateContactById);

router.patch('/:contactId/favorite', isValidId, isEmptyFavoriteBody, contactUpdateFavoriteValidate, contactsController.updateStatusContact);   

router.delete('/:contactId', isValidId, contactsController.removeContact);

export default router;

