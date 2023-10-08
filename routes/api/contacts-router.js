import express from 'express';
import contactsController from '../../controllers/contacts-controllers.js';

import {isEmptyBody} from "../../middlewares/index.js";

import {validateBody} from "../../decorators/index.js";

import {contactAddSchema} from "../../schemas/contact-schemas.js";

const contactAddValidate = validateBody(contactAddSchema);



const router = express.Router()


router.get('/', contactsController.listContacts);

router.get('/:contactId', contactsController.getContactById);

router.post('/', isEmptyBody, contactAddValidate, contactsController.addContact);

router.put('/:contactId', isEmptyBody, contactAddValidate, contactsController.updateContactById);

router.delete('/:contactId', contactsController.removeContact);

export default router;

