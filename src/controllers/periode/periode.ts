import { NextFunction, Request, Response } from "express";
import * as model from "./model";
import { responseHandle, validateRequestQuery, errorHandle } from '../../config/baseFunction';
import moment from "moment"

export const list = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const listPeriode = await model.list()
        return responseHandle(req, res, "success", "list", listPeriode, 200)
    } catch (error) {
        next(error)
    }
}

export const insertPeriode = async (req: Request, res: Response, next: NextFunction) => {
    let periode = validateRequestQuery(req.body.periode, "num");
    let startDate = validateRequestQuery(req.body.startDate, "any");
    const startValidate = moment(startDate, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss").toUpperCase()
    let endDate = validateRequestQuery(req.body.endDate, "any");
    const endValidate = moment(endDate, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss").toUpperCase()

    try {
        if (periode == "" || startValidate == "" || endValidate == "") {
            errorHandle(req, res, "periode, startDate, endDate kosong", "users", [], 500)
        }
        const startCompare = moment(startValidate).isSameOrBefore()
        let startValue = ""
        if (startCompare) {
            startValue = `<='${startValidate}'`
        } else {
            startValue = `='${startValidate}'`
        }
        const endCompare = moment(endValidate).isSameOrBefore()
        let endValue = ""
        if (endCompare) {
            endValue = `<='${endValidate}'`
        } else {
            endValue = `='${endValidate}'`
        }
        await model.insertPeriode(periode, startValue, endValue);
        responseHandle(req, res, "insert data success", "users", [], 200)
    } catch (err) {
        next(err)
    }
}

export const editPeriode = async (req: Request, res: Response, next: NextFunction) => {
    let periode = validateRequestQuery(req.body.periode, "num");
    let startDate = validateRequestQuery(req.body.startDate, "any");
    const startValidate = moment(startDate, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss").toUpperCase()
    let endDate = validateRequestQuery(req.body.endDate, "any");
    const endValidate = moment(endDate, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss").toUpperCase()
    let id = validateRequestQuery(req.body.id, "num");

    try {
        if (periode == "" || startValidate == "" || endValidate == "") {
            errorHandle(req, res, "periode, startDate, endDate kosong", "users", [], 500)
        }
        const startCompare = moment(startValidate).isSameOrBefore()
        let startValue = ""
        if (startCompare) {
            startValue = `<='${startValidate}'`
        } else {
            startValue = `='${startValidate}'`
        }
        const endCompare = moment(endValidate).isSameOrBefore()
        let endValue = ""
        if (endCompare) {
            endValue = `<='${endValidate}'`
        } else {
            endValue = `='${endValidate}'`
        }
        await model.insertPeriode(periode, startValue, endValue);
        responseHandle(req, res, "insert data success", "users", [], 200)
    } catch (err) {
        next(err)
    }
}