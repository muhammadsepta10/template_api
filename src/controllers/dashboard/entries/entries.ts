import { NextFunction, Request, Response, response } from 'express';
import * as model from "./model";
import { pagination, validateRequestQuery, errorHandle, responseHandle } from '../../../config/baseFunction';
var filename = module.filename.split('/').slice(-1)[0];

export const listEntries = async (req: Request, res: Response, next: NextFunction) => {
    let apiUrl: string = `/api/v1/dashboard/entries`;
    let result: any = {};
    const subtract = validateRequestQuery(req.query.subtract, "num") == 1 ? 1 : 0

    const dataPerPage: number =
        validateRequestQuery(req.query.row, "num") == 0
            ? 10
            : validateRequestQuery(req.query.row, "num");

    const key: string = validateRequestQuery(req.query.key, "numCharSpace");
    const page: number = validateRequestQuery(req.query.page, "num");
    const columnSearch: string = validateRequestQuery(req.query.columnSearch, "any");
    const column: string = validateRequestQuery(req.query.order, "any");
    const direction = validateRequestQuery(
        req.query.orderCondition,
        "char"
    ).toUpperCase();
    const startDate: any = validateRequestQuery(req.query.startDate, "any");
    const endDate: any = validateRequestQuery(req.query.endDate, "any");
    const isValid: any = req.query.isValid == "0" ? "0" : validateRequestQuery(req.query.isValid, "num")
    const isReplied: any = req.query.isReplied == "0" ? "0" : validateRequestQuery(req.query.isReplied, "num")
    const media: any = validateRequestQuery(req.query.media, "num");
    let params = {
        startDate: startDate,
        endDate: endDate,
        key: key,
        column: column,
        columnSearch: columnSearch,
        direction: direction,
        limitQuery: "",
        isValid: isValid,
        media: media,
        isReplied: isReplied,
        subtract: subtract
    };

    try {
        let countEntries: any = await model.countEntries(params);
        result.countEntries = countEntries.data;

        let totalEntries = countEntries[0].counts;
        let paginations: any = await pagination(page, dataPerPage, totalEntries);
        let nextPage =
            paginations.currentPage == paginations.totalPage
                ? null
                : `${apiUrl}?dataPerPage=${dataPerPage}&page=${paginations.currentPage + 1
                }&key=${key}&isValid=${isValid}&isReplied=${isReplied}&columnSearch=${columnSearch}&order=${column}&orderCondition=${direction}`;
        let prevPage =
            paginations.currentPage == 1
                ? null
                : `${apiUrl}?dataPerPage=${dataPerPage}&page=${paginations.currentPage - 1
                }&key=${key}&isValid=${isValid}&isReplied=${isReplied}&columnSearch=${columnSearch}&order=${column}&orderCondition=${direction}`;
        params.limitQuery = paginations.query

        let list_entries: any = await model.listEntries(params);
        result.listEntries = list_entries.data;

        const data = {
            dataPerPage: paginations.dataPerPage,
            currentPage: paginations.currentPage,
            totalData: paginations.totalData,
            totalPage: paginations.totalPage,
            nextPage: nextPage,
            prevPage: prevPage,
            data: list_entries,
        }
        return responseHandle(req, res, "Success to get data", "entries", data, 200)
    } catch (err) {
        next(err)
    }
};

export const detailEntries = async (req: Request, res: Response, next: NextFunction) => {
    let id: number = validateRequestQuery(req.params.id, "num");

    try {
        let response: any = await model.detailEntries(id);

        if (response?.length > 0) {
            return responseHandle(req, res, "Success to get data", "detailEntries", response[0], 200)
        } else {
            return errorHandle(req, res, "Data Not Found", "detailEntries", [], 400)
        }
    } catch (err) {
        next(err)
    }
};

export const deleteEntries = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataToken = res.locals.id
      const userId = dataToken.id
      const id = validateRequestQuery(req.params.id, "num")
      if (id == "") {
        return errorHandle(req, res, "Parameter not valid", "deleteEntries", "", 400)
      } else {
        let resp: any = await model.deleteEntries(id, userId)
        return responseHandle(req, res, "Success delete", "deleteEntries", resp, 200)
      }
    } catch (error) {
      next(error)
  
    }
}