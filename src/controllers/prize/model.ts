import { query } from "../../config/baseFunction";
import moment from 'moment';

interface Type {
    startDate: any;
    endDate: any;
    key: string;
    column: string;
    direction: string;
    limitQuery: string;
    status: string;
    media: string;
    pulsaType: number;
}

const orderBy = (direction: string, column: string) => {
    const directionType =
        direction == "ASC" ? "ASC" : direction == "DESC" ? "DESC" : "";
    if (column == "" || directionType == "") {
        return " ORDER BY entries.rcvd_time DESC";
    } else {
        return ` ORDER BY ${column} ${directionType}`;
    }
}

const mediaWhere = (media: string) => {
    if (media == "") {
        return ""
    } else {
        return ` AND entries.media = ${media}`
    }
};

const keyWhere = (key: string) => {
    if (key == "") {
        return "";
    } else {
        return ` AND (
            entries.name  LIKE "${key}" OR
            entries.sender LIKE "${key}" OR
            entries.city LIKE "${key}" OR
            prizes.name LIKE "${key}" OR
            winners.status LIKE "${key}")`;
    }
};

const dateWhere = (startDate: any, endDate: any) => {
    if (startDate == "" || endDate == "") {
        return "";
    } else {
        return ` AND DATE(entries.rcvd_time) BETWEEN "${startDate}" AND "${endDate}"`;
    }
};

const statusWhere = (status: string) => {
    if (status == "") {
        return ""
    } else {
        return ` AND winners.status = ${status}`
    }
};

const typeWhere = (type: number) => {
    if (type == 0) {
        return ""
    } else {
        return ` AND prizes.id = ${type}`
    }
};


const checkParam = (date: string) => {
    if (moment(date).isSameOrBefore()) {
        return "<="
    } else {
        return "="
    }
}

export const countPrizePulsa = (params: Type) => {
    let queryCountPP = `SELECT COUNT(*) as counts
    FROM winners
    JOIN entries ON winners.entries_id = entries.id
    JOIN prizes ON winners.prize_id = prizes.id
    WHERE entries.is_deleted = 0
    AND prizes.type = 1
    ${keyWhere(params.key)}
    ${mediaWhere(params.media)}
    ${statusWhere(params.status)}
    ${typeWhere(params.pulsaType)}
    ${dateWhere(params.startDate, params.endDate)}`;
    return query(queryCountPP, "");
};

export const listPrizePulsa = (params: Type) => {
    let queryListPP = `
    SELECT
    winners.id,
    DATE_FORMAT(entries.rcvd_time,"%d %M %Y %H:%i:%s") AS rcvd_time,
    entries.name fullname,
    entries.sender,
    entries.city regency,
    prizes.name prize,
    prizes.type,
    winners.status
    FROM winners
    JOIN entries ON winners.entries_id = entries.id
    JOIN prizes ON winners.prize_id = prizes.id
    WHERE entries.is_deleted = 0
    AND prizes.type = 1
    ${keyWhere(params.key)}
    ${mediaWhere(params.media)}
    ${statusWhere(params.status)}
    ${typeWhere(params.pulsaType)}
    ${dateWhere(params.startDate, params.endDate)} 
    ${orderBy(params.direction, params.column)} 
    ${params.limitQuery}`;
    return query(queryListPP, "");
};

export const getAll = () => {
    const get = `SELECT id,name prize FROM prizes
        ORDER BY prizes.nominal DESC`
    return query(get, "")
}

export const countPrize = () => {
    return query("SELECT prizes.id,name, prizes.`type`, SUM(CASE WHEN allocations.is_used = 1 THEN 1 ELSE 0 END) AS used, SUM(CASE WHEN allocations.is_used = 0 THEN 1 ELSE 0 END) AS unused, COUNT(*) AS total, ROUND((SUM(CASE WHEN allocations.is_used=1 THEN 1 ELSE 0 END)/ SUM(CASE WHEN allocations.is_used=1 OR allocations.is_used=0 THEN 1 ELSE 0 END))*100) AS claimPercentage FROM allocations JOIN prizes ON(allocations.prize_id = prizes.id)", "")
}

export const summdaryData = () => {
    return query(`
    SELECT
         prizes.name,
         prizes.code,
         (CASE 
			WHEN is_used = 1 
			THEN DATE(allocations.used_date) 
			ELSE (CASE 
			    	WHEN DATE(allocations.date) <= CURDATE() 
				    THEN CURDATE() 
				    ELSE DATE(allocations.date) 
				 END) 
			END) date,
         count(1) quantity,
         SUM(case when is_used = 1 then 1 ELSE 0 END) used
    FROM
         prizes,
         allocations
    WHERE
         prizes.id = allocations.prize_id
    GROUP BY
         prizes.id,
         (CASE 
			WHEN is_used = 1 
			THEN DATE(allocations.used_date) 
			ELSE (CASE 
			    	WHEN DATE(allocations.date) <= CURDATE() 
				    THEN CURDATE() 
				    ELSE DATE(allocations.date) 
				 END) 
			END)
    ORDER BY date`, [])
}

export const sumWinPulsa = () => {
    return query(`
SELECT 
    prizes.name prizeName,
    IFNULL(SUM(CASE WHEN prizes.id THEN prizes.nominal+1000 ELSE 0 END),0) amount,
    IFNULL(SUM(CASE WHEN prizes.id THEN 1 ELSE 0 END),0) claim
FROM 
    winners,
    prizes
WHERE
    winners.prize_id = prizes.id
AND prizes.type=1
GROUP BY prizes.id`, [])
}

export const generalParameter = () => {
    return query(`SELECT * FROM general_parameter WHERE status = 1`, [])
}

export const prizeSettinglist = () => {
    return query(`SELECT 
                        prize_setting.id,
                        start_time,end_time,
                        enabled,
                        prize_setting.interval,
                        prize_setting.limit,
                        prizes.name AS name
                 from prize_setting
                 join prizes on prizes.id = prize_setting.prize_id`, [])
}

export const prizeSettingPerId = (id: number) => {
    return query("SELECT start_time,end_time,enabled,prize_setting.interval,prize_setting.limit,prizes.name AS name from prize_setting join prizes on prizes.id = prize_setting.prize_id WHERE id = ?", [id])
}

export const updatePrizeSetting = (startTime: string, endTime: string, enabled: number, limit: number, interval: number, id: number) => {
    return query("UPDATE prize_setting SET start_time = ?,end_time = ?,enabled = ?, prize_setting.limit = ?,prize_setting.interval = ? WHERE id = ?", [startTime, endTime, enabled, limit, interval, id])
}

export const insertAllocation = (values: string) => {
    return query(`INSERT INTO allocations(prize_id,date) VALUES${values}`, [])
}

export const moveDateAllocation = (prizeId: number, dateFrom: string, dateTo: string, row: number) => {
    return query("UPDATE allocations SET allocations.date = ? WHERE is_used = 0 AND dateFrom = ? AND prize_id = ? LIMIT ?", [dateTo, dateFrom, prizeId, row])
}

export const deleteAllocation = (prizeId: number, date: string, row: number) => {
    return query(`DELETE FROM allocations WHERE prize_id = ? AND is_used = 0 AND allocations.date ${checkParam(date)} ? LIMIT ${row}`, [prizeId, date, row])
}

export const editGeneralParameter = (id: number, value: string) => {
    return query("UPDATE general_parameter SET param= ? WHERE id = ?", [value, id])
}

export const countAllocation = (prizeId: number, date: string) => {
    return query(`SELECT IFNULL(COUNT(1),0) counts FROM allocations WHERE is_used = 0 AND allocations.date ${checkParam(date)} ? AND prize_id = ?`, [date, prizeId])
}

export const updateAllocation = (datefromEncode: string, datetoEncode: string, prizeId: number, quantity: number) => {
    const update = `UPDATE allocations SET date = ? WHERE date ${checkParam(datefromEncode)} ? AND prize_id = ?
     AND is_used = 0 LIMIT ?`
    return query(update, [datetoEncode, datefromEncode, prizeId, quantity])
}