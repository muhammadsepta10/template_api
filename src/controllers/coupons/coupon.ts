import * as model from "./model"
import { NextFunction, Request, Response } from "express";
import { responseHandle, validateRequestQuery, errorHandle, randomString } from '../../config/baseFunction';
var filename = module.filename.split('/').slice(-1)[0];

export const insertCoupon = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const countCoupon = validateRequestQuery(req.body.count, "num")
        const lenghtCoupon = validateRequestQuery(req.body.length, "num")
        const allowedChar = validateRequestQuery(req.body.allowChar, "numChar")
        const frontText = validateRequestQuery(req.body.frontText, "numChar")
        const percentageCustom = frontText.length / lenghtCoupon * 100
        if (countCoupon == "" || lenghtCoupon == "" || allowedChar == "" || percentageCustom > 50) {
            return errorHandle(req, res, "Parameter not valid", filename, {}, 500)
        } else {
            responseHandle(req, res, "Success to coupon", filename, {}, 500)
            for (let index = 0; index < countCoupon; index++) {
                const coupon = await randomString(lenghtCoupon, allowedChar, frontText)
                let selectLength = 0
                const selectCupon = await model.checkCoupon(coupon).then((res: any) => selectLength = res.length).catch((err: any) => errorHandle(req, res, "Failed select coupon", "inserCoupon", err, 500))
                if (selectLength < 1) {
                    await model.insertCoupons(coupon).then((res: any) => console.log(res.insertId)).catch((err: any) => errorHandle(req, res, "Failed insert coupon", "inserCoupon", err, 500))
                } else {
                    index--
                }
            }
        }
    } catch (error) {
        next(error)
    }
}

export const checkCoupon = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const coupon = validateRequestQuery(req.params.coupon, "numChar")
        if (coupon == "") {
            return errorHandle(req, res, "Parameter not valid", "Check coupon", {}, 200)
        } else {
            const findCoupon: any = await model.checkCoupon(coupon)
            if (findCoupon.length != 1) {
                return responseHandle(req, res, "Kode Unik Not Found", "Check Coupon", {}, 200)
            } else {
                return responseHandle(req, res, "Kode Unik Available", "Check coupon", findCoupon[0], 200)
            }
        }
    } catch (error) {
        next(error)
    }
}