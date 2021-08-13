import { NextFunction, Request, Response } from 'express';
import * as model from "./model"
import { validateRequestQuery, errorHandle, responseHandle } from '../../config/baseFunction';

export const districtList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const district_id = validateRequestQuery(req.query.district_id, "num")
        let params = {
            district_id: district_id
        }
        const districtList = await model.districtList(params)
        return responseHandle(req, res, "Success", "districtList", districtList, 200)
    } catch (error) {
        next(error)
    }
}

export const provinceList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const province_id = validateRequestQuery(req.query.province_id, "num")
        let params = {
            province_id: province_id
        }
        const provinceList = await model.provinceList(params)
        return responseHandle(req, res, "Success", "provinceList", provinceList, 200)
    } catch (error) {
        next(error)
    }
}

export const regencyList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const regency_id = validateRequestQuery(req.query.regency_id, "num")
        // let params = {
        //     regency_id: regency_id
        // }
        let data: any = []
        const regencyList = await model.regencyList()
        // if (regencyList.length > 0) {
        //     regencyList.map((item: any, index: number) => {
        //         data.push({
        //             key: index,
        //             name: "regency",
        //             value: item.id,
        //             text: item.area,
        //         })
        //     })
        // }
        return responseHandle(req, res, "Success", "regencyList", regencyList, 200)
    } catch (error) {
        next(error)
    }
}

export const prizeList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prize_id = validateRequestQuery(req.query.prize_id, "num")
        let params = {
            prize_id: prize_id
        }
        const prizeList = await model.prizeList(params)
        return responseHandle(req, res, "Success", "prizeList", prizeList, 200)
    } catch (error) {
        next(error)
    }
}

export const productList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productList = await model.productList()
        return responseHandle(req, res, "Success", "productList", productList, 200)
    } catch (error) {
        next(error)
    }
}

export const mediaList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let response: any = await model.mediaList();
        return responseHandle(req, res, "Success to get data", "mediaList", response, 200)
    } catch (err) {
        next(err)
    }
};

export const replyList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let response: any = await model.replyList();
        return responseHandle(req, res, "Success to get data", "replyList", response, 200)
    } catch (err) {
        next(err)
    }
};