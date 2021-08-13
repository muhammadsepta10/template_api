import { NextFunction, Request, Response } from "express";
import * as model from "./model";
import { errorHandle, responseHandle, validateRequestQuery } from '../../config/baseFunction';

export const getMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let response: any = await model.getmessageprofile();
        return responseHandle(req, res, "success", "getmessage", { response }, 200)
    } catch (error) {
        next(error)
    }
}