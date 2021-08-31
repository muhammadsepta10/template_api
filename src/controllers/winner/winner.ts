import { NextFunction, Request, Response } from 'express';
import * as model from "./model";
import { loadExcel, responseHandle, errorHandle } from '../../config/baseFunction';
import {
    pagination,
    validateRequestQuery
} from "../../config/baseFunction";
var filename = module.filename.split('/').slice(-1)[0];
import moment from 'moment'

export const listWinner = async (req: Request, res: Response, next: NextFunction) => {
    let apiUrl: string = `/api/v1/winner`;
    let result: any = {};
    const dataPerPage: number =
        validateRequestQuery(req.query.row, "numChar") == ""
            ? 10
            : validateRequestQuery(req.query.row, "num");
    const key: string = validateRequestQuery(req.query.key, "numCharSpace");
    const page: number = validateRequestQuery(req.query.page, "num");
    const column: string = validateRequestQuery(req.query.order, "any");
    const columnSearch: string = validateRequestQuery(req.query.columnSearch, "any");
    const direction = validateRequestQuery(
        req.query.orderCondition,
        "char"
    ).toUpperCase();
    const type = validateRequestQuery(req.query.type, "num")
    const status = validateRequestQuery(req.query.status, "num")
    const startDate = validateRequestQuery(req.query.startDate, "any")
    const endDate = validateRequestQuery(req.query.endDate, "any")
    const userId = res.locals.id.id
    try {
        let params = {
            startDate: startDate,
            endDate: endDate,
            key: key,
            column: column,
            columnSearch: columnSearch,
            direction: direction,
            limitQuery: "",
            type: type,
            status: status,
            userId
        };
        let countWinner: any = await model.countWinnerV2(params);
        result.countWinner = countWinner;

        let totalWinner = countWinner[0].counts;
        let paginations: any = await pagination(page, dataPerPage, totalWinner);
        let nextPage =
            paginations.currentPage == paginations.totalPage
                ? null
                : `${apiUrl}?dataPerPage=${dataPerPage}&page=${paginations.currentPage + 1
                }&key=${key}&column=${column}&columnSearch=${columnSearch}&direction=${direction}&type=${type}`;
        let prevPage =
            paginations.currentPage == 1
                ? null
                : `${apiUrl}?dataPerPage=${dataPerPage}&page=${paginations.currentPage - 1
                }&key=${key}&column=${column}&columnSearch=${columnSearch}&direction=${direction}&type=${type}`;

        params.limitQuery = paginations.query
        let list_winner: any = await model.listWinnerV2(params, "maxCountingTopup");
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

export const detailWinner = async (req: Request, res: Response, next: NextFunction) => {
    let id: number = validateRequestQuery(req.params.id, "num");
    try {
        let winner: any = await model.detailWinner(id);
        const transactions = await model.transactionByWiner(id);
        if (winner?.length > 0) {
            return responseHandle(req, res, "Success to get data", "detailEntries", { data: winner[0], transaction: transactions }, 200)
        } else {
            return errorHandle(req, res, "Data Not Found", "detailEntries", [], 400)
        }
    } catch (err) {
        next(err)
    }
};

export const listWinner2 = async (req: Request, res: Response, next: NextFunction) => {
    let apiUrl: string = `/api/v1/winner`;
    let result: any = {};
    const dataPerPage: number =
        validateRequestQuery(req.query.row, "numChar") == ""
            ? 10
            : validateRequestQuery(req.query.row, "num");
    const key: string = validateRequestQuery(req.query.key, "numCharSpace");
    const page: number = validateRequestQuery(req.query.page, "num");
    const column: string = validateRequestQuery(req.query.order, "any");
    const columnSearch: string = validateRequestQuery(req.query.columnSearch, "any");
    const direction = validateRequestQuery(
        req.query.orderCondition,
        "char"
    ).toUpperCase();
    const type = validateRequestQuery(req.query.type, "num")
    const status = validateRequestQuery(req.query.status, "num")
    const startDate = validateRequestQuery(req.query.startDate, "any")
    const endDate = validateRequestQuery(req.query.endDate, "any")
    const userId = res.locals.id.id
    try {
        let params = {
            startDate: startDate,
            endDate: endDate,
            key: key,
            column: column,
            columnSearch: columnSearch,
            direction: direction,
            limitQuery: "",
            type: type,
            status: status,
            userId
        };
        let countWinner: any = await model.countWinnerV3(params);
        result.countWinner = countWinner;

        let totalWinner = countWinner[0].counts;
        let paginations: any = await pagination(page, dataPerPage, totalWinner);
        let nextPage =
            paginations.currentPage == paginations.totalPage
                ? null
                : `${apiUrl}?dataPerPage=${dataPerPage}&page=${paginations.currentPage + 1
                }&key=${key}&column=${column}&columnSearch=${columnSearch}&direction=${direction}&type=${type}`;
        let prevPage =
            paginations.currentPage == 1
                ? null
                : `${apiUrl}?dataPerPage=${dataPerPage}&page=${paginations.currentPage - 1
                }&key=${key}&column=${column}&columnSearch=${columnSearch}&direction=${direction}&type=${type}`;

        params.limitQuery = paginations.query
        let list_winner: any = await model.listWinnerV3(params, "maxCountingTopup");
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

export const detailWinner2 = async (req: Request, res: Response, next: NextFunction) => {
    let id: number = validateRequestQuery(req.params.id, "num");
    try {
        let winner: any = await model.detailWinnerV2(id);
        const transactions = await model.transactionByWiner(id);
        if (winner?.length > 0) {
            return responseHandle(req, res, "Success to get data", "detailEntries", { data: winner[0], transaction: transactions }, 200)
        } else {
            return errorHandle(req, res, "Data Not Found", "detailEntries", [], 400)
        }
    } catch (err) {
        next(err)
    }
};


// export const updateWinner = async (req: Request, res: Response, next: NextFunction) => {
//     let status = req.body.status
//     let id: number = validateRequestQuery(req.body.id, "num");

//     let encodeStatus = Buffer.from(status, "base64").toString("ascii")

//     try {
//         let winner: any = await model.detailWinner(id);
//         if (winner?.length > 0) {
//             let editList: any = await model.approveWinner(id);
//             return responseHandle(req, res, "Update Success", "winner", [], 200)
//         } else {
//             return responseHandle(req, res, "Status is already exist", "winner", [], 400)
//         }
//     } catch (err) {
//         next(err)
//     }
// };

export const importWinner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.file) {
            const file = req.file.path
            const data: any = await loadExcel(file)
            res.send({ message: "Success", data: {} })
            for (let index = 0; index < data.length; index++) {
                const entriesId = validateRequestQuery(data[index].entries_id, "num")
                const prizeId = validateRequestQuery(data[index].prize_id, "num")
                const periodeId = validateRequestQuery(data[index].periode_id, "num")
                const accountNumber = validateRequestQuery(data[index].account_number, "num")
                const status = data[index].status == 0 ? 0 : validateRequestQuery(data[index].status, "num")
                if (entriesId != "" && prizeId != "" && periodeId != "" && accountNumber != "") {
                    const existPrize: any = await model.checkExistPrize(prizeId)
                    const existEntries: any = await model.checkEntries(entriesId)
                    if (existPrize.length >= 0 && (existEntries.length == 1 && existEntries[0].id == null)) {
                        const params = {
                            entriesId: entriesId,
                            prizeId: prizeId,
                            periodeId: periodeId,
                            accountNumber: accountNumber,
                            status: status
                        }
                        await model.importWinner(params).then((resp: any) => { }).catch((err: any) => {
                        })
                    }
                }
            }

        } else {
            return errorHandle(req, res, "File not valid", "importWinner", {}, 500)
        }
    } catch (error) {
        next(error)
    }
}

export const templateImportWinner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const path = require('path');
        res.download(path.join(__dirname, '../../../template', 'winner.xls'));
    } catch (error) {
        next(error)
    }
}

export const submitDataWinner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const entriesId = validateRequestQuery(req.body.entriesId, "num") == "" ? 0 : validateRequestQuery(req.body.entriesId, "num")
        const purchaseDate = moment(req.body.purchaseDate).format("YYYY-MM-DD")
        const product = req.body.variants
        const isValid = validateRequestQuery(req.body.isValid, "num") == "" ? "0" : validateRequestQuery(req.body.isValid, "num")
        if (purchaseDate.toUpperCase() == "INVALID DATE" || isValid === "" || Array.isArray(product) == false || entriesId == "") {
            return responseHandle(req, res, "Parameter Not Valid", filename, {}, 400)
        } else {
            let checkSaved: any = await model.areYouThere(entriesId)
            if (checkSaved[0].counts > 0) {
                await model.deleteSaved(entriesId)
            }
            for (let i = 0; i < product.length; i++) {
                const quantity = validateRequestQuery(product[i].quantity, "num") == "" ? 0 : parseInt(validateRequestQuery(product[i].quantity, "num")),
                    variantId = validateRequestQuery(product[i].variantId, "num") == "" ? 0 : parseInt(validateRequestQuery(product[i].variantId, "num")),
                    totalAmount = validateRequestQuery(product[i].totalPrice, "num") == "" ? 0 : parseInt(validateRequestQuery(product[i].totalPrice, "num"))

                let paramIns = {
                    entriesId: entriesId,
                    variantId: variantId,
                    quantity: quantity,
                    totalAmount: totalAmount
                }
                await model.submitWinnerVariant(paramIns)
            }
            let params = {
                id: entriesId,
                purchaseDate: purchaseDate,
                isValid: isValid
            }
            await model.submitStatusWinner(params)
            return responseHandle(req, res, "Success", filename, {}, 200)
        }
    } catch (error) {
        next(error)
    }
}

export const unprocessedWinner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const entriesId = validateRequestQuery(req.params.id, "num") == "" ? 0 : validateRequestQuery(req.params.id, "num")
        if (entriesId == "") {
            return responseHandle(req, res, "Parameter Not Valid", filename, {}, 400)
        } else {
            await model.unprocessedWinner(entriesId)
            return responseHandle(req, res, "Success", filename, {}, 200)
        }
    } catch (error) {
        next(error)
    }
}

export const approveWinner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const entriesId = validateRequestQuery(req.params.id, "num") == "" ? 0 : validateRequestQuery(req.params.id, "num")
        if (entriesId == "") {
            return responseHandle(req, res, "Parameter Not Valid", filename, {}, 400)
        } else {
            await model.approveWinner(entriesId)
            return responseHandle(req, res, "Success", filename, {}, 200)
        }
    } catch (error) {
        next(error)
    }
}

export const unverifyWinner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const entriesId = validateRequestQuery(req.params.id, "num") == "" ? 0 : validateRequestQuery(req.params.id, "num")
        if (entriesId == "") {
            return responseHandle(req, res, "Parameter Not Valid", filename, {}, 400)
        } else {
            await model.unverifyWinner(entriesId)
            await model.unverifyWinnerAllocation(entriesId)
            return responseHandle(req, res, "Success", filename, {}, 200)
        }
    } catch (error) {
        next(error)
    }
}

export const updateAccountNumber = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = validateRequestQuery(req.params.id, "num")
        const hp = validateRequestQuery(req.body.hp, "num")
        if (id == "" || hp == "") {
            return res.status(400).send({ message: "Parameter not valid", data: {} })
        } else {
            const update = await model.editAcountNumber(id, hp)
            if (update.affectedRows < 1) {
                return res.status(400).send({ message: "Parameter not valid", data: {} })
            } else {
                return res.send({ message: "Success", data: {} })
            }
        }
    } catch (error) {
        next(error)
    }
}

export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = validateRequestQuery(req.params.id, "num")
        const status = validateRequestQuery(req.body.status, "num") == "" ? 0 : validateRequestQuery(req.body.status, "num")
        const reason = validateRequestQuery(req.body.reason, "char")

        if (id == "") {
            return res.status(400).send({ message: "Paramasdasdeter not valid", data: {} })
        } else {
            const update = await model.updateStatusWinner(id, status, reason)
            if (update.affectedRows < 1) {
                return res.status(400).send({ message: "Parameter not valid", data: {} })
            } else {
                return res.send({ message: "Success", data: {} })
            }
        }
    } catch (error) {
        next(error)
    }
}