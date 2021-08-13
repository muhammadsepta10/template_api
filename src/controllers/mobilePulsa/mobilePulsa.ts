import { NextFunction, Request, Response } from 'express';
import { responseHandle, validateRequestQuery, errorHandle } from '../../config/baseFunction';
import * as model from "./model"
import axios from "axios"
let generalParameter:any = {}

export const sendPulsa = async (req: Request, res: Response, next: NextFunction) => {
    let apiUrl: string = `http://localhost:5006/api/v1/mobilePulsa/topupPulsa`;
    try {
        const user = res.locals.id
        const userId = +validateRequestQuery(user.id,"num")||0
        if (Object.keys(generalParameter).length === 0 && generalParameter.constructor === Object) {
            await model.generalParameter().then(val=>{
                if (val.length>0) {
                    for (let index = 0; index < val.length; index++) {
                        generalParameter[val[index].description] = typeof val[index].param == "number"?(+val[index].param):val[index].param
                    }
                }
                return true
            })
        }
        const id = validateRequestQuery(req.body.id, "num")
        const type = validateRequestQuery(req.body.type,"num")
        if (id == "") {
            return errorHandle(req, res, "id is null", "sendPulsa", [], 400)
        } else {
            let getWinner: any = await model.getWinner(id)
            if (getWinner.length < 1) {
                return errorHandle(req, res, "id is null", "sendPulsa", [], 400)
            } else {
                const counting = validateRequestQuery(getWinner[0].counting, "num") === "" ? 0 : parseInt(validateRequestQuery(getWinner[0].counting, "num"))
                const allocationId = validateRequestQuery(getWinner[0].allocation_id, "num") === "" ? 0 : parseInt(validateRequestQuery(getWinner[0].allocation_id, "num"))
                let hp = getWinner[0].account_number
                let amount = getWinner[0].nominal
                let topup_by = getWinner[0].topup_by
                const checkAccount = await model.checkAccountNumber(hp).then((val):number=>{
                    if (val.length<1) {
                        return 0
                    } else {
                        return +val[0].counts
                    }
                })
                if (checkAccount>=generalParameter.maxSameNumber && type=="") {
                    await model.updateStatusWinner(id,5,userId)
                    return res.send({ message: "Waiting For Approved", data: {} })
                }
                if (type==2) {
                    await model.rejectWinner(id,6,userId)
                    return res.send({ message: "Data Is Rejected", data: {} })
                }
                if (counting >= 3) {
                    await model.resetAllocation(allocationId)
                    await model.updateStatusWinner(id, 4,userId)
                    return res.send({ message: "Allocation is Reset", data: {} })
                } else {
                    if (topup_by==userId) {
                        return res.send({message:"You Can't approve this data",data:{}})
                    }
                    await model.approveWinner(id,userId)
                    await axios.post(apiUrl, {
                        amount,
                        hp,
                        winnerId: id
                    })
                    return responseHandle(req, res, "Success", "sendPulsa", [], 200)
                }
            }
        }
    } catch (error) {
        next(error)
    }
}

export const checkStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = validateRequestQuery(req.params.id, "num")
        if (id == "") {
            return res.status(400).send({ message: "Paramereter not valid", dat: {} })
        } else {

        }
    } catch (error) {
        next(error)
    }
}