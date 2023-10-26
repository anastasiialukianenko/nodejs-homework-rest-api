import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from 'gravatar';
import fs from 'fs/promises';
import path from "path";
import jimp from 'jimp';
import { nanoid } from "nanoid";

import User from "../models/user.js";

import { HttpError, sendEmail } from "../helpers/index.js";

import { ctrlWrapper } from "../decorators/index.js";

import dotenv from "dotenv";
dotenv.config();

const { JWT_SECRET, BASE_URL } = process.env;

const avatarPath = path.resolve("public", "avatars");


const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, `${email} in use` )
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email, { s: '200', d: 'retro' }, true);
    const verificationToken = nanoid();

    const newUser = await User.create({ ...req.body, avatarURL, password: hashPassword, verificationToken });

    const verifyEmail = {
  to: email,
  subject: "Verify email",
  html: `<a target="_blank" href="${BASE_URL}/api/user/verify/${verificationToken}">Click to verify email</a>`
    }
    await sendEmail(verifyEmail);

    res.status(201).json({ 
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
            avatarURL,
        }
    })
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        throw HttpError(401, "Email not found");
    }
    if (!user.verify) {
        throw HttpError(401, "Email not verify");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    }
    const payload = {
        id: user._id,
    }
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });
    
     res.json({
         token,
         user: {
             email: user.email,
             subscription: user.subscription}
    })
}

const verify = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken })
    if (!user) {
        throw HttpError(404, 'User not found')
    }

    await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: null})

  res.status(200).json({
            message: 'Verification successful',
    })
}

const resendVerifyEmail = async (req, res) => {

    const { verificationToken } = req.params;
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(404, 'Email not found')
    }
     if (user.verify) {
        throw HttpError(400, "Verification has already been passed")
     }
    const verifyEmail = {
  to: email,
  subject: "Verify email",
  html: `<a target="_blank" href="${BASE_URL}/api/user/verify/${user.verificationToken}">Click to verify email</a>`
    }
   await sendEmail(verifyEmail);
    
  res.status(200).json({
            message: "Verification email sent",
    })
}

const getCurrent = async (req, res) => {
    const { email, subscription } = req.user;
  res.json({
             email,
             subscription,
    })
}

const logout = async (req, res) => {
await User.findByIdAndUpdate(req.user._id, { token: ""});

  res.status(204).send();
}

const updateSubscription = async (req, res) => {

const { subscription } = req.body;
    const { userId } = req.params;
   
    const result = await User.findOneAndUpdate({ _id: userId }, { subscription });
    if (!result) {
      throw HttpError(404, `Not Found`);
    }
    res.status(200).json(result);  
}

const updateAvatar = async (req, res) => {
    const userId = req.user._id;
    const { path: oldPath } = req.file;

    const image = await jimp.read(oldPath);
    await image.cover(250, 250).writeAsync(oldPath);

    const fileName = `avatar-${userId}-${Date.now()}.png`;
    const newPath = path.join(avatarPath, fileName);
    await fs.rename(oldPath, newPath);
    const avatarURL = path.join("/avatars", fileName);

    await User.findOneAndUpdate({ _id: userId }, { avatarURL });

    res.status(200).json({  "avatarURL": avatarURL });
}


export default {
    register: ctrlWrapper(register),
    verify: ctrlWrapper(verify),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateSubscription: ctrlWrapper(updateSubscription),
    updateAvatar: ctrlWrapper(updateAvatar),
}