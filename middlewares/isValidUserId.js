import { isValidObjectId } from "mongoose";
import { HttpError } from "../helpers/index.js";


const isValidUserId = (req, res, next) => {
    const { userId } = req.params;
    if (!isValidObjectId(userId)) {
        return next(HttpError(404, `Not valid id`))
    }
    next();
}

export default isValidUserId;