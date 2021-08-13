import { NextFunction, Request, Response } from "express";
import * as model from "./model";
import { responseHandle, validateRequestQuery } from '../../../config/baseFunction';
var filename = module.filename.split('/').slice(-1)[0];

let dataNotFound: { message: string; data: string[] } = {
    message: "Data Not Found",
    data: [],
};

export const countRegistered = async (req: Request, res: Response, next: NextFunction) => {
    let apiUrl = `/api/v1/dashboard/regsummary`;
    let clientRequest = {
        query: req.query,
        params: req.params,
        body: req.body,
    };
    let result: any = {};
    const subtract = validateRequestQuery(req.query.subtract, "num") == 1 ? 1 : 0
    const monthYear = validateRequestQuery(req.query.monthYear, "any");
    const month = monthYear.substring(5, 7);
    const year = monthYear.substring(0, 4);
    const condition =
        validateRequestQuery(req.query.condition, "char") == "DAILY"
            ? 1
            : validateRequestQuery(req.query.condition, "char") == "WEEKLY"
                ? 2
                : validateRequestQuery(req.query.condition, "char") == "MONTHLY"
                    ? 3
                    : 0;
    try {
        let params = {
            condition: condition,
            month: month,
            year: year,
            subtract: subtract
        };
        if (condition == 0) {
            responseHandle(req, res, "Wrong parameter", "regSummary", [], 400)
        } else {
            let countRegistered: any = await model.countRegistered(params)
            const countRegisteredSubmit: any = await model.countRegisteredSubmit(params);
            // data only
            const data = {
                totalreg: countRegistered,
                totalregValid: countRegisteredSubmit[0].totalRegisteredValid,
                totalregInvalid: countRegisteredSubmit[0].totalRegisteredInvalid,
                total: countRegisteredSubmit[0].total
            }
            return responseHandle(req, res, "Success to get data", "regsummary", data, 200)
        }

    } catch (err) {
        next(err)
    }
};
