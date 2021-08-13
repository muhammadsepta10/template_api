import { NextFunction, Request, Response } from 'express';
import { responseHandle, validateRequestQuery, errorHandle, vlaidateHp } from '../../config/baseFunction';
import * as model from "./model"
import axios from 'axios'
import moment from 'moment'

export const push = async (req: Request, res: Response, next: NextFunction) => {
    // let apiUrl: string = `http://10.2.16.47:8081/push`;
    try {
        const message = Buffer.from(req.body.message, "base64").toString('ascii')
        const sender = validateRequestQuery(req.body.sender, "num")
        const pushURL: any = await model.getGeneralParameter(4)
        const media = validateRequestQuery(req.body.media, "num")
        const direction = validateRequestQuery(req.body.direction, "num")
        const type = validateRequestQuery(req.body.type, "num")
        
        if (message == "" || sender == "" || media == "" || direction == "" || type == "") {
            return errorHandle(req, res, "message, sender is null", "pushMessage", [], 400)
        } else {
            const insertLog = {
                media: media,
                rcvdTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                hp: sender,
                message: message,
                direction: direction,
                profileId: 0,
                type: type
            }
    
            model.logRequest(insertLog)
            if (pushURL.length > 0) {
                await axios.post(pushURL[0].param, {
                    "message": message,
                    "to": sender,
                    // "media": media,
                    // "send_time": moment().format("DD-MM-YYYY")
                })
                return responseHandle(req, res, "Success", "pushMessage", [], 200)
            } else {
                return responseHandle(req, res, "Failed", "Something Went Wrong", [], 200)
            }
        }
    } catch (error) {
        next(error)
    }
}

export const getSender = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const getSender = await model.getSender()
        return responseHandle(req, res, "Success", "getSender", getSender, 200)
    } catch (error) {
        next(error)
    }
}