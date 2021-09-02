import { NextFunction, Request, Response } from "express";
import * as model from "./model";
import { errorHandle, pagination, responseHandle, validateRequestQuery } from '../../config/baseFunction';
let bcrypt = require("bcryptjs");
let salt = bcrypt.genSaltSync(10);

export const userList = async (req: Request, res: Response, next: NextFunction) => {
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
        let countUsers: any = await model.countUsers();
        result.countUsers = countUsers.data;

        let totalUsers = countUsers[0].counts;
        let paginations: any = await pagination(page, dataPerPage, totalUsers);
        let nextPage =
            paginations.currentPage == paginations.totalPage
                ? null
                : `?dataPerPage=${dataPerPage}&page=${paginations.currentPage + 1
                }&key=${key}&order=${column}&orderCondition=${direction}`;
        let prevPage =
            paginations.currentPage == 1
                ? null
                : `?dataPerPage=${dataPerPage}&page=${paginations.currentPage - 1
                }&key=${key}&order=${column}&orderCondition=${direction}`;
        params.limitQuery = paginations.query

        const userList = await model.userList(params, domainUrl)
        result.listUsers = userList.data;

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

export const userByid = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let id: number = validateRequestQuery(req.params.id, "num");
        const userByid = await model.userByid(id)
        return responseHandle(req, res, "users", "userByid", userByid, 200)
    } catch (error) {
        next(error)
    }
}

export const listLevel = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const listLevel = await model.listLevel()
        return responseHandle(req, res, "listLevel", "users", listLevel, 200)
    } catch (error) {
        next(error)
    }
}

export const insertUser = async (req: Request, res: Response, next: NextFunction) => {
    let username = validateRequestQuery(req.body.username, "charSpace");
    let level_code = validateRequestQuery(req.body.level, "num");
    let password = req.body.password;
    let fullname = validateRequestQuery(req.body.fullname, "char");

    let verifyPassword = bcrypt.hashSync(password, salt);

    try {
        let response: any = await model.searchUser(username, 0, "insert");
        if (username == "" || fullname == "" || level_code == "" || password == "") {
            errorHandle(req, res, "username, password, level user kosong", "users", response, 500)
        }
        if (response?.length < 1) {
            let insertUser: any = await model.insertUser(
                username,
                verifyPassword,
                fullname,
                level_code
            );
            if (insertUser.insertId != 0) {
                // berhasil
                responseHandle(req, res, "insert data success", "users", [], 200)
            } else {
                // gagal
                responseHandle(req, res, "Gagal regis", "users", [], 400)
            }
        } else {
            responseHandle(req, res, "Username already used", "users", [], 400)
        }
    } catch (err) {
        next(err)
    }
}

export const editUser = async (req: Request, res: Response, next: NextFunction) => {
    let username = validateRequestQuery(req.body.username, "charSpace");
    let level_code = validateRequestQuery(req.body.level, "num");
    let password = req.body.password;
    let fullname = validateRequestQuery(req.body.fullname, "char");
    let id = validateRequestQuery(req.body.id, "num");

    let verifyPassword = bcrypt.hashSync(password, salt);
    try {
        let searchUser: any = await model.searchUser(username, id, "edit");
        if (username == "" || fullname == "" || level_code == "" || id == "" || password == "") {
            return responseHandle(req, res, "Parameter Not Found", "users", [], 500)
        }
        if (searchUser?.length > 0) {
            let editUser: any = await model.editUser(
                username,
                verifyPassword,
                fullname,
                level_code,
                id
            );
            return responseHandle(req, res, "Update Success", "users", [], 200)
        } else {
            return responseHandle(req, res, "Username is already exist", "users", [], 400)
        }
    } catch (err) {
        next(err)
    }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let id = req.params.id;
        let response: any = await model.deleteUser(id);
        if (response) {
            responseHandle(req, res, "Update Success", "Delete", response, 200)
        }
    } catch (err) {
       next(err)
    }
}

export const insertLevel = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const role = validateRequestQuery(req.body.role, "num"),
            codeName = validateRequestQuery(req.body.codeName, "char"),
            name = validateRequestQuery(req.body.name, "charSpace"),
            sort = validateRequestQuery(req.body.sort, "num")
        if (role == "" || codeName == "" || name == "") {
            return errorHandle(req, res, "Parameter not valid", "insert level", {}, 400)
        } else {
            await model.insertLevel(role, name, codeName, sort)
            return responseHandle(req, res, "Success insesrt level", "insert level", {}, 200)
        }
    } catch (error) {
        next(error)
    }
}