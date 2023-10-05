import express from 'express';
import { listContacts, getContactById, addContact, removeContact, updateContactById } from '../../controllers/controllers.js';
import { validateData } from '../../helpers/validateData.js';

const router = express.Router()


router.get('/', listContacts);

router.get('/:contactId', getContactById);

router.post('/', validateData, addContact);

router.delete('/:contactId', removeContact);

router.put('/:contactId', validateData, updateContactById);

export default router;

