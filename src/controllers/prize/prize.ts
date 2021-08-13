import * as model from "./model"
import { Request, Response, NextFunction } from 'express';
import { errorHandle, responseHandle, pagination, validateRequestQuery } from '../../config/baseFunction';
import { generalParameter } from './model';
import moment from 'moment';

export const list = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await model.getAll()
        return responseHandle(req, res, "SUCCESS", "prizeList", data, 200)
    } catch (error) {
        next(error)
    }
}

export const summary = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await model.summdaryData()
        let tempPrize = ["pls5rb", "pls10rb", "lm5gr", "ut100Jt"]
        let fixData: any = []
        let dateTemp = ""
        let dataObj: any = {}
        for (let index = 0; index < data.length; index++) {
            const prizeCode = data[index].code
            const date = moment(data[index].date).format("YYYY-MM-DD")
            const qtyAll = parseInt(data[index].quantity)
            const qtyUsed = parseInt(data[index].used)
            const qtyUnused = qtyAll - qtyUsed
            if (date != dateTemp) {
                dateTemp = date
                if (Object.keys(dataObj).length != 0 && dataObj.constructor === Object) {
                    for (let index = 0; index < tempPrize.length; index++) {
                        const prizeCode = tempPrize[index]
                        dataObj[`${prizeCode}All`] = 0
                        dataObj[`${prizeCode}Unused`] = 0
                        dataObj[`${prizeCode}Used`] = 0
                    }
                    fixData.push(dataObj)
                    dataObj = {}
                }
            }
            if (dateTemp == date) {
                dataObj["date"] = date
                const idxTempCtgr = tempPrize.indexOf(prizeCode, 0);
                if (idxTempCtgr > -1) {
                    tempPrize.splice(idxTempCtgr, 1);
                }
                if (dataObj[`${prizeCode}Used`] && dataObj[`${prizeCode}All`]) {
                    dataObj[`${prizeCode}All`] += qtyAll
                    dataObj[`${prizeCode}Used`] += qtyUsed
                    dataObj[`${prizeCode}Unused`] += qtyUnused
                } else {
                    dataObj[`${prizeCode}All`] = qtyAll
                    dataObj[`${prizeCode}Unused`] = qtyUnused
                    dataObj[`${prizeCode}Used`] = qtyUsed
                }
            }
        }
        if (Object.keys(dataObj).length != 0 && dataObj.constructor === Object) {
            for (let index = 0; index < tempPrize.length; index++) {
                const prizeCode = tempPrize[index]
                dataObj[`${prizeCode}All`] = 0
                dataObj[`${prizeCode}Unused`] = 0
                dataObj[`${prizeCode}Used`] = 0
            }
            fixData.push(dataObj)
            dataObj = {}
        }
        return res.send({ message: "success", data: fixData })
    } catch (error) {
        next(error)
    }
}

export const listPrizePulsa = async (req: Request, res: Response, next: NextFunction) => {
    let apiUrl: string = `/api/v1/prizeSummary/pulsa`;
    let result: any = {};
    const dataPerPage: number =
        validateRequestQuery(req.query.row, "numChar") == ""
            ? 10
            : validateRequestQuery(req.query.row, "num");
    const key: string = validateRequestQuery(req.query.key, "numCharSpace");
    const page: number = validateRequestQuery(req.query.page, "num");
    const media: string = validateRequestQuery(req.query.media, "num");
    const column: string = validateRequestQuery(req.query.order, "any");
    const direction = validateRequestQuery(
        req.query.orderCondition,
        "char"
    ).toUpperCase();
    const status = validateRequestQuery(req.query.status, "num")
    const pulsaType = validateRequestQuery(req.query.pulsaType, 'num')
    const startDate = validateRequestQuery(req.query.startDate, "any")
    const endDate = validateRequestQuery(req.query.endDate, "any")

    try {
        let params = {
            startDate: startDate,
            endDate: endDate,
            key: key,
            column: column,
            direction: direction,
            limitQuery: "",
            status: status,
            pulsaType: pulsaType,
            media
        };
        let countPrizePulsa: any = await model.countPrizePulsa(params);
        result.countPrizePulsa = countPrizePulsa;

        let totalPrizePulsa = countPrizePulsa[0].counts;
        let paginations: any = await pagination(page, dataPerPage, totalPrizePulsa);
        let nextPage =
            paginations.currentPage == paginations.totalPage
                ? null
                : `${apiUrl}?dataPerPage=${dataPerPage}&page=${paginations.currentPage + 1
                }&key=${key}&column=${column}&direction=${direction}&status=${status}`;
        let prevPage =
            paginations.currentPage == 1
                ? null
                : `${apiUrl}?dataPerPage=${dataPerPage}&page=${paginations.currentPage - 1
                }&key=${key}&column=${column}&direction=${direction}&status=${status}`;

        params.limitQuery = paginations.query
        let list_prizePulsa: any = await model.listPrizePulsa(params);
        result.listPrizePulsa = list_prizePulsa;

        const data = {
            dataPerPage: paginations.dataPerPage,
            currentPage: paginations.currentPage,
            totalData: paginations.totalData,
            totalPage: paginations.totalPage,
            nextPage: nextPage,
            prevPage: prevPage,
            data: list_prizePulsa,
        }
        return responseHandle(req, res, "Success to get data", "listPrizePulsa", data, 200)
    } catch (err) {
        next(err)
    }
};

export const summaryDeposit = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const generalParameter = await model.generalParameter()
        const objParameter: any = () => {
            let data: any = {}
            for (let index = 0; index < generalParameter.length; index++) {
                const param = generalParameter[index].param
                const description = generalParameter[index].description
                data[description] = param
            }
            return data
        }
        const data = await model.sumWinPulsa()
        const deposit = objParameter().deposit
        return res.send({
            message: "Success", data: {
                deposit: parseInt(deposit),
                data
            }
        })
    } catch (error) {
        next(error)
    }
}

export const updateGeneralParameter = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = validateRequestQuery(req.body.id, "num")
        const value = validateRequestQuery(Buffer.from(req.body.value, "base64").toString("ascii"), "any")
        if (id == "" || value == "") {
            return res.status(400).send({ message: "Parameter not valid", data: {} })
        } else {
            await model.editGeneralParameter(id, value)
            return res.send({ message: "Success to Update", data: {} })
        }
    } catch (error) {
        next(error)
    }
}

export const listGeneralParameter = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await model.generalParameter()
        return res.send({ message: "Success", data })
    } catch (error) {
        next(error)
    }
}

export const prizeSettinglist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prizeSettinglist = await model.prizeSettinglist()
        return responseHandle(req, res, "Success to get data", "prizeSettinglist", prizeSettinglist, 200)
    } catch (error) {
        next(error)
    }
}

export const updatePrizeSetting = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = validateRequestQuery(req.body.id, "num")
        const startTime = moment(req.body.startTime, "HH:mm:ss").format("HH:mm:ss").toUpperCase()
        const endTime = moment(req.body.endTime, "HH:mm:ss").format("HH:mm:ss").toUpperCase()
        const enabled = validateRequestQuery(req.body.enabled, "num") == "" ? 0 : validateRequestQuery(req.body.enabled, "num")
        const limit = validateRequestQuery(req.body.limit, "num") == "" ? 0 : validateRequestQuery(req.body.limit, "num")
        const interval = validateRequestQuery(req.body.interval, "num") == "" ? 0 : validateRequestQuery(req.body.interval, "num")
        if (id == "" || startTime == "INVALID DATE" || endTime == "INVALID DATE") {
            return errorHandle(req, res, "Parameter not valid", "Update prize setting", {}, 404)
        } else {
            await model.updatePrizeSetting(startTime, endTime, enabled, limit, interval, id)
            return responseHandle(req, res, "Success", "Update Seeting prize", {}, 200)
        }
    } catch (error) {
        next(error)
    }
}

export const addAllocation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prizeId = validateRequestQuery(req.body.prize_id, "num")
        const total = validateRequestQuery(req.body.total, "num")
        const dates = validateRequestQuery(req.body.date, "date")
        if (prizeId == "" || total == "" || dates == "") {
            return errorHandle(req, res, "Parameter not valid", "Update prize setting", {}, 400)
        } else {
            let values = []
            for (let index = 0; index < total; index++) {
                values.push(`(${prizeId},"${dates}")`)
            }
            await model.insertAllocation(values.join(","))
            return res.send({ message: "Success", data: {} })
        }
    } catch (error) {
        next(error)
    }
}

export const deleteAllocation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prizeId = validateRequestQuery(req.body.prize_id, "num")
        const total = validateRequestQuery(req.body.total, "num")
        const dates = validateRequestQuery(req.body.date, "date")
        if (prizeId == "" || total == "" || dates == "") {
            return errorHandle(req, res, "Parameter not valid", "Update prize setting", {}, 400)
        } else {
            const deleted = await model.deleteAllocation(prizeId, dates, total)
            return res.send({ message: "Success", data: {} })
        }
    } catch (error) {
        next(error)
    }
}

export const totalAllocation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prizeId = validateRequestQuery(req.params.prize_id, "num")
        const dates = validateRequestQuery(Buffer.from(req.params.date, "base64").toString("ascii"), "date")
        if (prizeId == "" || dates == "") {
            return errorHandle(req, res, "Parameter not valid", "Update prize setting", {}, 400)
        } else {
            const data = await model.countAllocation(prizeId, dates)
            const count = data.length < 1 ? 0
                : validateRequestQuery(data[0].counts, "num") == "" ? 0
                    : parseInt(validateRequestQuery(data[0].counts, "num"))
            return res.send({ message: "Success", data: { count } })
        }
    } catch (error) {
        next(error)
    }
}

export const updateAllocation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dateFrom = validateRequestQuery(req.body.dateFr, "any")
        const prizeId = validateRequestQuery(req.body.prizeId, "num")
        const dateTo = validateRequestQuery(req.body.dateTo, "any")
        // const prizeTo = validateRequestQuery(req.body.prizeTo, "num")
        const quantity = validateRequestQuery(req.body.quantity, "num") == "" ? 0 : parseInt(validateRequestQuery(req.body.quantity, "num"))
        // const datetoEncode = Buffer.from(dateTo, "base64").toString("ascii").replace(/[^0-9-]/g, "")
        // const datefromEncode = Buffer.from(dateFrom, "base64").toString("ascii").replace(/[^0-9-]/g, "")
        if (dateFrom == "" || prizeId == "" || dateTo == "" || quantity == 0) {
            return errorHandle(req, res, "Parameter not valid", "Update Allocation", {}, 400)
        } else {
            await model.updateAllocation(dateFrom, dateTo, prizeId, quantity)
            return responseHandle(req, res, "Success", "Update Allocation", {}, 200)
        }
    } catch (error) {
        next(error)
    }
}