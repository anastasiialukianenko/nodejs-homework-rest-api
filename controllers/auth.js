import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


import User from "../models/user.js";

import { HttpError } from "../helpers/index.js";

import { ctrlWrapper } from "../decorators/index.js";

import dotenv from "dotenv";
dotenv.config();

const {JWT_SECRET} = process.env;

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, `${email} in use`)
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ ...req.body, password: hashPassword });
    res.status(201).json({ 
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
        }
    })
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        throw HttpError(401, "Email not found");
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


export default {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateSubscription: ctrlWrapper(updateSubscription),
}