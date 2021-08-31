import * as modelEntries from "../dashboard/entries/model"
import { Request, Response, NextFunction } from 'express';
import { validateRequestQuery } from '../../config/baseFunction';
const excel = require("node-excel-export");
import moment from "moment"
import * as modelConsumer from "../dashboard/consumerData/model"
import * as modelRegistration from "../dashboard/registration/model"
import * as modelDemographic from "../dashboard/demographic/model"
import * as modelWinner from "../winner/model"

export const exportEntries = async (req: Request, res: Response, next: NextFunction) => {
    const subtract = validateRequestQuery(req.query.subtract, "num") == 1 ? 1 : 0
    const key: string = validateRequestQuery(req.query.key, "numCharSpace");
    const columnSearch: string = validateRequestQuery(req.query.columnSearch, "any");
    const column: string = validateRequestQuery(req.query.column, "any");
    const direction = validateRequestQuery(
        req.query.direction,
        "char"
    ).toUpperCase();
    const startDate: any = validateRequestQuery(req.query.startDate, "any");
    const endDate: any = validateRequestQuery(req.query.endDate, "any");
    const isValid: any = req.query.isValid == "0" ? "0" : validateRequestQuery(req.query.isValid, "num");
    const isReplied: any = req.query.isReplied == "0" ? "0" : validateRequestQuery(req.query.isReplied, "num");
    const media: any = validateRequestQuery(req.query.media, "num");
    let params = {
        startDate: startDate,
        endDate: endDate,
        key: key,
        column: column,
        columnSearch: columnSearch,
        direction: direction,
        media: media,
        limitQuery: "",
        isValid: isValid,
        isReplied: isReplied,
        subtract: subtract
    };

    try {
        let response: any = await modelEntries.exportEntries(params);
        let obejctDefine: any
        if (response.length < 1) {
            obejctDefine = []
        } else {
            obejctDefine = Object.keys(response[0])
        }
        const styles = {
            headerDark: {
                fill: {
                    fgColor: {
                        rgb: "FFFFFF",
                    },
                },
                font: {
                    color: {
                        rgb: "000000",
                    },
                    sz: 14,
                    bold: true,
                    underline: true,
                    textAlign: "center",
                },
            },
        };
        let specification: any = {};
        for (let index = 0; index < obejctDefine.length; index++) {
            specification[`${obejctDefine[index]}`] = {
                displayName: obejctDefine[index],
                headerStyle: styles.headerDark,
                width: 30
            }
        }
        const report = excel.buildExport([
            {
                name: "Report",
                specification: specification,
                data: response,
            },
        ]);
        res.attachment(`${moment().format("DD-MM-YYYY")}_listEntries.xlsx`);
        res.send(report);

    } catch (error) {
        next(error)
    }
};

export const exportConsumerData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subtract = validateRequestQuery(req.query.subtract, "num") == 1 ? 1 : 0
        const key: string = validateRequestQuery(req.query.key, "numCharSpace");
        const column: string = validateRequestQuery(req.query.column, "any");
        const direction = validateRequestQuery(
            req.query.direction,
            "char"
        ).toUpperCase();
        const startDate: any = validateRequestQuery(req.query.startDate, "any");
        const endDate: any = validateRequestQuery(req.query.endDate, "any");
        const media: any = validateRequestQuery(req.query.media, "any");
        const region = validateRequestQuery(req.query.region, "num")

        let param = {
            startDate: startDate,
            endDate: endDate,
            key: key,
            column: column,
            direction: direction,
            limitQuery: "",
            media: media,
            subtract: subtract,
            region: region
        };

        let response: any = await modelConsumer.exportConsumer(param);
        let obejctDefine: any
        if (response.length < 1) {
            obejctDefine = []
        } else {
            obejctDefine = Object.keys(response[0])
        }
        const styles = {
            headerDark: {
                fill: {
                    fgColor: {
                        rgb: "FFFFFF",
                    },
                },
                font: {
                    color: {
                        rgb: "000000",
                    },
                    sz: 14,
                    bold: true,
                    underline: true,
                    textAlign: "center",
                },
            },
        };
        let specification: any = {};
        for (let index = 0; index < obejctDefine.length; index++) {
            specification[`${obejctDefine[index]}`] = {
                displayName: obejctDefine[index],
                headerStyle: styles.headerDark,
                width: 30
            }
        }
        const report = excel.buildExport([
            {
                name: "Report",
                specification: specification,
                data: response,
            },
        ]);
        res.attachment(`${moment().format("DD-MM-YYYY")}_listConsumer.xlsx`);
        res.send(report);

    } catch (error) {
        next(error)
    }
};

export const exportRegistration = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subtract = validateRequestQuery(req.query.subtract, "num") == 1 ? 1 : 0
        const key: string = validateRequestQuery(req.query.key, "numCharSpace");
        const column: string = validateRequestQuery(req.query.column, "any");
        const direction = validateRequestQuery(
            req.query.direction,
            "char"
        ).toUpperCase();
        const startDate: any = validateRequestQuery(req.query.startDate, "any");
        const endDate: any = validateRequestQuery(req.query.endDate, "any");
        const media: any = validateRequestQuery(req.query.media, "any");
        // const region = validateRequestQuery(req.query.region, "num")

        let param = {
            startDate: startDate,
            endDate: endDate,
            key: key,
            column: column,
            direction: direction,
            limitQuery: "",
            media: media,
            subtract: subtract,
            // region: region
        };

        let response: any = await modelRegistration.exportRegistration(param);
        let obejctDefine: any
        if (response.length < 1) {
            obejctDefine = []
        } else {
            obejctDefine = Object.keys(response[0])
        }
        const styles = {
            headerDark: {
                fill: {
                    fgColor: {
                        rgb: "FFFFFF",
                    },
                },
                font: {
                    color: {
                        rgb: "000000",
                    },
                    sz: 14,
                    bold: true,
                    underline: true,
                    textAlign: "center",
                },
            },
        };
        let specification: any = {};
        for (let index = 0; index < obejctDefine.length; index++) {
            specification[`${obejctDefine[index]}`] = {
                displayName: obejctDefine[index],
                headerStyle: styles.headerDark,
                width: 30
            }
        }
        const report = excel.buildExport([
            {
                name: "Report",
                specification: specification,
                data: response,
            },
        ]);
        res.attachment(`${moment().format("DD-MM-YYYY")}_listRegistration.xlsx`);
        res.send(report);

    } catch (error) {
        next(error)
    }
};

export const exportListDistribution = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subtract = validateRequestQuery(req.query.subtract, "num") == 1 ? 1 : 0
        const key: string = validateRequestQuery(req.query.key, "numCharSpace");
        const startDate: string = validateRequestQuery(req.query.startDate, "any");
        const endDate: string = validateRequestQuery(req.query.endDate, "any");
        const column: string = validateRequestQuery(req.query.column, "any");
        const media: any = validateRequestQuery(req.query.media, "num");
        const direction = validateRequestQuery(
            req.query.direction,
            "char"
        ).toUpperCase();

        let param = {
            key: key,
            column: column,
            direction: direction,
            limitQuery: "",
            subtract: subtract,
            startDate: startDate,
            endDate: endDate,
            media
        };

        let response: any = await modelDemographic.exportDistribution(param);
        let obejctDefine: any
        if (response.length < 1) {
            obejctDefine = []
        } else {
            obejctDefine = Object.keys(response[0])
        }
        const styles = {
            headerDark: {
                fill: {
                    fgColor: {
                        rgb: "FFFFFF",
                    },
                },
                font: {
                    color: {
                        rgb: "000000",
                    },
                    sz: 14,
                    bold: true,
                    underline: true,
                    textAlign: "center",
                },
            },
        };
        let specification: any = {};
        for (let index = 0; index < obejctDefine.length; index++) {
            specification[`${obejctDefine[index]}`] = {
                displayName: obejctDefine[index],
                headerStyle: styles.headerDark,
                width: 30
            }
        }
        const report = excel.buildExport([
            {
                name: "Report",
                specification: specification,
                data: response,
            },
        ]);
        res.attachment(`${moment().format("DD-MM-YYYY")}_listDistribution.xlsx`);
        res.send(report);
    } catch (error) {
        next(error)
    }
};

export const exportWinner = async (req: Request, res: Response, next: NextFunction) => {
    const key: string = validateRequestQuery(req.query.key, "numCharSpace");
    const column: string = validateRequestQuery(req.query.order, "any");
    const columnSearch: string = validateRequestQuery(req.query.columnSearch, "any");
    const direction = validateRequestQuery(
        req.query.orderCondition,
        "char"
    ).toUpperCase();
    const type = validateRequestQuery(req.query.type, "num")
    const status = validateRequestQuery(req.query.status, "num")
    const prizeId = validateRequestQuery(req.query.prizeId, "num")
    const typeTransaction = validateRequestQuery(req.query.typeTransaction, "num")
    const startDate = validateRequestQuery(req.query.startDate, "any")
    const endDate = validateRequestQuery(req.query.endDate, "any")
    const media: any = validateRequestQuery(req.query.media, "num");
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
            typeTransaction: typeTransaction,
            media,
            prizeId
        };
        let response: any = await modelWinner.exportWinnerV2(params);
        let obejctDefine: any
        if (response.length < 1) {
            obejctDefine = []
        } else {
            obejctDefine = Object.keys(response[0])
        }
        const styles = {
            headerDark: {
                fill: {
                    fgColor: {
                        rgb: "FFFFFF",
                    },
                },
                font: {
                    color: {
                        rgb: "000000",
                    },
                    sz: 14,
                    bold: true,
                    underline: true,
                    textAlign: "center",
                },
            },
        };
        let specification: any = {};
        for (let index = 0; index < obejctDefine.length; index++) {
            specification[`${obejctDefine[index]}`] = {
                displayName: obejctDefine[index],
                headerStyle: styles.headerDark,
                width: 30
            }
        }
        const report = excel.buildExport([
            {
                name: "Report",
                specification: specification,
                data: response,
            },
        ]);
        res.attachment(`${moment().format("DD-MM-YYYY")}_listWinner.xlsx`);
        res.send(report);
    } catch (error) {
        next(error)
    }
}