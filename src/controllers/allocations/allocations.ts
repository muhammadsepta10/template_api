import { NextFunction, Request, Response, response } from 'express';
import * as model from "./model"
import { validateRequestQuery, pagination, loadExcel, responseHandle, errorHandle } from '../../config/baseFunction';
import moment from "moment"

export const listAllocations = async (req: Request, res: Response, next: NextFunction) => {
    let apiUrl: string = `/api/v1/alocations`;
    let result: any = {};
    try {
        const dataPerPage: number =
            validateRequestQuery(req.query.row, "num") == 0
                ? 10
                : parseInt(validateRequestQuery(req.query.row, "num"));
        const page: number = parseInt(validateRequestQuery(req.query.page, "num"));
        const column: string = validateRequestQuery(req.query.order, "any");
        const type : number = parseInt(validateRequestQuery(req.query.type, "num"));
        const direction = validateRequestQuery(
            req.query.orderCondition,
            "char"
        ).toUpperCase();
        const condition =
            validateRequestQuery(req.query.condition, "char").toUpperCase() == "DAILY"
                ? 1
                : validateRequestQuery(req.query.condition, "char").toUpperCase() == "WEEKLY"
                    ? 2
                    : validateRequestQuery(req.query.condition, "char").toUpperCase() == "MONTHLY"
                        ? 3
                        : 0;
        if (condition == 0) {
            return errorHandle(req, res, "Parameter not valid", "List allocation", {}, 500)
        }
        let params = {
            column: column,
            direction: direction,
            limitQuery: "",
            condition: condition,
            type: type
        };
        const countsAllocations = await model.countAllcoations(params)
        result.countAllocations = countsAllocations
        if(result.countAllocations.length == 0){
            const paginations = await pagination(page, dataPerPage, 0)    
            result.paginations = paginations
            let nextPage =
                result.paginations.currentPage == result.paginations.totalPage
                    ? null
                    : `${apiUrl}?dataPerPage=${dataPerPage}&page=${result.paginations.currentPage + 1}&order=${column}&orderCondition=${direction}`;
            let prevPage =
                result.paginations.currentPage == 1
                    ? null
                    : `${apiUrl}?dataPerPage=${dataPerPage}&page=${result.paginations.currentPage - 1
                    }&order=${column}&orderCondition=${direction}`;
            params.limitQuery = result.paginations.query
            const listAlocaionts = await model.listAllocations(params)
            const data = {
                dataPerPage: result.paginations.dataPerPage,
                currentPage: result.paginations.currentPage,
                totalData: result.paginations.totalData,
                totalPage: result.paginations.totalPage,
                nextPage: nextPage,
                prevPage: prevPage,
                data: listAlocaionts
            }
            return responseHandle(req, res, "Success", "listAllocations", data, 200)
        } else {
            const paginations = await pagination(page, dataPerPage, result.countAllocations[0].counts)
            result.paginations = paginations
        let nextPage =
            result.paginations.currentPage == result.paginations.totalPage
                ? null
                : `${apiUrl}?dataPerPage=${dataPerPage}&page=${result.paginations.currentPage + 1}&order=${column}&orderCondition=${direction}`;
        let prevPage =
            result.paginations.currentPage == 1
                ? null
                : `${apiUrl}?dataPerPage=${dataPerPage}&page=${result.paginations.currentPage - 1
                }&order=${column}&orderCondition=${direction}`;
        params.limitQuery = result.paginations.query
        const listAlocaionts = await model.listAllocations(params)
        const data = {
            dataPerPage: result.paginations.dataPerPage,
            currentPage: result.paginations.currentPage,
            totalData: result.paginations.totalData,
            totalPage: result.paginations.totalPage,
            nextPage: nextPage,
            prevPage: prevPage,
            data: listAlocaionts
        }
        return responseHandle(req, res, "Success", "listAllocations", data, 200)
        }
        // result.paginations = paginations
        // let nextPage =
        //     result.paginations.currentPage == result.paginations.totalPage
        //         ? null
        //         : `${apiUrl}?dataPerPage=${dataPerPage}&page=${result.paginations.currentPage + 1}&order=${column}&orderCondition=${direction}`;
        // let prevPage =
        //     result.paginations.currentPage == 1
        //         ? null
        //         : `${apiUrl}?dataPerPage=${dataPerPage}&page=${result.paginations.currentPage - 1
        //         }&order=${column}&orderCondition=${direction}`;
        // params.limitQuery = result.paginations.query
        // const listAlocaionts = await model.listAllocations(params)
        // const data = {
        //     dataPerPage: result.paginations.dataPerPage,
        //     currentPage: result.paginations.currentPage,
        //     totalData: result.paginations.totalData,
        //     totalPage: result.paginations.totalPage,
        //     nextPage: nextPage,
        //     prevPage: prevPage,
        //     data: listAlocaionts
        // }
        // return responseHandle(req, res, "Success", "listAllocations", data, 200)
    } catch (err) {
        next(err)
    }
}

export const detaileAllocations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const regionId = validateRequestQuery(req.params.regionId, "num")
        const condition =
            validateRequestQuery(req.query.condition, "char").toUpperCase() == "DAILY"
                ? 1
                : validateRequestQuery(req.query.condition, "char").toUpperCase() == "WEEKLY"
                    ? 2
                    : validateRequestQuery(req.query.condition, "char").toUpperCase() == "MONTHLY"
                        ? 3
                        : 0;
        const parameter: any = req.query.parameter
        const year = validateRequestQuery(req.query.year, "num")
        const yearValidate = moment(year, "YYYY").isValid()
        const parameterEncode = Buffer.from(parameter, "base64").toString("ascii").replace(/[^0-9-]/g, "")

        if (condition == 0 || regionId == "" || parameterEncode == "" || !yearValidate) {
            return errorHandle(req, res, "Parametet not valid", "Detail allocations", {}, 400)
        } else {
            const data = await model.detaileAllocation(parameterEncode, regionId, condition, year)
            return responseHandle(req, res, "Success", "Detailr Allocation", data, 200)
        }
    } catch (err) {
        next(err)
    }
}

export const addNewAllocation = async (req: Request, res: Response, next:NextFunction) => {
    try {
        const dateTarget = validateRequestQuery(req.body.dateTarget, "any")
        const prizeId = validateRequestQuery(req.body.prizeId, "num")
        const quantity = validateRequestQuery(req.body.quantity, "num") == "" ? 0 : parseInt(validateRequestQuery(req.body.quantity, "num"))
        if (dateTarget == "" || prizeId == "" || quantity == 0) {
            return errorHandle(req, res, "Parameter not valid", "Add Allocation", {}, 400)
        } else {
            for(let i = 0; i < quantity; i++){
                await model.addNewAllocation(dateTarget, prizeId)
            }
            return responseHandle(req, res, "Success", "Add New Allocation", {}, 200)
        }
    } catch (error) {
        next(error)
    }
}

export const updateAllocation = async (req: Request, res: Response, next:NextFunction) => {
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

export const listMove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const date = validateRequestQuery(req.query.date, "any")
        const dateValidate = moment(date, "YYYY-MM-DD").format("YYYY-MM-DD").toUpperCase()
        // const regionId = validateRequestQuery(req.query.regionId, "num")
        const prizeId = validateRequestQuery(req.query.prizeId, "num")
        if (dateValidate == "INVALID DATE" && prizeId == "") {
            return responseHandle(req, res, "Parameter not valid", "List Move", {}, 400)
        } else {
            let data = {
                // region: [],
                prize: [],
                counts: 0
            }
            // if (dateValidate != "INVALID DATE") {
                const dateCompare = moment(dateValidate).isSameOrBefore()
                let dateValue = ""
                if (dateCompare) {
                    dateValue = `<='${dateValidate}'`
                } else {
                    dateValue = `='${dateValidate}'`
                }
                // const region: any = await model.regionByDate(dateValidate, 0)
                // data.region = region
                // if (regionId != "") {
                    // const prizeData: any = await model.prizeByDateRegion(dateValue)
                    // data.prize = prizeData
                    if (prizeId != "") {
                        const countData: any = await model.countAllocation(dateValue, prizeId)
                        data.counts = countData[0].counts
                    }
                // }
                return responseHandle(req, res, "Success get Data", "List Move", data, 200)
            // } else {
                // return responseHandle(req, res, "Parameter not valid", "List Move", {}, 500)
            }
        // }
    } catch (error) {
        next(error)
    }
}

export const importAllocations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filePath: any = req.file?.path
        const dataExccel: any = await loadExcel(filePath)
        responseHandle(req, res, "Data processed", "Import allocations", {}, 200)
        for (let index = 0; index < dataExccel.length; index++) {
            const region = dataExccel[index].region
            const date = dataExccel[index].date
            const prizeId = validateRequestQuery((dataExccel[index].prize_id), "num")
            const row = dataExccel[index].row
            if (prizeId != "") {
                for (let index = 0; index < row; index++) {
                    await model.insertAllocation(date, region, prizeId)
                }
            }
        }
    } catch (error) {
       next(error)
    }
}