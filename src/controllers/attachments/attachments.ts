import { Request, Response } from "express"
import { errorHandle, validateRequestQuery, responseHandle } from '../../config/baseFunction'
var filename = module.filename.split('/').slice(-1)[0];
import * as model from "./model"

export const getAttachment = async (req: Request, res: Response) => {
    try {
        // const url = req.protocol + '://' + req.headers.host + "/"
        const sender = validateRequestQuery(req.params.sender, "num")
        const startDate: any = validateRequestQuery(req.query.startDate, "any");
        const endDate: any = validateRequestQuery(req.query.endDate, "any");
        let params = {
            startDate: startDate,
            endDate: endDate
        };
        if (sender == "") {
            return errorHandle(req, res, "Parameter not found", "attachment", filename, 500)
        } else {
            const dataAttachment = await model.getAttachment(sender, params)
            return responseHandle(req, res, "Success get data", "attachment", dataAttachment, 200)
        }
    } catch (error) {
        return errorHandle(req, res, "ERROR", "attachment", filename, error)
    }
}

export const setAttachment = async (req: Request, res: Response) => {
    try {
        // const url = req.protocol + '://' + req.headers.host + "/"
        const attId = validateRequestQuery(req.body.attId, "num")
        const id = validateRequestQuery(req.body.id, "num")
        if (attId == "" || id == "") {
            return errorHandle(req, res, "Parameter not found", "attachment", filename, 500)
        } else {
            await model.chooseAttachment(attId, id)
            return responseHandle(req, res, "Success", "attachment", {}, 200)
        }
    } catch (error) {
        return errorHandle(req, res, "ERROR", "attachment", filename, error)
    }
}