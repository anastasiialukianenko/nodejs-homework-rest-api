import Joi from 'joi';
import { HttpError } from "../helpers/index.js";


const contactAddSchema = Joi.object({
        name: Joi.string().required().messages({
    'any.required': `Missing required "name" field`,
  }),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] } }).required().messages({
    'any.required': `Missing required "email" field`,
  }),
        phone: Joi.string().min(2).required().messages({
    'any.required': `Missing required "phone" field`,
  }),
})

export const validateData = (req, res, next) => {
  try {
    if (!Object.keys(req.body).length) {
      throw HttpError(400, 'All fields are empty');
    }
    const { error } = contactAddSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    next();
  } catch (error) {
    next(error);
  }
};

