import { NextFunction, Request, Response } from "express";
import * as model from "./model";
import { pagination, responseHandle, validateRequestQuery } from '../../../config/baseFunction';

export const listRegistration = async (req: Request, res: Response, next: NextFunction) => {
    let apiUrl = `/api/v1/registration`;
    let result: any = {};

    const dataPerPage: number =
        validateRequestQuery(req.query.row, "num") == 0
            ? 10
            : validateRequestQuery(req.query.row, "num");

    const subtract = validateRequestQuery(req.query.subtract, "num") == 1 ? 1 : 0
    const key: string = validateRequestQuery(req.query.key, "numCharSpace");
    const page: number = validateRequestQuery(req.query.page, "num");
    const media: string = validateRequestQuery(req.query.media, "num");
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
        subtract: subtract,
        media
    };

    try {
        let countConsumer: any = await model.countRegistration(params);
        result.countConsumer = countConsumer;

        let totalConsumer = result.countConsumer[0].counts;
        let paginations: any = await pagination(page, dataPerPage, totalConsumer);
        let nextPage =
            paginations.currentPage == paginations.totalPage
                ? null
                : `${apiUrl}?dataPerPage=${dataPerPage}&page=${paginations.currentPage + 1
                }&key=${key}&column=${column}&direction=${direction}`;
        let prevPage =
            paginations.currentPage == 1
                ? null
                : `${apiUrl}?dataPerPage=${dataPerPage}&page=${paginations.currentPage - 1
                }&key=${key}&column=${column}&direction=${direction}`;

        params.limitQuery = paginations.query

        let list_registration: any = await model.listRegistration(params);
        result.listConsumer = list_registration;
        const data = {
            dataPerPage: paginations.dataPerPage,
            currentPage: paginations.currentPage,
            totalData: paginations.totalData,
            totalPage: paginations.totalPage,
            nextPage: nextPage,
            prevPage: prevPage,
            data: list_registration,
        }
        return responseHandle(req, res, "Success to get data", "consumerData", data, 200)
    } catch (err) {
        next(err)
    }
};