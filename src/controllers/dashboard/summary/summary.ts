import { NextFunction, Request, Response } from "express";
import * as model from "./model";
import { validateRequestQuery, query, errorHandle, responseHandle } from '../../../config/baseFunction';
import { type } from 'os';
import moment from "moment";
import { totalEntries } from './model';
var filename = module.filename.split('/').slice(-1)[0];

export const entriesSummary = async (req: Request, res: Response, next: NextFunction) => {
    const subtract = validateRequestQuery(req.query.subtract, "num") == 1 ? 1 : 0
    const type =
        validateRequestQuery(req.query.type, "char").toUpperCase() == "CHART"
            ? 1
            : validateRequestQuery(req.query.type, "char").toUpperCase() == "DATA"
                ? 2
                : validateRequestQuery(req.query.type, "char").toUpperCase() == "ALL"
                    ? 3
                    : 0;
    const startDate: any = validateRequestQuery(req.query.startDate, "any");
    const endDate: any = validateRequestQuery(req.query.endDate, "any");
    const condition =
        validateRequestQuery(req.query.condition, "char").toUpperCase() == "DAILY"
            ? 1
            : validateRequestQuery(req.query.condition, "char").toUpperCase() == "WEEKLY"
                ? 2
                : validateRequestQuery(req.query.condition, "char").toUpperCase() == "MONTHLY"
                    ? 3
                    : validateRequestQuery(req.query.condition, "char").toUpperCase() == "HOURLY"
                        ? 4
                        : 0;
    const media = validateRequestQuery(req.query.media, "num")
    try {
        let params = {
            condition: condition,
            type: type,
            subtract: subtract,
            startDate: startDate,
            endDate: endDate,
            media
        };
        if (
            condition == 0 ||
            type == 0
        ) {
            responseHandle(req, res, "Wrong parameter", "statusSummary", [], 400)
        } else {
            const countEntries: any = await model.countEntries(params);
            let getTotalEntries: any = await model.totalEntries(subtract, media)
            const totalEntries: number = validateRequestQuery(getTotalEntries[0].counts, "num") == "" ? 0 : parseInt(validateRequestQuery(getTotalEntries[0].counts, "num"))
            const totalValid: number = validateRequestQuery(getTotalEntries[0].totalValid, "num") == "" ? 0 : parseInt(validateRequestQuery(getTotalEntries[0].totalValid, "num"))
            const totalInvalid: number = validateRequestQuery(getTotalEntries[0].totalInvalid, "num") == "" ? 0 : parseInt(validateRequestQuery(getTotalEntries[0].totalInvalid, "num"))
            let response: any = await model.entriesSummary(params);
            let seriesWa1 = [];
            let seriesWa2 = [];
            let seriesWa3 = [];
            let seriesMicrosite = [];
            let categories = [];
            let total = {
                totalValid: validateRequestQuery(countEntries[0].totalValid, "num") == "" ? 0 : parseInt(validateRequestQuery(countEntries[0].totalValid, "num")),
                totalInvalid: validateRequestQuery(countEntries[0].totalInvalid, "num") == "" ? 0 : parseInt(validateRequestQuery(countEntries[0].totalInvalid, "num")),
                totalValidWa1: validateRequestQuery(countEntries[0].totalValidWa1, "num") == "" ? 0 : parseInt(validateRequestQuery(countEntries[0].totalValidWa1, "num")),
                totalInvalidWa1: validateRequestQuery(countEntries[0].totalInvalidWa1, "num") == "" ? 0 : parseInt(validateRequestQuery(countEntries[0].totalInvalidWa1, "num")),
                totalValidWa2: validateRequestQuery(countEntries[0].totalValidWa2, "num") == "" ? 0 : parseInt(validateRequestQuery(countEntries[0].totalValidWa2, "num")),
                totalInvalidWa2: validateRequestQuery(countEntries[0].totalInvalidWa2, "num") == "" ? 0 : parseInt(validateRequestQuery(countEntries[0].totalInvalidWa2, "num")),
                totalValidWa3: validateRequestQuery(countEntries[0].totalValidWa3, "num") == "" ? 0 : parseInt(validateRequestQuery(countEntries[0].totalValidWa3, "num")),
                totalInvalidWa3: validateRequestQuery(countEntries[0].totalInvalidWa3, "num") == "" ? 0 : parseInt(validateRequestQuery(countEntries[0].totalInvalidWa3, "num")),
                totalValidMicrosite: validateRequestQuery(countEntries[0].totalValidMicrosite, "num") == "" ? 0 : parseInt(validateRequestQuery(countEntries[0].totalValidMicrosite, "num")),
                totalInvalidMicrosite: validateRequestQuery(countEntries[0].totalInvalidMicrosite, "num") == "" ? 0 : parseInt(validateRequestQuery(countEntries[0].totalInvalidMicrosite, "num")),
                totalAll: validateRequestQuery(countEntries[0].counts, "num") == "" ? 0 : parseInt(validateRequestQuery(countEntries[0].counts, "num"))
            }
            if (condition == 4) {
                categories.push("00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23")
                let data = []
                for (let index = 0; index < categories.length; index++) {
                    const categorie = categories[index]
                    const dateIndexOf = response.findIndex((x: any) => x.DATE == categorie)
                    if (dateIndexOf < 0) {
                        seriesWa1.push(0)
                        seriesWa2.push(0)
                        seriesWa3.push(0)
                        seriesMicrosite.push(0)
                        data.push({
                            DATE: categorie,
                            valid: 0,
                            invalid: 0,
                            validWa1: 0,
                            invalidWa1: 0,
                            validWa2: 0,
                            invalidWa2: 0,
                            validWa3: 0,
                            invalidWa3: 0,
                            validMicrosite: 0,
                            invalidMicrosite: 0,
                            allWa1: 0,
                            allWa2: 0,
                            allWa3: 0,
                            allMicrosite: 0,
                            all: 0
                        })
                    } else {
                        seriesWa1.push(response[dateIndexOf].allWa1)
                        seriesWa2.push(response[dateIndexOf].allWa2)
                        seriesWa3.push(response[dateIndexOf].allWa3)
                        seriesMicrosite.push(response[dateIndexOf].allMicrosite)
                        data.push(response[dateIndexOf])
                    }
                }
                response = data
            } else {
                for (let index = 0; index < response.length; index++) {
                    seriesWa1.push(response[index].allWa1);
                    seriesWa2.push(response[index].allWa2);
                    seriesWa3.push(response[index].allWa3);
                    seriesMicrosite.push(response[index].allMicrosite);
                    categories.push(response[index].DATE);
                }
            }
            if (type == 1) {
                //chart only
                return responseHandle(req, res, "Success", filename, {
                    totalEntries: totalEntries,
                    totalValid: totalValid,
                    totalInvalid: totalInvalid,
                    total: total,
                    seriesWa1: seriesWa1,
                    seriesWa2: seriesWa2,
                    seriesWa3: seriesWa3,
                    seriesMicrosite: seriesMicrosite,
                    categories: categories,
                }, 200)
            } else if (type == 2) {
                // data only
                return responseHandle(req, res, "Success", filename, response, 200)
            } else if (type == 3) {
                //chart & data
                return responseHandle(req, res, "Success", filename, {
                    data: response,
                    totalEntries: totalEntries,
                    totalValid: totalValid,
                    totalInvalid: totalInvalid,
                    total: total,
                    seriesWa1: seriesWa1,
                    seriesWa2: seriesWa2,
                    seriesWa3: seriesWa3,
                    seriesMicrosite: seriesMicrosite,
                    categories: categories,
                }, 200)
            }
        }
    } catch (err) {
        next(err)
    }
};

export const entriesSummaryV2 = async (req: Request, res: Response, next: NextFunction) => {
    const subtract = validateRequestQuery(req.query.subtract, "num") == 1 ? 1 : 0
    const type =
        validateRequestQuery(req.query.type, "char").toUpperCase() == "CHART"
            ? 1
            : validateRequestQuery(req.query.type, "char").toUpperCase() == "DATA"
                ? 2
                : validateRequestQuery(req.query.type, "char").toUpperCase() == "ALL"
                    ? 3
                    : 0;
    const startDate: any = validateRequestQuery(req.query.startDate, "any");
    const endDate: any = validateRequestQuery(req.query.endDate, "any");
    const condition =
        validateRequestQuery(req.query.condition, "char").toUpperCase() == "DAILY"
            ? 1
            : validateRequestQuery(req.query.condition, "char").toUpperCase() == "WEEKLY"
                ? 2
                : validateRequestQuery(req.query.condition, "char").toUpperCase() == "MONTHLY"
                    ? 3
                    : validateRequestQuery(req.query.condition, "char").toUpperCase() == "HOURLY"
                        ? 4
                        : 0;
    const media = validateRequestQuery(req.query.media, "num")
    try {
        let params = {
            condition: condition,
            type: type,
            subtract: subtract,
            startDate: startDate,
            endDate: endDate,
            media
        };
        if (
            condition == 0 ||
            type == 0
        ) {
            responseHandle(req, res, "Wrong parameter", "statusSummary", [], 400)
        } else {
        }
    } catch (err) {
        next(err)
    }
};

export const entriesSummaryV3 = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subtract = validateRequestQuery(req.query.subtract, "num") == 1 ? 1 : 0
        const type =
            validateRequestQuery(req.query.type, "char").toUpperCase() == "CHART"
                ? 1
                : validateRequestQuery(req.query.type, "char").toUpperCase() == "DATA"
                    ? 2
                    : validateRequestQuery(req.query.type, "char").toUpperCase() == "ALL"
                        ? 3
                        : 0;
        let startDate: any = validateRequestQuery(req.query.startDate, "any");
        if (startDate == "") {
            startDate = moment().subtract(30, "day").format("YYYY-MM-DD")
        }
        let endDate: any = validateRequestQuery(req.query.endDate, "any");
        if (endDate == "") {
            endDate = moment().format("YYYY-MM-DD")
        }
        const conditionCode =
            validateRequestQuery(req.query.condition, "char").toUpperCase() == "DAILY"
                ? 1
                : validateRequestQuery(req.query.condition, "char").toUpperCase() == "WEEKLY"
                    ? 2
                    : validateRequestQuery(req.query.condition, "char").toUpperCase() == "MONTHLY"
                        ? 3
                        : validateRequestQuery(req.query.condition, "char").toUpperCase() == "HOURLY"
                            ? 4
                            : 0;
        const condition =
            validateRequestQuery(req.query.condition, "char").toLowerCase()
        const media = validateRequestQuery(req.query.media, "num")
        if (
            conditionCode == 0 ||
            type == 0
        ) {
            responseHandle(req, res, "Wrong parameter", "statusSummary", [], 400)
        } else {
            const curDate = moment().format("YYYY-MM-DD")
            const curMonth = moment().format("YYYY-MM")
            const endDateIsNow = conditionCode == 1 || conditionCode == 2 || conditionCode == 4 ? moment(endDate).isSameOrAfter(curDate) : moment(endDate, "YYYY-MM").isSameOrAfter(curMonth)
            const summaryEntriesTotal = await model.summaryTotal("entries", endDateIsNow)
            const totalEntries = summaryEntriesTotal.reduce((a: any, b: any) => a + (b["counting"] || 0), 0)
            let params = {
                condition: condition,
                type: type,
                subtract: subtract,
                startDate: conditionCode == 2 ? moment(startDate).format("YYYY-") + numberFormat(moment(startDate).weeks(), 2) : conditionCode == 3 ? moment(startDate).format("YYYY-") + numberFormat(moment(startDate).month(), 3) : startDate,
                endDate: conditionCode == 2 ? moment(endDate).format("YYYY-") + numberFormat(moment(endDate).weeks(), 2) : conditionCode == 3 ? moment(endDate).format("YYYY-") + numberFormat(moment(endDate).month(), 3) : endDate,
                media
            };
            let seriesWa1: any = []
            let seriesWa2: any = []
            let seriesWa3: any = []
            let seriesMicrosite: any = []
            let categories: any = []
            let total = {
                totalValid: 0,
                totalInvalid: 0,
                totalValidWa1: 0,
                totalInvalidWa1: 0,
                totalValidWa2: 0,
                totalInvalidWa2: 0,
                totalValidWa3: 0,
                totalInvalidWa3: 0,
                totalValidMicrosite: 0,
                totalInvalidMicrosite: 0,
                totalAll: 0,
                totalAllWa1: 0,
                totalAllWa2: 0,
                totalAllWa3: 0,
                totalAllMicrosite: 0
            }
            let data = await model.summaryEntries(params, endDateIsNow).then((res) => {
                let fixData = []
                let returnVallue = {
                    DATE: "",
                    valid: 0,
                    invalid: 0,
                    validWa1: 0,
                    invalidWa1: 0,
                    validWa2: 0,
                    invalidWa2: 0,
                    validWa3: 0,
                    invalidWa3: 0,
                    validMicrosite: 0,
                    invalidMicrosite: 0,
                    all: 0,
                    allWa1: 0,
                    allWa2: 0,
                    allWa3: 0,
                    allMicrosite: 0
                }
                for (let index = 0; index < res.length; index++) {
                    const label = conditionCode == 1 ? moment(res[index].label).format("DD MMM YYYY") :
                        conditionCode == 2 ? weekRange(res[index].label) :
                            conditionCode == 3 ? moment(res[index].label).format("MMM YYYY") : moment(res[index].label, "H").format("HH:mm:ss")
                    // if (index == 0) {
                    //     returnVallue.DATE = label
                    //     returnVallue.valid = parseInt(res[index].valid)
                    //     returnVallue.invalid = parseInt(res[index].invalid)
                    //     returnVallue.validWa1 = parseInt(res[index].valid_wa_1)
                    //     returnVallue.invalidWa1 = parseInt(res[index].invalid_wa_1)
                    //     returnVallue.validWa2 = parseInt(res[index].valid_wa_2)
                    //     returnVallue.invalidWa2 = parseInt(res[index].invalid_wa_2)
                    //     returnVallue.validWa3 = parseInt(res[index].valid_wa_3)
                    //     returnVallue.invalidWa3 = parseInt(res[index].invalid_wa_3)
                    //     returnVallue.validMicrosite = parseInt(res[index].valid_microsite)
                    //     returnVallue.invalidMicrosite = parseInt(res[index].invalid_microsite)
                    //     returnVallue.all = parseInt(res[index].total)
                    //     returnVallue.allWa1 = parseInt(res[index].valid_wa_1) + parseInt(res[index].invalid_wa_1)
                    //     returnVallue.allWa2 = parseInt(res[index].valid_wa_2) + parseInt(res[index].invalid_wa_2)
                    //     returnVallue.allWa3 = parseInt(res[index].valid_wa_3) + parseInt(res[index].invalid_wa_3)
                    //     returnVallue.allMicrosite = parseInt(res[index].valid_microsite) + parseInt(res[index].invalid_microsite)
                    // } else {
                        if (returnVallue.DATE == label) {
                            returnVallue.valid += parseInt(res[index].valid)
                            returnVallue.invalid += parseInt(res[index].invalid)
                            returnVallue.validWa1 += parseInt(res[index].valid_wa_1)
                            returnVallue.invalidWa1 += parseInt(res[index].invalid_wa_1)
                            returnVallue.validWa2 += parseInt(res[index].valid_wa_2)
                            returnVallue.invalidWa2 += parseInt(res[index].invalid_wa_2)
                            returnVallue.validWa3 += parseInt(res[index].valid_wa_3)
                            returnVallue.invalidWa3 += parseInt(res[index].invalid_wa_3)
                            returnVallue.validMicrosite += parseInt(res[index].valid_microsite)
                            returnVallue.invalidMicrosite += parseInt(res[index].invalid_microsite)
                            returnVallue.all += parseInt(res[index].total)
                            returnVallue.allWa1 += parseInt(res[index].valid_wa_1) + parseInt(res[index].invalid_wa_1)
                            returnVallue.allWa2 += parseInt(res[index].valid_wa_2) + parseInt(res[index].invalid_wa_2)
                            returnVallue.allWa3 += parseInt(res[index].valid_wa_3) + parseInt(res[index].invalid_wa_3)
                            returnVallue.allMicrosite += parseInt(res[index].valid_microsite) + parseInt(res[index].invalid_microsite)
                        } else {
                            if (returnVallue.DATE!="") {
                                fixData.push(returnVallue)
                            }
                            returnVallue = {
                                DATE: label,
                                valid: parseInt(res[index].valid),
                                invalid: parseInt(res[index].invalid),
                                validWa1: parseInt(res[index].valid_wa_1),
                                invalidWa1: parseInt(res[index].invalid_wa_1),
                                validWa2: parseInt(res[index].valid_wa_2),
                                invalidWa2: parseInt(res[index].invalid_wa_2),
                                validWa3: parseInt(res[index].valid_wa_3),
                                invalidWa3: parseInt(res[index].invalid_wa_3),
                                validMicrosite: parseInt(res[index].valid_microsite),
                                invalidMicrosite: parseInt(res[index].invalid_microsite),
                                all: parseInt(res[index].total),
                                allWa1: parseInt(res[index].valid_wa_1) + parseInt(res[index].invalid_wa_1),
                                allWa2: parseInt(res[index].valid_wa_2) + parseInt(res[index].invalid_wa_2),
                                allWa3: parseInt(res[index].valid_wa_3) + parseInt(res[index].invalid_wa_3),
                                allMicrosite: parseInt(res[index].valid_microsite) + parseInt(res[index].invalid_microsite)
                                
                            }
                        }
                    // }
                    // if(conditionCode == 2 || conditionCode == 3){
                    //     total.totalValid = returnVallue.valid,
                    //     total.totalInvalid = returnVallue.invalid,
                    //     total.totalValidWa1 = returnVallue.validWa1,
                    //     total.totalInvalidWa1 = returnVallue.invalidWa1,
                    //     total.totalValidWa2 = returnVallue.validWa2,
                    //     total.totalInvalidWa2 = returnVallue.invalidWa2,
                    //     total.totalValidWa3 = returnVallue.validWa3,
                    //     total.totalInvalidWa3 = returnVallue.invalidWa3,
                    //     total.totalValidMicrosite = returnVallue.validMicrosite,
                    //     total.totalInvalidMicrosite = returnVallue.invalidMicrosite,
                    //     total.totalAll = returnVallue.all,
                    //     total.totalAllWa1 = returnVallue.allWa1,
                    //     total.totalAllWa2 = returnVallue.allWa2,
                    //     total.totalAllWa3 = returnVallue.allWa3,
                    //     total.totalAllMicrosite = returnVallue.allMicrosite
                    // } else {
                        total.totalValid += returnVallue.valid,
                        total.totalInvalid += returnVallue.invalid,
                        total.totalValidWa1 += returnVallue.validWa1,
                        total.totalInvalidWa1 += returnVallue.invalidWa1,
                        total.totalValidWa2 += returnVallue.validWa2,
                        total.totalInvalidWa2 += returnVallue.invalidWa2,
                        total.totalValidWa3 += returnVallue.validWa3,
                        total.totalInvalidWa3 += returnVallue.invalidWa3,
                        total.totalValidMicrosite += returnVallue.validMicrosite,
                        total.totalInvalidMicrosite += returnVallue.invalidMicrosite,
                        total.totalAll += returnVallue.all,
                        total.totalAllWa1 += returnVallue.allWa1,
                        total.totalAllWa2 += returnVallue.allWa2,
                        total.totalAllWa3 += returnVallue.allWa3,
                        total.totalAllMicrosite += returnVallue.allMicrosite
                    // }
                    
                    const categoriesIndex = categories.findIndex((v: any) =>
                        v == returnVallue.DATE
                    )
                    if (categoriesIndex < 0) {
                        categories.push(returnVallue.DATE)
                        seriesWa1.push(returnVallue.allWa1)
                        seriesWa2.push(returnVallue.allWa2)
                        seriesWa3.push(returnVallue.allWa3)
                        seriesMicrosite.push(returnVallue.allMicrosite)
                    } else {
                        seriesWa1[categoriesIndex] = returnVallue.allWa1
                        seriesWa2[categoriesIndex] = returnVallue.allWa2
                        seriesWa3[categoriesIndex] = returnVallue.allWa3
                        seriesMicrosite[categoriesIndex] = returnVallue.allMicrosite
                    }
                }
                fixData.push(returnVallue)
                return fixData
            })

            return res.send({
                message: "Success", data: {
                    data,
                    seriesWa1, seriesWa2, seriesWa3, seriesMicrosite, categories,
                    totalEntries,
                    total
                }
            })
        }
    } catch (error) {
        next(error)
    }
}

const numberFormat = (value: number, mode: number) => {
    return mode === 2 ? (value - 1) : (value + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
    })
}

const weekRange = (yearWeek: string) => {
    const ywSplit = yearWeek.split("-")
    const startDate = moment().week(+ywSplit[1] + 1).startOf("weeks").format(`DD MMM ${ywSplit[0]}`)
    const endDate = moment().week(+ywSplit[1] + 1).endOf("weeks").format(`DD MMM ${ywSplit[0]}`)
    return `${startDate} - ${endDate}`
}

export const topupSummary = async (req: Request, res: Response, next: NextFunction) => {
    const startDate: any = validateRequestQuery(req.query.startDate, "any");
    const endDate: any = validateRequestQuery(req.query.endDate, "any");
    const condition =
        validateRequestQuery(req.query.condition, "char").toUpperCase() == "DAILY"
            ? 1
            : validateRequestQuery(req.query.condition, "char").toUpperCase() == "WEEKLY"
                ? 2
                : validateRequestQuery(req.query.condition, "char").toUpperCase() == "MONTHLY"
                    ? 3
                    : validateRequestQuery(req.query.condition, "char").toUpperCase() == "HOURLY"
                        ? 4
                        : 0;
    
    try {
        let params = {
            condition: condition,
            startDate: startDate,
            endDate: endDate,
        };
        if (condition == 0) {
            responseHandle(req, res, "Wrong parameter", "topupSummary", [], 400)
        } else {
            const countTopup: any = await model.countTopup(params);
            const totalTopup: number = validateRequestQuery(countTopup[0].counts, "num") == "" ? 0 : parseInt(validateRequestQuery(countTopup[0].counts, "num"))
            let response: any = await model.summaryTopup(params);
            let series1 = [];
            let series2 = [];
            let series3 = [];
            let series4 = [];
            let seriesNominal1 = [];
            let seriesNominal2 = [];
            let seriesNominal3 = [];
            let seriesNominal4 = [];
            let categories = [];
            let total = {
                totalUnprocessed: validateRequestQuery(countTopup[0].totalUnprocessed, "num") == "" ? 0 : parseInt(validateRequestQuery(countTopup[0].totalUnprocessed, "num")),
                totalProcessed: validateRequestQuery(countTopup[0].totalProcessed, "num") == "" ? 0 : parseInt(validateRequestQuery(countTopup[0].totalProcessed, "num")),
                totalSuccess: validateRequestQuery(countTopup[0].totalSuccess, "num") == "" ? 0 : parseInt(validateRequestQuery(countTopup[0].totalSuccess, "num")),
                totalFailed: validateRequestQuery(countTopup[0].totalFailed, "num") == "" ? 0 : parseInt(validateRequestQuery(countTopup[0].totalFailed, "num")),
                totalAll: validateRequestQuery(countTopup[0].totalAll, "num") == "" ? 0 : parseInt(validateRequestQuery(countTopup[0].totalAll, "num")),
                totalNomUnprocessed: validateRequestQuery(countTopup[0].totalNomUnprocessed, "num") == "" ? 0 : parseInt(validateRequestQuery(countTopup[0].totalNomUnprocessed, "num")),
                totalNomProcessed: validateRequestQuery(countTopup[0].totalNomProcessed, "num") == "" ? 0 : parseInt(validateRequestQuery(countTopup[0].totalNomProcessed, "num")),
                totalNomSuccess: validateRequestQuery(countTopup[0].totalNomSuccess, "num") == "" ? 0 : parseInt(validateRequestQuery(countTopup[0].totalNomSuccess, "num")),
                totalNomFailed: validateRequestQuery(countTopup[0].totalNomFailed, "num") == "" ? 0 : parseInt(validateRequestQuery(countTopup[0].totalNomFailed, "num")),
                totalNomAll: validateRequestQuery(countTopup[0].totalNomAll, "num") == "" ? 0 : parseInt(validateRequestQuery(countTopup[0].totalNomAll, "num"))
            }
            if (condition == 4) {
                categories.push("00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23")
                let data = []
                for (let index = 0; index < categories.length; index++) {
                    const categorie = categories[index]
                    const dateIndexOf = response.findIndex((x: any) => x.DATE == categorie)
                    if (dateIndexOf < 0) {
                        series1.push(0)
                        series2.push(0)
                        series3.push(0)
                        series4.push(0)
                        seriesNominal1.push(0)
                        seriesNominal2.push(0)
                        seriesNominal3.push(0)
                        seriesNominal4.push(0)
                        data.push({
                            DATE: categorie,
                            unprocessed: 0,
                            processed: 0,
                            success: 0,
                            failed: 0,
                            allUnprocessed: 0,
                            allProcessed: 0,
                            allSuccess: 0,
                            allFailed: 0,
                            all: 0
                        })
                    } else {
                        series1.push(response[dateIndexOf].unprocessed)
                        series2.push(response[dateIndexOf].processed)
                        series3.push(response[dateIndexOf].success)
                        series4.push(response[dateIndexOf].failed)
                        seriesNominal1.push(response[dateIndexOf].nomUnprocessed)
                        seriesNominal2.push(response[dateIndexOf].nomProcessed)
                        seriesNominal3.push(response[dateIndexOf].nomSuccess)
                        seriesNominal4.push(response[dateIndexOf].nomFailed)
                        data.push(response[dateIndexOf])
                    }
                }
                response = data
            } else {
                for (let index = 0; index < response.length; index++) {
                    series1.push(response[index].unprocessed)
                    series2.push(response[index].processed)
                    series3.push(response[index].success)
                    series4.push(response[index].failed)
                    seriesNominal1.push(response[index].nomUnprocessed);
                    seriesNominal2.push(response[index].nomProcessed);
                    seriesNominal3.push(response[index].nomSuccess);
                    seriesNominal4.push(response[index].nomFailed);
                    categories.push(response[index].DATE);
                }
            }
            //chart & data
            return responseHandle(req, res, "Success", filename, {
                data: response,
                total: total,
                series1: series1,
                series2: series2,
                series3: series3,
                series4: series4,
                seriesNominal1: seriesNominal1,
                seriesNominal2: seriesNominal2,   
                seriesNominal3: seriesNominal3,
                seriesNominal4: seriesNominal4,
                categories: categories,
            }, 200)
        }
    } catch (err) {
        next(err)
    }
};

export const statusSummary = async (req: Request, res: Response, next: NextFunction) => {
    const subtract = validateRequestQuery(req.query.subtract, "num") == 1 ? 1 : 0
    const type =
        validateRequestQuery(req.query.type, "char").toUpperCase() == "CHART"
            ? 1
            : validateRequestQuery(req.query.type, "char").toUpperCase() == "DATA"
                ? 2
                : validateRequestQuery(req.query.type, "char").toUpperCase() == "ALL"
                    ? 3
                    : 0;
    const startDate: any = validateRequestQuery(req.query.startDate, "any");
    const endDate: any = validateRequestQuery(req.query.endDate, "any");
    const condition =
        validateRequestQuery(req.query.condition, "char").toUpperCase() == "DAILY"
            ? 1
            : validateRequestQuery(req.query.condition, "char").toUpperCase() == "WEEKLY"
                ? 2
                : validateRequestQuery(req.query.condition, "char").toUpperCase() == "MONTHLY"
                    ? 3
                    : validateRequestQuery(req.query.condition, "char").toUpperCase() == "HOURLY"
                        ? 4
                        : 0;
    const media = validateRequestQuery(req.query.media, "num")
    try {
        let params = {
            condition,
            type,
            subtract,
            startDate,
            endDate,
            media
        };
        if (condition == 0 || type == 0) {
            return res.status(400).send({ message: "Parameter not valid", data: {} })
        } else {
            let data: any = {}
            let tempCategories = ["Format Salah", "KTP Salah", "Blacklisted", "Dibawah 17 Tahun", "Progam Sudah Selesai", "Kode Unik Salah", "Kode Unik Sudah Digunakan", "Melebihi Batas Pengiriman Perhari", "Tidak Beruntung"]
            let dataChart = {
                categories: ["Format Salah", "KTP Salah", "Blacklisted", "Dibawah 17 Tahun", "Progam Sudah Selesai", "Kode Unik Salah", "Kode Unik Sudah Digunakan", "Melebihi Batas Pengiriman Perhari", "Tidak Beruntung"],
                series: [0, 0, 0, 0, 0, 0, 0, 0, 0]
            }
            const response: any = await model.statusSummary(params);
            let dataList = []
            let dateTemp = ""
            let tempObj: any = {}
            for (let index = 0; index < response.length; index++) {
                const date = response[index].DATE
                const reason = response[index].reason
                const reasonCode = validateRequestQuery(reason, "numChar").toLowerCase()
                const total = parseInt(response[index].counts)
                const categoryIndex = dataChart.categories.indexOf(reason)
                if (categoryIndex >= 0) {
                    const idxTempCtgr = tempCategories.indexOf(reason, 0);
                    if (idxTempCtgr > -1) {
                        tempCategories.splice(idxTempCtgr, 1);
                    }
                    dataChart.series[categoryIndex] = total
                }
                if (dateTemp != date) {
                    dateTemp = date
                    if (Object.keys(tempObj).length != 0 && tempObj.constructor === Object) {
                        for (let index = 0; index < tempCategories.length; index++) {
                            const reason = tempCategories[index]
                            const reasonCode = validateRequestQuery(reason, "numChar").toLowerCase()
                            const total = 0
                            tempObj[`${reasonCode}`] = total
                        }
                        dataList.push(tempObj)
                        tempCategories = dataChart.categories
                        tempObj = {}
                    }
                } else {
                    tempObj["date"] = date
                    if (tempObj[`${reasonCode}`]) {
                        tempObj[`${reasonCode}`] += total
                    } else {
                        tempObj[`${reasonCode}`] = total
                    }
                }
            }
            if (Object.keys(tempObj).length != 0 && tempObj.constructor === Object) {
                for (let index = 0; index < tempCategories.length; index++) {
                    const reason = tempCategories[index]
                    const reasonCode = validateRequestQuery(reason, "numChar").toLowerCase()
                    const total = 0
                    tempObj[`${reasonCode}`] = total
                }
                dataList.push(tempObj)
            }
            if (type == 1) {
                data["chart"] = dataChart
            } else if (type == 2) {
                data["data"] = dataList
            } else {
                data["data"] = dataList
                data["chart"] = dataChart
            }
            res.send({ message: "Success", data })
        }
    } catch (err) {
        next(err)
    }
};

export const statusSummaryV2 = async (req: Request, res: Response, next: NextFunction) => {
    const subtract = validateRequestQuery(req.query.subtract, "num") == 1 ? 1 : 0
    const type =
        validateRequestQuery(req.query.type, "char").toUpperCase() == "CHART"
            ? 1
            : validateRequestQuery(req.query.type, "char").toUpperCase() == "DATA"
                ? 2
                : validateRequestQuery(req.query.type, "char").toUpperCase() == "ALL"
                    ? 3
                    : 0;
    const startDate: any = validateRequestQuery(req.query.startDate, "any");
    const endDate: any = validateRequestQuery(req.query.endDate, "any");
    const condition =
        validateRequestQuery(req.query.condition, "char").toUpperCase() == "DAILY"
            ? 1
            : validateRequestQuery(req.query.condition, "char").toUpperCase() == "WEEKLY"
                ? 2
                : validateRequestQuery(req.query.condition, "char").toUpperCase() == "MONTHLY"
                    ? 3
                    : validateRequestQuery(req.query.condition, "char").toUpperCase() == "HOURLY"
                        ? 4
                        : 0;
    const media = validateRequestQuery(req.query.media, "num")
    try {
        let params = {
            condition,
            type,
            subtract,
            startDate,
            endDate,
            media
        };

        if (condition == 0 || type == 0) {
            return errorHandle(req, res, "wrong paramater", "statusSummary", [], 400)
        } else {
            const response: any = await model.statusSummaryV2(params);
            let validSeries = 0;
            let invalidSeries = 0;
            let validWa1Series = 0;
            let invalidWa1Series = 0;
            let validWa2Series = 0;
            let invalidWa2Series = 0;
            let validWa3Series = 0;
            let invalidWa3Series = 0;
            let validMicrositeSeries = 0;
            let invalidMicrositeSeries = 0;

            let wrongFormatSeries = 0
            let wrongKTPSeries = 0
            let underAgeSeries = 0
            let notYetStartSeries = 0
            let overProgramSeries = 0
            let wrongCouponSeries = 0
            let duplicateCouponSeries = 0
            let differentFromPrevSeries = 0
            let blacklistSeries = 0
            let categoriesReason = [
                "Format Salah",
                "No KTP Salah",
                "Dibawah 17 Tahun",
                "Kode Unik Sudah Digunakan",
                "Program Belum Dimulai",
                "Program Berakhir",
                "Kode Unik Salah",
                "Sender & KTP tidak sesuai dengan sebelumnya",
                "Blacklist"
            ];
            let categoriesValidInvalid = ["Valid", "Invalid"];

            for (let index = 0; index < response.length; index++) {
                const valid = validateRequestQuery(response[index].valid, "num") == "" ? 0 : parseInt(validateRequestQuery(response[index].valid, "num"))
                const invalid = validateRequestQuery(response[index].invalid, "num") == "" ? 0 : parseInt(validateRequestQuery(response[index].invalid, "num"))
                const validWa1 = validateRequestQuery(response[index].validWa1, "num") == "" ? 0 : parseInt(validateRequestQuery(response[index].validWa1, "num"))
                const invalidWa1 = validateRequestQuery(response[index].invalidWa1, "num") == "" ? 0 : parseInt(validateRequestQuery(response[index].invalidWa1, "num"))
                const validWa2 = validateRequestQuery(response[index].validWa2, "num") == "" ? 0 : parseInt(validateRequestQuery(response[index].validWa2, "num"))
                const invalidWa2 = validateRequestQuery(response[index].invalidWa2, "num") == "" ? 0 : parseInt(validateRequestQuery(response[index].invalidWa2, "num"))
                const validWa3 = validateRequestQuery(response[index].validWa3, "num") == "" ? 0 : parseInt(validateRequestQuery(response[index].validWa3, "num"))
                const invalidWa3 = validateRequestQuery(response[index].invalidWa3, "num") == "" ? 0 : parseInt(validateRequestQuery(response[index].invalidWa3, "num"))
                const validMicrosite = validateRequestQuery(response[index].validMicrosite, "num") == "" ? 0 : parseInt(validateRequestQuery(response[index].validMicrosite, "num"))
                const invalidMicrosite = validateRequestQuery(response[index].invalidMicrosite, "num") == "" ? 0 : parseInt(validateRequestQuery(response[index].invalidMicrosite, "num"))
                const wrongFormat = validateRequestQuery(response[index].wrongFormat, "num") == "" ? 0 : parseInt(validateRequestQuery(response[index].wrongFormat, "num"))
                const wrongKTP = validateRequestQuery(response[index].wrongKTP, "num") == "" ? 0 : parseInt(validateRequestQuery(response[index].wrongKTP, "num"))
                const underAge = validateRequestQuery(response[index].underAge, "num") == "" ? 0 : parseInt(validateRequestQuery(response[index].underAge, "num"))
                const notYetStart = validateRequestQuery(response[index].notYetStart, "num") == "" ? 0 : parseInt(validateRequestQuery(response[index].notYetStart, "num"))
                const overProgram = validateRequestQuery(response[index].overProgram, "num") == "" ? 0 : parseInt(validateRequestQuery(response[index].overProgram, "num"))
                const wrongCoupon = validateRequestQuery(response[index].wrongCoupon, "num") == "" ? 0 : parseInt(validateRequestQuery(response[index].wrongCoupon, "num"))
                const duplicateCoupon = validateRequestQuery(response[index].duplicateCoupon, "num") == "" ? 0 : parseInt(validateRequestQuery(response[index].duplicateCoupon, "num"))
                const differentFromPrev = validateRequestQuery(response[index].differentFromPrev, "num") == "" ? 0 : parseInt(validateRequestQuery(response[index].differentFromPrev, "num"))
                const blacklist = validateRequestQuery(response[index].blacklist, "num") == "" ? 0 : parseInt(validateRequestQuery(response[index].blacklist, "num"))
                wrongFormatSeries += wrongFormat
                wrongKTPSeries += wrongKTP
                underAgeSeries += underAge
                notYetStartSeries += notYetStart
                overProgramSeries += overProgram
                wrongCouponSeries += wrongCoupon
                duplicateCouponSeries += duplicateCoupon
                differentFromPrevSeries += differentFromPrev
                blacklistSeries += blacklist
                validSeries += valid
                invalidSeries += invalid
                validWa1Series += validWa1
                invalidWa1Series += invalidWa1
                validWa2Series += validWa2
                invalidWa2Series += invalidWa2
                validWa3Series += validWa3
                invalidWa3Series += invalidWa3
                validMicrositeSeries += validMicrosite
                invalidMicrositeSeries += invalidMicrosite
            }
            let seriesValidInvalid = [validSeries, invalidSeries];
            let seriesReason = [
                wrongFormatSeries,
                wrongKTPSeries,
                underAgeSeries,
                duplicateCouponSeries,
                notYetStartSeries,
                overProgramSeries,
                wrongCouponSeries,
                differentFromPrevSeries,
                blacklistSeries
            ]

            if (type == 1) {
                // chart only
                const data = {
                    invalidReason: {
                        categories: categoriesReason,
                        series: seriesReason,
                    },
                    validInvalid: {
                        categories: categoriesValidInvalid,
                        series: seriesValidInvalid,
                    },
                }
                return responseHandle(req, res, "Success to get data", "statusSummary", data, 200)
            } else if (type == 2) {
                // data only
                const data = {
                    wrongFormat: wrongFormatSeries,
                    wrongKTP: wrongKTPSeries,
                    underAge: underAgeSeries,
                    notYetStart: notYetStartSeries,
                    overProgram: overProgramSeries,
                    wrongCoupon: wrongCouponSeries,
                    duplicateCoupon: duplicateCouponSeries,
                    differentFromPrev: differentFromPrevSeries,
                    blacklist: blacklistSeries,
                    invalid: invalidSeries,
                    validWa1: validWa1Series,
                    invalidWa1: invalidWa1Series,
                    validWa2: validWa2Series,
                    invalidWa2: invalidWa2Series,
                    validWa3: validWa3Series,
                    invalidWa3: invalidWa3Series,
                    validMicrosite: validMicrositeSeries,
                    invalidMicrosite: invalidMicrositeSeries,
                    response,
                }
                return responseHandle(req, res, "Success to get data", "statusSummary", data, 200)
            } else if (type == 3) {
                // chart & data
                const data = {
                    chart: {
                        invalidReason: {
                            categories: categoriesReason,
                            series: seriesReason,
                        },
                        validInvalid: {
                            categories: categoriesValidInvalid,
                            series: seriesValidInvalid,
                        },
                    },
                    data: {
                        wrongFormat: wrongFormatSeries,
                        wrongKTP: wrongKTPSeries,
                        underAge: underAgeSeries,
                        notYetStart: notYetStartSeries,
                        overProgram: overProgramSeries,
                        wrongCoupon: wrongCouponSeries,
                        duplicateCoupon: duplicateCouponSeries,
                        differentFromPrev: differentFromPrevSeries,
                        blacklist: blacklistSeries,
                        valid: validSeries,
                        invalid: invalidSeries,
                        validWa1: validWa1Series,
                        invalidWa1: invalidWa1Series,
                        validWa2: validWa2Series,
                        invalidWa2: invalidWa2Series,
                        validWa3: validWa3Series,
                        invalidWa3: invalidWa3Series,
                        validMicrosite: validMicrositeSeries,
                        invalidMicrosite: invalidMicrositeSeries,
                        response,
                    },
                }
                return responseHandle(req, res, "Success to get data", "statusSummary", data, 200)
            }
        }
    } catch (err) {
        next(err)
    }
};

export const profileSummary = async (req: Request, res: Response, next: NextFunction) => {
    const subtract = validateRequestQuery(req.query.subtract, "num") == 1 ? 1 : 0
    const media = validateRequestQuery(req.query.media, "num")
    const type =
        validateRequestQuery(req.query.type, "char").toUpperCase() == "CHART"
            ? 1
            : validateRequestQuery(req.query.type, "char").toUpperCase() == "DATA"
                ? 2
                : validateRequestQuery(req.query.type, "char").toUpperCase() == "ALL"
                    ? 3
                    : 0;
    const startDate: any = validateRequestQuery(req.query.startDate, "any");
    const endDate: any = validateRequestQuery(req.query.endDate, "any");
    const condition =
        validateRequestQuery(req.query.condition, "char").toUpperCase() == "DAILY"
            ? 1
            : validateRequestQuery(req.query.condition, "char").toUpperCase() == "WEEKLY"
                ? 2
                : validateRequestQuery(req.query.condition, "char").toUpperCase() == "MONTHLY"
                    ? 3
                    : validateRequestQuery(req.query.condition, "char").toUpperCase() == "HOURLY"
                        ? 4
                        : 0;
    try {
        let params = {
            condition: condition,
            type: type,
            startDate: startDate,
            endDate: endDate,
            subtract: subtract,
            media: media
        };

        if (condition == 0 || type == 0) {
            return errorHandle(req, res, "wrong paramater", "profileSummary", [], 400)
        } else {
            let countProfile = await model.countProfiles(params);
            const getTotalProfile: any = await model.totalProfile(subtract)
            let totalProfile = parseInt(getTotalProfile[0].counts);
            let response: any = await model.profileSummary(params);

            let seriesAll = [];
            let categories = [];

            for (let index = 0; index < response.length; index++) {
                seriesAll.push(parseInt(response[index].all));
                categories.push(response[index].DATE);
            }
            let total = {
                totalAll: seriesAll.reduce((a, b) => a + b, 0),
            };
            if (type == 1) {
                //chart only
                const data = {
                    totalProfile: totalProfile,
                    total: total,
                    seriesAll: seriesAll,
                    categories: categories,
                }
                return responseHandle(req, res, "Success to get data", "profileSummary", data, 200)
            } else if (type == 2) {
                // data only
                return responseHandle(req, res, "Success to get data", "profileSummary", response, 200)
            } else if (type == 3) {
                //chart & data
                const data = {
                    data: response,
                    totalProfile: totalProfile,
                    total: total,
                    seriesAll: seriesAll,
                    categories: categories,
                }
                return responseHandle(req, res, "Success to get data", "profileSummary", data, 200)
            }
        }
    } catch (err) {
        next(err)
    }
};

export const profileSummaryV2 = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subtract = validateRequestQuery(req.query.subtract, "num") == 1 ? 1 : 0
        const type =
            validateRequestQuery(req.query.type, "char").toUpperCase() == "CHART"
                ? 1
                : validateRequestQuery(req.query.type, "char").toUpperCase() == "DATA"
                    ? 2
                    : validateRequestQuery(req.query.type, "char").toUpperCase() == "ALL"
                        ? 3
                        : 0;
        let startDate: any = validateRequestQuery(req.query.startDate, "any");
        if (startDate == "") {
            startDate = moment().subtract(30, "day").format("YYYY-MM-DD")
        }
        let endDate: any = validateRequestQuery(req.query.endDate, "any");
        if (endDate == "") {
            endDate = moment().format("YYYY-MM-DD")
        }
        const conditionCode =
            validateRequestQuery(req.query.condition, "char").toUpperCase() == "DAILY"
                ? 1
                : validateRequestQuery(req.query.condition, "char").toUpperCase() == "WEEKLY"
                    ? 2
                    : validateRequestQuery(req.query.condition, "char").toUpperCase() == "MONTHLY"
                        ? 3
                        : validateRequestQuery(req.query.condition, "char").toUpperCase() == "HOURLY"
                            ? 4
                            : 0;
        const condition =
            validateRequestQuery(req.query.condition, "char").toLowerCase()
        const media = validateRequestQuery(req.query.media, "num")
        if (
            conditionCode == 0 ||
            type == 0
        ) {
            responseHandle(req, res, "Wrong parameter", "statusSummary", [], 400)
        } else {
            const curDate = moment().format("YYYY-MM-DD")
            const curMonth = moment().format("YYYY-MM")
            const endDateIsNow = conditionCode == 1 || conditionCode == 2 || conditionCode == 4 ? moment(endDate).isSameOrAfter(curDate) : moment(endDate, "YYYY-MM").isSameOrAfter(curMonth)
            const summaryProfileTotal = await model.summaryTotal("profile", endDateIsNow)
            const totalProfile = summaryProfileTotal.reduce((a: any, b: any) => a + (b["counting"] || 0), 0)
            let params = {
                condition: condition,
                type: type,
                subtract: subtract,
                startDate: conditionCode == 2 ? moment(startDate).format("YYYY-") + numberFormat(moment(startDate).weeks(), 2) : conditionCode == 3 ? moment(startDate).format("YYYY-") + numberFormat(moment(startDate).month(), 3) :startDate,
                endDate: conditionCode == 2 ? moment(endDate).format("YYYY-") + numberFormat(moment(endDate).weeks(), 2) : conditionCode == 3 ? moment(endDate).format("YYYY-") + numberFormat(moment(endDate).month(), 3) : endDate,
                media
            };

            let series: any = []
            let categories: any = []
            let total = {
                totalValid: 0,
                totalInvalid: 0,
                totalValidWa1: 0,
                totalInvalidWa1: 0,
                totalValidWa2: 0,
                totalInvalidWa2: 0,
                totalValidWa3: 0,
                totalInvalidWa3: 0,
                totalValidMicrosite: 0,
                totalInvalidMicrosite: 0,
                totalAll: 0,
                totalAllWa1: 0,
                totalAllWa2: 0,
                totalAllWa3: 0,
                totalAllMicrosite: 0
            }
            let data = await model.summaryProfile(params, endDateIsNow).then((res) => {
                let fixData = []
                let returnVallue = {
                    DATE: "",
                    total: 0
                }
                for (let index = 0; index < res.length; index++) {
                    if(res[index].label !== null){
                    const label = conditionCode == 1 ? moment(res[index].label).format("DD MMM YYYY") :
                        conditionCode == 2 ? weekRange(res[index].label) :
                            conditionCode == 3 ? moment(res[index].label).format("MMM YYYY") : moment(res[index].label, "H").format("HH:mm:ss")
                    if (index == 0) {
                        returnVallue.DATE = label
                        returnVallue.total = +res[index].total
                    } else {
                        if (returnVallue.DATE == label) {
                            returnVallue.total += +res[index].total
                        } else {
                            fixData.push(returnVallue)
                            returnVallue = {
                                DATE: label,
                                total: +res[index].total,
                            }
                        }
                    }
                    const categoriesIndex = categories.findIndex((v: any) =>
                        v == returnVallue.DATE
                    )
                    if (categoriesIndex < 0) {
                        categories.push(returnVallue.DATE)
                        series.push(returnVallue.total)
                    } else {
                        series[categoriesIndex] = returnVallue.total
                    }
                }
                fixData.push(returnVallue)
                return fixData
            }})

            return res.send({
                message: "Success", data: {
                    data,
                    series, 
                    categories,
                    totalProfile
                }
            })
        }
    } catch (error) {
        next(error)
    }
}

//registration summary

export const registrationSummary = async (req: Request, res: Response, next: NextFunction) => {
    const subtract = validateRequestQuery(req.query.subtract, "num") == 1 ? 1 : 0
    const type =
        validateRequestQuery(req.query.type, "char").toUpperCase() == "CHART"
            ? 1
            : validateRequestQuery(req.query.type, "char").toUpperCase() == "DATA"
                ? 2
                : validateRequestQuery(req.query.type, "char").toUpperCase() == "ALL"
                    ? 3
                    : 0;
    const startDate: any = validateRequestQuery(req.query.startDate, "any");
    const endDate: any = validateRequestQuery(req.query.endDate, "any");
    const condition =
        validateRequestQuery(req.query.condition, "char").toUpperCase() == "DAILY"
            ? 1
            : validateRequestQuery(req.query.condition, "char").toUpperCase() == "WEEKLY"
                ? 2
                : validateRequestQuery(req.query.condition, "char").toUpperCase() == "MONTHLY"
                    ? 3
                    : validateRequestQuery(req.query.condition, "char").toUpperCase() == "HOURLY"
                        ? 4
                        : 0;
    const media = validateRequestQuery(req.query.media, "num")
    try {
        let params = {
            condition,
            type,
            startDate,
            endDate,
            subtract,
            media
        };

        if (condition == 0 || type == 0) {
            return errorHandle(req, res, "wrong paramater", "registrationSummary", [], 400)
        } else {
            let countProfile: any = await model.countProfiles(params);

            const getTotalRegistration: any = await model.totalRegistration(params, subtract)
            let totalRegistration = parseInt(getTotalRegistration[0].counts)
            let totalWrongFormat = parseInt(getTotalRegistration[0].wrongFormat)
            let totalWrongCodeUnique = parseInt(getTotalRegistration[0].wrongCodeUnique)
            let totalCodeUniqueUsed = parseInt(getTotalRegistration[0].codeUniqueUsed)
            let totalNotYetStart = parseInt(getTotalRegistration[0].notYetStart)
            let totalOverProgram = parseInt(getTotalRegistration[0].overProgram)
            let totalBlacklist = parseInt(getTotalRegistration[0].blacklist)
            let totalWrongKTP = parseInt(getTotalRegistration[0].wrongKTP)
            let totalWrongNoTransactions = parseInt(getTotalRegistration[0].wrongNoTransactions)
            let totalNoTransactionsUsed = parseInt(getTotalRegistration[0].noTransactionsUsed)
            let totalUnlucky = parseInt(getTotalRegistration[0].unlucky)
            let totalValid = parseInt(getTotalRegistration[0].valid)
            let totalInvalid = parseInt(getTotalRegistration[0].invalid)

            let response: any = await model.registrationSummary(params);
            let seriesAll = [];
            let categories = [];

            for (let index = 0; index < response.length; index++) {
                seriesAll.push(parseInt(response[index].all));
                categories.push(response[index].DATE);
            }
            let total = {
                totalAll: seriesAll.reduce((a, b) => a + b, 0),
            };
            if (type == 1) {
                //chart only
                const data = {
                    totalWrongFormat: totalWrongFormat,
                    totalWrongCodeUnique: totalWrongCodeUnique,
                    totalCodeUniqueUsed: totalCodeUniqueUsed,
                    totalNotYetStart: totalNotYetStart,
                    totalOverProgram: totalOverProgram,
                    totalBlacklist: totalBlacklist,
                    totalWrongKTP: totalWrongKTP,
                    totalWrongNoTransactions: totalWrongNoTransactions,
                    totalNoTransactionsUsed: totalNoTransactionsUsed,
                    totalUnlucky: totalUnlucky,
                    totalValid: totalValid,
                    totalInvalid: totalInvalid,
                    totalRegistration: totalRegistration,
                    total: total,
                    seriesAll: seriesAll,
                    categories: categories,
                }
                return responseHandle(req, res, "Success to get DATA", "registrationSummary", data, 200)
            } else if (type == 2) {
                // data only
                return responseHandle(req, res, "Success to get DATA", "registrationSummary", response, 200)
            } else if (type == 3) {
                //chart & data
                const data = {
                    data: response,
                    totalWrongFormat: totalWrongFormat,
                    totalWrongCodeUnique: totalWrongCodeUnique,
                    totalCodeUniqueUsed: totalCodeUniqueUsed,
                    totalNotYetStart: totalNotYetStart,
                    totalOverProgram: totalOverProgram,
                    totalBlacklist: totalBlacklist,
                    totalWrongKTP: totalWrongKTP,
                    totalWrongNoTransactions: totalWrongNoTransactions,
                    totalNoTransactionsUsed: totalNoTransactionsUsed,
                    totalUnlucky: totalUnlucky,
                    totalValid: totalValid,
                    totalInvalid: totalInvalid,
                    totalRegistration: totalRegistration,
                    total: total,
                    seriesAll: seriesAll,
                    categories: categories,
                }
                return responseHandle(req, res, "Success to get data", "registrationSummary", data, 200)
            }
        }
    } catch (err) {
        next(err)
    }
};