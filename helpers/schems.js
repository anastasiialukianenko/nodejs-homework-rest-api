import Joi from 'joi';

export const contactAddSchema = Joi.object({
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