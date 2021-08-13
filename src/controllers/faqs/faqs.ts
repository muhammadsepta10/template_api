import { NextFunction, Request, Response } from "express";
import * as model from "./model";
import { errorHandle, pagination, responseHandle, validateRequestQuery } from '../../config/baseFunction';

export const listFaqs = async (req: Request, res: Response, next: NextFunction) => {
    let apiUrl: string = `/api/v1/Faqs`;
    const domainUrl = req.protocol + '://' + req.headers.host + "/"
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

    let params = {
        key: key,
        column: column,
        direction: direction,
        limitQuery: "",
    };
    try {
        let countList: any = await model.countList();
        result.countList = countList.data;

        let totalList = countList[0].counts;
        let paginations: any = await pagination(page, dataPerPage, totalList);
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

        const userList = await model.listFaqs(params, domainUrl)
        result.listList = userList.data;

        const data = {
            dataPerPage: paginations.dataPerPage,
            currentPage: paginations.currentPage,
            totalData: paginations.totalData,
            totalPage: paginations.totalPage,
            nextPage: nextPage,
            prevPage: prevPage,
            data: userList,
        }

        return responseHandle(req, res, "success", "userList", data, 200)
    } catch (error) {
        next(error)
    }
}

export const FaqsByid = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let id: number = validateRequestQuery(req.params.id, "num");
        const blByid = await model.listByid(id)
        return responseHandle(req, res, "faqs", "listByid", blByid, 200)
    } catch (error) {
        next(error)
    }
}

export const insertFaq = async (req: Request, res: Response, next: NextFunction) => {
    let question = validateRequestQuery(req.body.question, "any");
    let answer = validateRequestQuery(req.body.answer, "any");
    let order = validateRequestQuery(req.body.order, "num");

    try {
        if (question == "emptystring" || answer == "emptystring" || order == "") {
            return errorHandle(req, res, "question, answer, order kosong", "faqs", [], 500)
        }
        await model.insertFaqs(question, answer, order);
        // berhasil
        return responseHandle(req, res, "Insert Data Success", "faqs", [], 200)
    } catch (err) {
        next(err)
    }
}

export const editFaq = async (req: Request, res: Response, next: NextFunction) => {
    let question = validateRequestQuery(req.body.question, "any");
    let answer = validateRequestQuery(req.body.answer, "any");
    let order = validateRequestQuery(req.body.order, "num");
    let id: number = validateRequestQuery(req.body.id, "num");
    try {
        if (question == "emptystring" || answer == "emptystring" || order == "") {
            return errorHandle(req, res, "question, answer, order, id kosong", "faqs", [], 500)
        }
        let editList: any = await model.editFaqs(question, answer, order, id);
        return responseHandle(req, res, "Update Success", "faqs", [], 200)
    } catch (err) {
        next(err)
    }
}

export const deleteFaqs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let id = req.params.id;
        let response: any = await model.deleteFaqs(id);
        if (response) {
            responseHandle(req, res, "Delete Success", "Delete", response, 200)
        }
    } catch (err) {
        next(err)
    }
}