import { query } from "../../config/baseFunction";
// import moment from 'moment';

interface Type {
    startDate: any;
    endDate: any;
    key: string;
    column: string;
    direction: string;
    limitQuery: string;
}

interface Type2 {
    accountNumber: any;
    prizeType: number;
    column: string;
    direction: string;
    limitQuery: string;
}

const orderBy = (direction: string, column: string) => {
    const directionType =
        direction == "ASC" ? "ASC" : direction == "DESC" ? "DESC" : "";
    if (column == "" || directionType == "") {
        return " ORDER BY winners.updated_at DESC";
    } else {
        return ` ORDER BY ${column}  ${directionType}`;
    }
};

const keyWhere = (key: string) => {
    if (key == "") {
        return "";
    } else {
        return ` AND (winners.account_number LIKE "%${key}%")`;
    }
};

const dateWhere = (startDate: any, endDate: any) => {
    if (startDate == "" || endDate == "") {
        return "";
    } else {
        return ` AND DATE(winners.updated_at) BETWEEN "${startDate} 00:00:00" AND "${endDate} 23:59:59"`;
    }
};

export const countTopup = (params: Type) => {
    let countQuery = `SELECT COUNT(1) AS counts
    FROM winners 
    JOIN prizes ON winners.prize_id = prizes.id
    WHERE prizes.type = 1 
    AND winners.status != 4
    ${keyWhere(params.key)}${dateWhere(params.startDate, params.endDate)}
    GROUP BY winners.account_number, prizes.id`;
    return query(countQuery, "");
};

export const listTopup = (params: Type) => {
    let thequery = `SELECT winners.account_number, prizes.id as prizeType, prizes.name AS prizeName,
SUM(case when winners.status = 0 then 1 ELSE 0 END) AS unprocessed,
SUM(case when winners.status = 1 then 1 ELSE 0 END) AS processed,
SUM(case when winners.status = 2 then 1 ELSE 0 END) AS success,
SUM(case when winners.status = 3 then 1 ELSE 0 END) AS failed
FROM winners 
JOIN prizes ON winners.prize_id = prizes.id
WHERE prizes.type = 1 
AND winners.status != 4
${keyWhere(params.key)}${dateWhere(params.startDate, params.endDate)}
GROUP BY winners.account_number, prizes.id
${orderBy(params.direction, params.column)} ${params.limitQuery}`;

return query(thequery, "");
};

export const countDetailTopup = (params: Type2) => {
    let countQuery = `SELECT COUNT(1) AS counts 
    FROM winners 
    JOIN prizes ON winners.prize_id = prizes.id
    WHERE prizes.type = 1    
    AND winners.status != 4  
    AND account_number = ?
    AND prizes.id = ?`;
    return query(countQuery, [params.accountNumber, params.prizeType]);
};

export const detailTopup = (params: Type2) => {
    let queryDetail = `SELECT winners.updated_at AS dateProcess, winners.status, winners.reason 
    FROM winners 
    JOIN prizes ON winners.prize_id = prizes.id
    WHERE prizes.type = 1    
    AND winners.status != 4  
    AND account_number = ?
    AND prizes.id = ?        
    ${orderBy(params.direction, params.column)} ${params.limitQuery}`;
    return query(queryDetail, [params.accountNumber, params.prizeType]);
};