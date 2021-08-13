import { NextFunction, Request, Response } from "express";
import * as model from "./model";
import { errorHandle, pagination, responseHandle, validateRequestQuery } from '../../config/baseFunction';
let bcrypt = require("bcryptjs");
let salt = bcrypt.genSaltSync(10);

export const listReplies = async (req: Request, res: Response, next: NextFunction) => {
    let apiUrl: string = `/api/v1/replies`;
    // const domainUrl = req.protocol + '://' + req.headers.host + "/"
    let result: any = {};

    const dataPerPage: number =
        validateRequestQuery(req.query.row, "num") == 0
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

    let params = {
        key: key,
        column: column,
        direction: direction,
        limitQuery: "",
        media: media
    };
    try {
        let countList: any = await model.countList(params);
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

        const userList = await model.listReplies(params)
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

export const repliesByid = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let id: number = validateRequestQuery(req.params.id, "num");
        const blByid = await model.listByid(id)
        return responseHandle(req, res, "reply", "listByid", blByid, 200)
    } catch (error) {
        next(error)
    }
}

export const insertReply = async (req: Request, res: Response, next: NextFunction) => {
    let name = req.body.name
    let reply = req.body.reply

    let encodeName = Buffer.from(name, "base64").toString("ascii")
    let encodeReply = Buffer.from(reply, "base64").toString("ascii")

    try {
        let response: any = await model.searchReply(reply, 0, "insert");
        if (name == "emptystring" || reply == "emptystring") {
            errorHandle(req, res, "name, reply kosong", "users", response, 500)
        }
        if (response?.length < 1) {
            let insertReply: any = await model.insertReply(
                encodeName,
                encodeReply
            );
            if (insertReply.insertId != 0) {
                // berhasil
                responseHandle(req, res, "Insert Data Success", "reply", [], 200)
            } else {
                // gagal
                responseHandle(req, res, "Failed to insert data", "reply", [], 400)
            }
        } else {
            responseHandle(req, res, "Name already used", "reply", [], 400)
        }
    } catch (err) {
        next(err)
    }
}

export const editReply = async (req: Request, res: Response, next: NextFunction) => {
    let name = req.body.name
    let reply = req.body.reply
    let id: number = validateRequestQuery(req.body.id, "num");

    let encodeName = Buffer.from(name, "base64").toString("ascii")
    let encodeReply = Buffer.from(reply, "base64").toString("ascii")

    try {
        let searchReply: any = await model.searchReply(reply, id, "edit");
        if (name == "emptystring" || reply == "emptystring" || id == null) {
            return responseHandle(req, res, "Parameter Not Found", "reply", [], 500)
        }
        if (searchReply?.length > 0) {
            let editList: any = await model.editReply(
                encodeName,
                encodeReply,
                id
            );
            return responseHandle(req, res, "Update Success", "reply", [], 200)
        } else {
            return responseHandle(req, res, "Name is already exist", "reply", [], 400)
        }
    } catch (err) {
        next(err)
    }
}

export const deleteReply = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let id = req.params.id;
        let response: any = await model.deleteReply(id);
        if (response) {
            responseHandle(req, res, "Delete Success", "Delete", response, 200)
        }
    } catch (err) {
        next(err)
    }
}