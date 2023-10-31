import { Schema, model } from "mongoose";
import { handleSaveError, runValidatorsAtUpdate } from "./hooks.js";
import Joi from 'joi';

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;  

const userSchema = new Schema( {
  password: {
        type: String,
      minlength: 6,
    required: [true, 'Set password for user'],
  },
  email: {
    type: String,
      required: [true, 'Email is required'],
      match: emailRegexp,
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  avatarURL: {
    type: String,
  },
  token: {
    type: String,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
}, {versionKey: false, timestamps: true})
  
userSchema.pre('findOneAndUpdate', runValidatorsAtUpdate);

userSchema.post('save', handleSaveError);

userSchema.post('findOneAndUpdate', handleSaveError);

const User = model('user', userSchema);

export const userRegisterSchema = Joi.object({
        password: Joi.string().min(6).required().messages({
    'any.required': `Missing required "password" field`,
  }),
        email: Joi.string().pattern(emailRegexp).required().messages({
    'any.required': `Missing required "email" field`,
  }),
  subscription: Joi.string(),
        token: Joi.string(),
})

export const userLoginSchema = Joi.object({
        password: Joi.string().min(6).required().messages({
    'any.required': `Missing required "password" field`,
  }),
        email: Joi.string().pattern(emailRegexp).required().messages({
    'any.required': `Missing required "email" field`,
  }),
        token: Joi.string(),
})


export const userVerifySchema = Joi.object({
        email: Joi.string().pattern(emailRegexp).required().messages({
    'any.required': `Missing required field "email"`,
  }),
})

export default User;

