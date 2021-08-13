import { query } from "../../config/baseFunction";

interface districtList {
    district_id: string
}

interface provinceList {
    province_id: string
}

interface regencyList {
    regency_id: string
}

interface prizeList {
    prize_id: string
}

const districtWhere = (district_id: string) => {
    if (district_id == "") {
        return ""
    } else {
        return ` WHERE id = ${district_id}`
    }
}

const provinceWhere = (province_id: string) => {
    if (province_id == "") {
        return ""
    } else {
        return ` WHERE id = ${province_id}`
    }
}

const regencyWhere = (regency_id: string) => {
    if (regency_id == "") {
        return ""
    } else {
        return ` WHERE id = ${regency_id}`
    }
}

const prizeWhere = (prize_id: string) => {
    if (prize_id == "") {
        return ""
    } else {
        return ` WHERE id = ${prize_id}`
    }
}

export const districtList = (params: districtList) => {
    let syntaxQuery = `SELECT * FROM code_district ${districtWhere(params.district_id)}`

    return query(syntaxQuery, [])
}

export const provinceList = (params: provinceList) => {
    let syntaxQuery = `SELECT * FROM code_province ${provinceWhere(params.province_id)}`

    return query(syntaxQuery, [])
}

export const regencyList = () => {
    let syntaxQuery = `SELECT * FROM code_regency`

    return query(syntaxQuery, [])
}

export const prizeList = (params: prizeList) => {
    let syntaxQuery = `SELECT * FROM prizes ${prizeWhere(params.prize_id)}`

    return query(syntaxQuery, [])
}

export const productList = () => {
    let stxQuery = `SELECT id, variant_name FROM variants`
    return query(stxQuery, [])
}

export const mediaList = () => {
    let queryDetailmedia = `SELECT code, name FROM media WHERE is_active = 1`;

    return query(queryDetailmedia, "");
};

export const replyList = () => {
    let queryDetailmedia = `SELECT id, name, entryActive AS active FROM reply WHERE enabled = 1`;

    return query(queryDetailmedia, "");
};