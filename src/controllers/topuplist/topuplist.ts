import { NextFunction, Request, Response, response } from 'express';
import * as model from "./model";
import { pagination, validateRequestQuery, errorHandle, responseHandle } from '../../config/baseFunction';
var filename = module.filename.split('/').slice(-1)[0];

export const listTopup = async (req: Request, res: Response, next: NextFunction) => {
    let apiUrl: string = `/api/v1/dashboard/summary/topup/detail`;
    let result: any = {};
    const dataPerPage: number =
        validateRequestQuery(req.query.row, "num") == 0
            ? 10
            : validateRequestQuery(req.query.row, "num");

    const key: string = validateRequestQuery(req.query.key, "numCharSpace");
    const page: number = validateRequestQuery(req.query.page, "num");
    const column: string = validateRequestQuery(req.query.order, "any");
    const direction = validateRequestQuery(
        req.query.orderCondition,
        "char"
    ).toUpperCase();
    const startDate: any = validateRequestQuery(req.query.startDate, "any");
    const endDate: any = validateRequestQuery(req.query.endDate, "any");
    let params = {
        startDate: startDate,
        endDate: endDate,
        key: key,
        column: column,
        direction: direction,
        limitQuery: "",
    };

    try {
        let countTopup: any = await model.countTopup(params);
        result.countTopup = countTopup.data;
        let totalTopup = countTopup.length;
        let paginations: any = await pagination(page, dataPerPage, totalTopup);
        let nextPage =
            paginations.currentPage == paginations.totalPage
                ? null
                : `${apiUrl}?dataPerPage=${dataPerPage}&page=${paginations.currentPage + 1
                }&key=${key}&order=${column}&orderCondition=${direction}`;
        let prevPage =
            paginations.currentPage == 1
                ? null
                : `${apiUrl}?dataPerPage=${dataPerPage}&page=${paginations.currentPage - 1
                }&key=${key}&order=${column}&orderCondition=${direction}`;
        params.limitQuery = paginations.query

        let list_topup: any = await model.listTopup(params);
        result.listTopup = list_topup.data;

        const data = {
            dataPerPage: paginations.dataPerPage,
            currentPage: paginations.currentPage,
            totalData: paginations.totalData,
            totalPage: paginations.totalPage,
            nextPage: nextPage,
            prevPage: prevPage,
            data: list_topup,
        }
        return responseHandle(req, res, "Success to get data", "topup", data, 200)
    } catch (err) {
        next(err)
    }
};

// export const detailTopup = async (req: Request, res: Response, next: NextFunction) => {
//     let id: number = validateRequestQuery(req.params.id, "num");

//     try {
//         let response: any = await model.detailTopup(id);

//         if (response?.length > 0) {
//             return responseHandle(req, res, "Success to get data", "detailEntries", response[0], 200)
//         } else {
//             return errorHandle(req, res, "Data Not Found", "detailEntries", [], 400)
//         }
//     } catch (err) {
//         next(err)
//     }
// };

export const detailTopupV2 = async (req: Request, res: Response, next: NextFunction) => {
    let apiUrl: string = `/api/v1/dashboard/summary/topup/detail/:id`;
    let result: any = {};
    let id: any = validateRequestQuery(req.params.id, "any")
    let prizeType: number = validateRequestQuery(req.query.type, "num")
    const dataPerPage: number =
        validateRequestQuery(req.query.row, "num") == 0
            ? 10
            : validateRequestQuery(req.query.row, "num");
    const page: number = validateRequestQuery(req.query.page, "num");
    const column: string = validateRequestQuery(req.query.order, "any");
    const direction = validateRequestQuery(
        req.query.orderCondition,
        "char"
    ).toUpperCase();
    let params = {
        accountNumber: id,
        prizeType: prizeType,
        column: column,
        direction: direction,
        limitQuery: "",
    };

    try {
        let countTopup: any = await model.countDetailTopup(params);
        result.countTopup = countTopup.data;

        let totalTopup = countTopup[0].counts;
        let paginations: any = await pagination(page, dataPerPage, totalTopup);
        let nextPage =
            paginations.currentPage == paginations.totalPage
                ? null
                : `${apiUrl}?dataPerPage=${dataPerPage}&page=${paginations.currentPage + 1
                }&order=${column}&orderCondition=${direction}`;
        let prevPage =
            paginations.currentPage == 1
                ? null
                : `${apiUrl}?dataPerPage=${dataPerPage}&page=${paginations.currentPage - 1
                }&order=${column}&orderCondition=${direction}`;
        params.limitQuery = paginations.query

        let list_topup: any = await model.detailTopup(params);
        result.listTopup = list_topup.data;

        const data = {
            dataPerPage: paginations.dataPerPage,
            currentPage: paginations.currentPage,
            totalData: paginations.totalData,
            totalPage: paginations.totalPage,
            nextPage: nextPage,
            prevPage: prevPage,
            data: list_topup,
        }
        return responseHandle(req, res, "Success to get data", "topup", data, 200)
    } catch (err) {
        next(err)
    }
};