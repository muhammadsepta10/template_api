import { NextFunction, Request, Response } from 'express';
import * as model from "./model";
import { loadExcel, pagination, validateRequestQuery, errorHandle, responseHandle, parsingIdentity } from '../../config/baseFunction';

export const checkKtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const codeKtp = validateRequestQuery(req.params.ktp, "num")
        if (codeKtp.length < 16) {
            return res.status(400).send({ message: "Nomor NIK harus 16 digit", data: {} })
        } else {
            const parsing = await parsingIdentity(codeKtp)
            return res.send({ message: "Success", data: parsing })
        }
    } catch (error) {
        next(error)
    }
}

export const inputCodeRegion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const province = validateRequestQuery(req.body.province, "charSpace").toUpperCase()
        const regency = validateRequestQuery(req.body.regency, "charSpace").toUpperCase()
        const district = validateRequestQuery(req.body.district, "charSpace").toUpperCase()
        const codeRegion = validateRequestQuery(req.body.code, "num")
        if (codeRegion.length != 6) {
            return res.status(400).send({ message: "Parameter not valid", data: {} })
        } else {
            if (province != "") {
                await model.insertProvince(codeRegion.substring(0, 2), province)
            }
            if (regency != "") {
                await model.insertRegency(codeRegion.substring(0, 4), regency, codeRegion.substring(0, 2))
            }
            if (district != "") {
                await model.insertDistrict(codeRegion, district, codeRegion.substring(0, 4))
            }
            return res.send({ message: "Success", data: {} })
        }
    } catch (error) {
        next(error)
    }
}