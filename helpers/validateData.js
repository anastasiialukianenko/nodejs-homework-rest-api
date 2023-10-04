import { contactAddSchema } from "../helpers/schems.js"
import { HttpError } from "../helpers/index.js";


export const validateData = (req, res, next) => {
  try {
    if (!Object.keys(req.body).length) {
      throw HttpError(400, "missing fields");
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

