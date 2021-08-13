import { NextFunction, Request, Response } from "express";
import * as model from "./model";
import { errorHandle, pagination, responseHandle, validateRequestQuery } from '../../config/baseFunction';
let bcrypt = require("bcryptjs");
let salt = bcrypt.genSaltSync(10);

export const blackList = async (req: Request, res: Response, next: NextFunction) => {
    let apiUrl: string = `/api/v1/blacklist`;
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

        const userList = await model.userList(params, domainUrl)
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

export const blacklistByid = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let id: number = validateRequestQuery(req.params.id, "num");
        const blByid = await model.listByid(id)
        return responseHandle(req, res, "blacklist", "listByid", blByid, 200)
    } catch (error) {
        next(error)
    }
}

export const insertBlacklist = async (req: Request, res: Response, next: NextFunction) => {
    let name = validateRequestQuery(req.body.name, "charSpace");
    let sender = validateRequestQuery(req.body.sender, "num");
    let id_number = validateRequestQuery(req.body.idNumber, "num");

    try {
        let response: any = await model.searchList(sender, 0, "insert");
        if (name == "emptystring" || sender == "emptynumber") {
            errorHandle(req, res, "name, sender target kosong", "users", response, 500)
        }
        if (response?.length < 1) {
            let insertList: any = await model.insertList(
                name,
                sender,
                id_number
            );
            if (insertList.insertId != 0) {
                // berhasil
                responseHandle(req, res, "Insert Data Success", "blacklist", [], 200)
            } else {
                // gagal
                responseHandle(req, res, "Failed Insert Data", "blacklist", [], 400)
            }
        } else {
            responseHandle(req, res, "Sender already used", "blacklist", [], 400)
        }
    } catch (err) {
        next(err)
    }
}

export const editBlacklist = async (req: Request, res: Response, next: NextFunction) => {
    let name = validateRequestQuery(req.body.name, "charSpace");
    let sender = validateRequestQuery(req.body.sender, "num");
    let id_number = validateRequestQuery(req.body.idNumber, "num");
    let id = validateRequestQuery(req.body.id, "num");

    try {
        let searchList: any = await model.searchList(sender, id, "edit");
        if (name == "emptystring" || sender == "emptynumber" || id == "emptynumber") {
            return responseHandle(req, res, "Parameter Not Found", "blacklist", [], 500)
        }
        if (searchList?.length > 0) {
            let editList: any = await model.editList(
                name,
                sender,
                id_number,
                id
            );
            return responseHandle(req, res, "Update Success", "blacklist", [], 200)
        } else {
            return responseHandle(req, res, "Sender is already exist", "blacklist", [], 400)
        }
    } catch (err) {
        next(err)
    }
}

export const deleteList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let id = validateRequestQuery(req.params.id, "num");
        const dataToken = res.locals.id
        const userId = dataToken.id
        await model.updateUserId(id, userId)
        let response: any = await model.deleteList(id);
        if (response) {
            responseHandle(req, res, "Update Success", "Delete", response, 200)
        }
    } catch (err) {
        next(err)
    }
}