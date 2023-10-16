import { Schema, model } from "mongoose";
import { handleSaveError, runValidatorsAtUpdate } from "./hooks.js";
import Joi from 'joi';

const contactSchema = new Schema({
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
  },
      owner: {
      type: Schema.Types.ObjectId,
        ref: 'user',
      requierd: true,
    },
}, {versionKey: false, timestamps: true})
  
contactSchema.pre('findOneAndUpdate', runValidatorsAtUpdate);

contactSchema.post('save', handleSaveError);

contactSchema.post('findOneAndUpdate', handleSaveError);

const Contact = model('contact', contactSchema);

export const contactAddSchema = Joi.object({
        name: Joi.string().required().messages({
    'any.required': `Missing required "name" field`,
  }),
        email: Joi.string().required().messages({
    'any.required': `Missing required "email" field`,
  }),
        phone: Joi.string().min(2).required().messages({
    'any.required': `Missing required "phone" field`,
        }),
        favorite: Joi.boolean(),
})

export const contactUpdateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required()
});


export default Contact;