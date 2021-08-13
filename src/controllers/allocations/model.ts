import { type } from "os";
import { query } from "../../config/baseFunction"

interface Type {
    column: string;
    direction: string;
    limitQuery: string;
    condition: number;
    type: number;
}


const orderBy = (direction: string, column: string) => {
    const directionType =
        direction == "ASC" ? "ASC" : direction == "DESC" ? "DESC" : "";
    if (column == "" || directionType == "") {
        return " ORDER BY CASE WHEN DATEDIFF(`date`, CURDATE()) < 0 THEN 1 ELSE 0 END, DATEDIFF(`date`, CURDATE())";
    } else {
        return ` ORDER BY ${column}  ${directionType}`;
    }
};

const typeWhere = (type: number) => {
    if (type == 0) {
        return ""
    } else {
        return ` WHERE allocations.prize_id = ${type}`
    }
};

export const countAllcoations = (params: Type) => {
    return query(`SELECT COUNT(*) OVER () AS counts FROM allocations ${typeWhere(params.type)} GROUP BY ${groupByCondition(params.condition)},region_id`, "")
}

const groupByCondition = (type: number) => {
    switch (type) {
        case 1:
            // daily
            return "allocations.date"
            break;
        case 2:
            // weekly
            return "WEEK(allocations.date)"
            break;
        case 3:
            // monthly
            return "MONTH(allocations.date)"
            break;
        default:
            return ""
            break;
    }
}

const whereCondition = (type: number, params: string, year: string) => {
    switch (type) {
        case 1:
            // daily
            return ` AND allocations.date = "${params}"`
            break;
        case 2:
            // weekly
            return ` AND WEEK(allocations.date) = ${params} AND YEAR(allocations.date) = ${year}`
            break;
        case 3:
            // monthly
            return ` AND MONTH(allocations.date) = ${params} AND YEAR(allocations.date) = ${year}`
            break;
        default:
            return ""
            break;
    }
}

export const listAllocations = (params: Type) => {
    const scriptQuery = `SELECT region.name AS regionName,MONTH(allocations.date) "monthInt",YEAR(allocations.date) 'year',
        WEEK(allocations.date) "weekInt",
        CONCAT(DATE_FORMAT(DATE_ADD(allocations.date, INTERVAL(1- DAYOFWEEK(allocations.date)) DAY),'%e %b %Y'), ' - ', DATE_FORMAT(DATE_ADD(allocations.date, INTERVAL(7- DAYOFWEEK(allocations.date)) DAY),'%e %b %Y')) AS weekly, 
        DATE_FORMAT(allocations.date,"%M") AS 'month',region_id AS region,DATE_FORMAT(allocations.date,"%Y-%m-%d") AS DATE,
        SUM(CASE WHEN is_used = 0 THEN 1 ELSE 0 END) AS unused,SUM(CASE WHEN is_used = 1 THEN 1 ELSE 0 END) AS used,COUNT(*) AS total,
        ROUND((SUM(case when is_used=1 then 1 ELSE 0 END)/SUM(case when is_used=1 OR is_used=0 then 1 ELSE 0 END))*100) AS claimPercentage 
        FROM allocations LEFT JOIN region ON allocations.region_id = region.id ${typeWhere(params.type)} 
        GROUP BY ${groupByCondition(params.condition)} ${orderBy(params.direction, params.column)} ${params.limitQuery}`
    return query(scriptQuery, "")
}

export const detaileAllocation = (params: string, idRegion: number, type: number, year: string) => {
    const detail = `SELECT prizes.id, name, type, code, SUM(CASE WHEN allocations.is_used = 1 THEN 1 ELSE 0 END) AS used,
    SUM(CASE WHEN allocations.is_used = 0 THEN 1 ELSE 0 END) AS unused,
    COUNT(*) AS total,ROUND((SUM(case when is_used=1 then 1 ELSE 0 END)/SUM(case when is_used=1 OR is_used=0 then 1 ELSE 0 END))*100) AS claimPercentage 
    FROM allocations JOIN prizes ON (allocations.prize_id = prizes.id) WHERE region_id = ?
    ${whereCondition(type, params, year)} GROUP BY prizes.id`
    return query(detail, [idRegion])
}

export const addNewAllocation = (dateTarget: string, prizeId: number) => {
    const add = `INSERT INTO allocations (prize_id, is_used, date) VALUES (?, 0, ?)`
    return query(add, [prizeId, dateTarget])
}

export const updateAllocation = (datefromEncode: string, datetoEncode: string, prizeId: number, quantity: number) => {
    const update = `UPDATE allocations SET date = ? WHERE date = ? AND prize_id = ?
     AND is_used = 0 LIMIT ?`
    return query(update, [datetoEncode, datefromEncode, prizeId, quantity])
}

export const regionByDate = (date: string, is_used: number) => {
    const region = `SELECT region_id,region.name AS regionName FROM allocations JOIN region ON allocations.region_id = region.id
    WHERE date ? AND is_used = ? GROUP BY region_id`
    return query(region, [date, is_used])
}

export const prizeByDateRegion = (date: string) => {
    const prize = `SELECT prizes.name AS prizeName, prizes.id FROM allocations JOIN prizes ON allocations.prize_id = prizes.id 
    WHERE date ${date} GROUP BY prizes.id`
    return query(prize, [])
}

export const countAllocation = (date: string, prizeId: number) => {
    const count = `SELECT COUNT(*) AS counts FROM allocations WHERE date ${date} AND prize_id = ? AND is_used = 0`
    return query(count, [prizeId])
}

export const insertAllocation = (date: string, regionId: number, prizeId: number) => {
    const insert = `INSERT INTO allocations(region_id,prize_id,date) VALUES(?,?,?)`
    return query(insert, [regionId, prizeId, date])
}

export const getPrizeByName = (name: string) => {
    const getPrize = `SELECT * FROM prizes WHERE UPPER(name) LIKE ?`
    return query(getPrize, ["%" + name + "%"])
}