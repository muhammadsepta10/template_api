import { NextFunction, Request, Response } from 'express';
import * as model from "./model";
import { loadExcel, pagination, validateRequestQuery, errorHandle, responseHandle } from '../../config/baseFunction';

export const listTransactions = async (req: Request, res: Response, next: NextFunction) => {
    let apiUrl: string = `/api/v1/transactions`;
    let result: any = {};
    const dataPerPage: number =
        validateRequestQuery(req.query.row, "numChar") == ""
            ? 10
            : validateRequestQuery(req.query.row, "num");
    const key: string = validateRequestQuery(req.query.key, "numCharSpace");
    const page: number = validateRequestQuery(req.query.page, "num");
    const column: string = validateRequestQuery(req.query.order, "any");
    const direction = validateRequestQuery(
        req.query.orderCondition,
        "char"
    ).toUpperCase();
    const status = validateRequestQuery(req.query.status, "num")
    const type = validateRequestQuery(req.query.type, "num")
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
            type: type,
        };

        let countWinner: any = await model.countTransactions(params);
        result.countWinner = countWinner;

        let totalWinner = countWinner[0].counts;
        let paginations: any = await pagination(page, dataPerPage, totalWinner);
        let nextPage =
            paginations.currentPage == paginations.totalPage
                ? null
                : `${apiUrl}?dataPerPage=${dataPerPage}&page=${paginations.currentPage + 1
                }&key=${key}&column=${column}&direction=${direction}&status=${status}&type=${type}`;
        let prevPage =
            paginations.currentPage == 1
                ? null
                : `${apiUrl}?dataPerPage=${dataPerPage}&page=${paginations.currentPage - 1
                }&key=${key}&column=${column}&direction=${direction}&status=${status}&type=${type}`;

        params.limitQuery = paginations.query
        let list_winner: any = await model.listTransactions(params);
        result.listWinner = list_winner;

        const data = {
            dataPerPage: paginations.dataPerPage,
            currentPage: paginations.currentPage,
            totalData: paginations.totalData,
            totalPage: paginations.totalPage,
            nextPage: nextPage,
            prevPage: prevPage,
            data: list_winner,
        }
        return responseHandle(req, res, "Success to get data", "listWinner", data, 200)
    } catch (err) {
        next(err)
    }
};

export const transactionByid = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let id: number = validateRequestQuery(req.params.id, "num");
        const userByid = await model.transactionByid(id)
        const list = await model.detailTransactionlog(id);
        const data = {
            userByid: userByid,
            list: list
        }
        return responseHandle(req, res, "Success", "transactionByid", data, 200)
    } catch (error) {
        next(error)
    }
}

export const updateTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const winnerId = validateRequestQuery(req.body.winnerId, "num")
        const accountNumber = validateRequestQuery(req.body.accountNumber, "numChar")
        if (winnerId == "" || accountNumber == "") {
            return errorHandle(req, res, "Parameter not valid", "Update Allocation", {}, 400)
        } else {
            await model.updateTransaction(winnerId, accountNumber)
            return responseHandle(req, res, "Success", "UpdateTransaction", {}, 200)
        }
    } catch (error) {
        next(error)
    }
}

export const importBulk = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.file) {
            const file = req.file.path
            const data: any = await loadExcel(file)
            res.send({ message: "Success", data: {} })
            for (let index = 0; index < data.length; index++) {
                const winnerId = validateRequestQuery(data[index].id, "num")
                const accountNumber = validateRequestQuery(data[index].account_number, "num")
                if (winnerId != "" && accountNumber != "") {
                    const existWinner: any = await model.checkExistwinner(winnerId)
                    if (existWinner.length >= 0) {
                        const params = {
                            accountNumber: accountNumber,
                            winnerId: winnerId
                        }
                        await model.importWinner(params).then((resp: any) => { }).catch((err: any) => {
                        })
                    }
                }
            }

        } else {
            return errorHandle(req, res, "File not valid", "importTransactionwinner", {}, 500)
        }
    } catch (error) {
        next(error)
    }
}

export const templateBulk = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const path = require('path');
        res.download(path.join(__dirname, '../../../template', 'bulk.xls'));
    } catch (error) {
        next(error)
    }
}