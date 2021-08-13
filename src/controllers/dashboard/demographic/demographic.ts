import { NextFunction, Request, Response, response } from 'express';
import * as model from "./model";
import { errorHandle, pagination, responseHandle, validateRequestQuery } from '../../../config/baseFunction';
import moment from 'moment';
import { summaryTotal } from './model';

export const listDistribution = async (req: Request, res: Response, next: NextFunction) => {
    let apiUrl = `/api/v1/dashboard/demographic/distribution/all`;
    const subtract = validateRequestQuery(req.query.subtract, "num") == 1 ? 1 : 0
    const dataPerPage: number =
        validateRequestQuery(req.query.row, "num") == 0
            ? 10
            : validateRequestQuery(req.query.row, "num");

    const key: string = validateRequestQuery(req.query.key, "numCharSpace");
    const page: number = validateRequestQuery(req.query.page, "num");
    const media = validateRequestQuery(req.query.media, "num");
    const column: string = validateRequestQuery(req.query.order, "any");
    const direction = validateRequestQuery(req.query.orderCondition, "char").toUpperCase();
    const type = validateRequestQuery(req.query.type, "num").toUpperCase() == "2" ? 2 : 1
    let params = {
        key: key,
        column: column,
        direction: direction,
        limitQuery: "",
        subtract: subtract,
        media: media
    };
    try {
        let countDistribution: any = type === 2 ? await model.countDistributionKtp(params) : await model.countDistribution(params);

        let totalConsumer = countDistribution[0].counts;
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
        const listDistributor = type === 2 ? await model.listDistributionKtp(params) : await model.listDistribution(params)
        const data = {
            dataPerPage: paginations.dataPerPage,
            totalValid: countDistribution[0].totalValid,
            totalInvalid: countDistribution[0].totalInvalid,
            totalSubmit: countDistribution[0].totalSubmit,
            totalUniqueConsumen: countDistribution[0].totalUniqueConsumen,
            currentPage: paginations.currentPage,
            totalData: paginations.totalData,
            totalPage: paginations.totalPage,
            nextPage: nextPage,
            prevPage: prevPage,
            data: listDistributor,
        }
        return responseHandle(req, res, "Success to get data", "List Demograhpic", data, 200)
    } catch (err) {
        next(err)
    }
};

export const demographic = async (req: Request, res: Response, next: NextFunction) => {
    let clientRequest = {
        query: req.query,
        params: req.params,
        body: req.body,
    };
    const subtract = validateRequestQuery(req.query.subtract, "num") == 1 ? 1 : 0
    const media = validateRequestQuery(req.query.media, "num") == 0 ? "" : validateRequestQuery(req.query.media, "num")
    const type = validateRequestQuery(req.params.type, "char").toUpperCase() == "CHART" ? 1 :
        validateRequestQuery(req.params.type, "char").toUpperCase() == "DATA" ? 2 :
            validateRequestQuery(req.params.type, "char").toUpperCase() == "ALL" ? 3 : 0
    let apiUrl = `/api/v1/dashboard/demographic/${type}?subtract=${subtract}&media=${media}`;
    try {
        const demographicData: any = await model.demographic(subtract, media);

        const seriesGender = [
            demographicData[0].Male == null ? 0 : parseInt(demographicData[0].Male),
            demographicData[0].Female == null ? 0 : parseInt(demographicData[0].Female),
            demographicData[0].NonKTPGender == null ? 0 : parseInt(demographicData[0].NonKTPGender)]

        const seriesAge = [
            demographicData[0].umur17 == null ? 0 : parseInt(demographicData[0].umur17),
            demographicData[0].umur17_25 == null ? 0 : parseInt(demographicData[0].umur17_25),
            demographicData[0].umur26_35 == null ? 0 : parseInt(demographicData[0].umur26_35),
            demographicData[0].umur36_45 == null ? 0 : parseInt(demographicData[0].umur36_45),
            demographicData[0].umur46_55 == null ? 0 : parseInt(demographicData[0].umur46_55),
            demographicData[0].umur55 == null ? 0 : parseInt(demographicData[0].umur55),
            demographicData[0].NonKTPAge == null ? 0 : parseInt(demographicData[0].NonKTPAge)]

        const categoriesGender = ["Male", "Female", "Non KTP"]
        const categoriesAge = [
            "< 17 thn",
            "17-25 thn",
            "26-35 thn",
            "36-45 thn",
            "46-55 thn",
            "> 55 thn",
            "Non KTP"
        ]

        if (type == 1) {
            // cahert only
            const data = {
                seriesGender: seriesGender,
                seriesAge: seriesAge,
                categoriesGender: categoriesGender,
                categoriesAge: categoriesAge,
            }
            return responseHandle(req, res, "Success to get data", "demographic", data, 200)
        } else if (type == 2) {
            // data only
            const data = {
                result: {
                    gender: seriesGender,
                    age: seriesAge
                },
            }
            return responseHandle(req, res, "Success to get data", "demographic", data, 200)
        } else if (type == 3) {
            // data and chart
            const data = {
                result: {
                    gender: seriesGender,
                    age: seriesAge
                },
                seriesGender: seriesGender,
                seriesAge: seriesAge,
                categoriesGender: categoriesGender,
                categoriesAge: categoriesAge,
                media: media
            }
            return responseHandle(req, res, "Success to get data", "demographic", data, 200)
        } else {
            return errorHandle(req, res, "request not found, please contact developer", "demographic", [], 400)
        }
    } catch (error) {
        next(error)
    }
}

export const demographicV2 = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const media = validateRequestQuery(req.query.media, "num") == 0 ? "" : validateRequestQuery(req.query.media, "num")
        const type = validateRequestQuery(req.params.type, "char").toUpperCase() == "CHART" ? 1 :
            validateRequestQuery(req.params.type, "char").toUpperCase() == "DATA" ? 2 :
                validateRequestQuery(req.params.type, "char").toUpperCase() == "ALL" ? 3 : 0
        const dataDemographic = await model.summaryTotal(media)
        let seriesGender = []
        let seriesAge = []
        let categoriesGender = []
        let categoriesAge = []
        let ageCounting = 0
        let genderCounting = 0
        let nameAge = ''
        let nameGender = ''
        for (let index = 0; index < dataDemographic.length; index++) {
            const type = dataDemographic[index].type
            const name = dataDemographic[index].name
            const counting = dataDemographic[index].counting
            if (type == "gender") {
                if (nameGender == '') {
                    nameGender = name
                    genderCounting = +counting
                } else {
                    if (nameGender == name) {
                        genderCounting += +counting
                    } else {
                        categoriesGender.push(nameGender)
                        seriesGender.push(genderCounting)
                        nameGender = name
                        genderCounting = +counting
                    }
                }
            } else if (type == "age") {
                if (nameAge == '') {
                    nameAge = name
                    ageCounting = +counting
                } else {
                    if (nameAge == name) {
                        ageCounting += +counting
                    } else {
                        categoriesAge.push(nameAge)
                        seriesAge.push(ageCounting)
                        nameAge = name
                        ageCounting = +counting
                    }
                }
            }
        }
        if (type == 1) {
            // cahert only
            const data = {
                seriesGender: seriesGender,
                seriesAge: seriesAge,
                categoriesGender: categoriesGender,
                categoriesAge: categoriesAge,
            }
            return responseHandle(req, res, "Success to get data", "demographic", data, 200)
        } else if (type == 2) {
            // data only
            const data = {
                result: {
                    gender: seriesGender,
                    age: seriesAge
                },
            }
            return responseHandle(req, res, "Success to get data", "demographic", data, 200)
        } else if (type == 3) {
            // data and chart
            const data = {
                result: {
                    gender: seriesGender,
                    age: seriesAge
                },
                seriesGender: seriesGender,
                seriesAge: seriesAge,
                categoriesGender: categoriesGender,
                categoriesAge: categoriesAge,
                media: media
            }
            return responseHandle(req, res, "Success to get data", "demographic", data, 200)
        } else {
            return errorHandle(req, res, "request not found, please contact developer", "demographic", [], 400)
        }
    } catch (error) {
        next(error)
    }
}