import { query } from "../../../config/baseFunction";
import moment from 'moment';

interface Type {
    startDate: any;
    endDate: any;
    key: string;
    column: string;
    columnSearch: string;
    direction: string;
    limitQuery: string;
    isValid: any;
    isReplied: any;
    subtract: number
    media: string
}

const orderBy = (direction: string, column: string) => {
    const directionType =
        direction == "ASC" ? "ASC" : direction == "DESC" ? "DESC" : "";
    if (column == "" || directionType == "") {
        return " ORDER BY entries.rcvd_time DESC";
    } else {
        return ` ORDER BY ${column}  ${directionType}`;
    }
};

// const keyWhere = (key: string) => {
//     if (key == "") {
//         return "";
//     } else {
//         return ` AND (entries.name LIKE "%${key}%" OR entries.hp LIKE "%${key}%" OR entries.city LIKE "%${key}%" OR entries.sender LIKE "%${key}%" OR entries.coupon LIKE "%${key}%")`;
//     }
// };

const keyWhere = (key: string, columnSearch: string) => {
    if (key == "") {
        return "";
    } else {
        return ` AND (entries.${columnSearch} LIKE "%${key}%")`;
    }
};

const dateWhere = (startDate: any, endDate: any) => {
    if (startDate == "" || endDate == "") {
        return "";
    } else {
        return ` AND DATE(entries.rcvd_time) BETWEEN "${startDate}" AND "${endDate}"`;
    }
};

const validWhere = (isValid: any) => {
    if (isValid == "") {
        return "";
    } else {
        return ` AND (entries.is_valid = ${isValid})`;
    }
};

const cutOfWhere = (subtract: number) => {
    if (subtract == 0) {
        return ""
    } else {
        return ` AND (DATE(entries.rcvd_time)<="${moment().subtract(2, "days").format("YYYY-MM-DD")}")`
    }
}

const mediaWhere = (media: string) => {
    if (media == "") {
        return ""
    } else {
        return ` AND (entries.media = ${media})`
    }
}

export const countEntries = (params: Type) => {
    let countQuery = `SELECT COUNT(*) AS counts FROM entries
LEFT JOIN profiles ON (entries.profile_id = profiles.id)
JOIN media ON entries.media = media.code
JOIN reply ON (entries.reply_id = reply.id)
LEFT JOIN (
SELECT winners.entries_id,prizes.name AS prizeName, prizes.type AS prizeType,prizes.nominalShow AS prizeNominal
FROM prizes
JOIN winners ON prizes.id = winners.prize_id
WHERE winners.entries_id != 0
) a ON (entries.id = a.entries_id)
WHERE entries.is_deleted = 0${keyWhere(
        params.key, params.columnSearch
    )}${dateWhere(params.startDate, params.endDate)}${mediaWhere(params.media)}${validWhere(params.isValid)}${cutOfWhere(params.subtract)}`;
    return query(countQuery, "");
};

export const listEntries = (params: Type) => {
    let listEntriesQuery = `SELECT entries.coupon,media.name AS media,entries.id, entries.rcvd_time, entries.name, entries.sender, entries.hp, entries.city AS regency, profiles.id AS profileId, entries.is_valid,reply.reply AS 'reply',
   entries.is_reply AS is_replied
FROM entries
LEFT JOIN profiles ON (entries.profile_id = profiles.id)
JOIN media ON entries.media = media.code
JOIN reply ON (entries.reply_id = reply.id)
LEFT JOIN (
SELECT winners.entries_id,prizes.name AS prizeName, prizes.type AS prizeType,prizes.nominalShow AS prizeNominal
FROM prizes JOIN winners ON prizes.id = winners.prize_id
WHERE winners.entries_id != 0
) a ON (entries.id = a.entries_id)
WHERE entries.is_deleted = 0${keyWhere(params.key, params.columnSearch)}${mediaWhere(params.media)}${dateWhere(params.startDate, params.endDate)}${validWhere(params.isValid)}${cutOfWhere(params.subtract)}${orderBy(params.direction, params.column)} ${params.limitQuery}`;

    return query(listEntriesQuery, "");
};

export const detailEntries = (id: number) => {
    let queryDetailEntries = `SELECT 
		entries.id_number AS idNumber,
		entries.message,
		entries.coupon,
		profiles.id AS profileId, 
		entries.name, 
		entries.sender, 
		entries.hp, 
		entries.city AS regency,  
		entries.id, 
		entries.rcvd_time rcvd_date, 
		entries.is_valid,
		prizes.name AS prizeName,
        media.name media,
        reply.name reason,
        entries.invalid_reason info
    FROM entries
    LEFT JOIN profiles ON (entries.profile_id = profiles.id)
    JOIN media ON entries.media = media.code
    JOIN reply ON (entries.reply_id = reply.id)
    LEFT JOIN (SELECT prizes.name,winners.entries_id FROM winners JOIN prizes ON winners.prize_id = prizes.id) prizes ON entries.id = prizes.entries_id
    WHERE entries.id = ?`;
    return query(queryDetailEntries, id);
};

export const checkOrigin = () => {
    return query("SELECT id,origin FROM origins WHERE status = 1", [])
}

export const exportEntries = (params: Type) => {
    let exportEntriesquery = `SELECT
		entries.id_number AS idNumber,
		entries.message,
		entries.coupon,
		profiles.id AS profileId,
		entries.name,
		entries.sender,
		entries.hp,
		entries.city AS regency,
		entries.id entriesId,
		DATE_FORMAT(entries.rcvd_time,"%Y-%m-%d %H:%i:%s"),
		entries.is_valid,
        entries.invalid_reason info,
		reply.name as reason,
		prizes.name AS prizeName,
        media.name media
FROM entries
LEFT JOIN profiles ON (entries.profile_id = profiles.id)
JOIN media ON entries.media = media.code
JOIN reply ON (entries.reply_id = reply.id)
LEFT JOIN (
SELECT winners.entries_id,prizes.name, prizes.type,prizes.nominalShow
FROM prizes JOIN winners ON prizes.id = winners.prize_id
WHERE winners.entries_id != 0
) prizes ON (entries.id = prizes.entries_id)
WHERE entries.is_deleted = 0${keyWhere(params.key, params.columnSearch)}${mediaWhere(params.media)}${dateWhere(params.startDate, params.endDate)}${validWhere(params.isValid)}${cutOfWhere(params.subtract)}${orderBy(params.direction, params.column)}`;
    return query(exportEntriesquery, "");
};

export const deleteEntries = (entriesId: number, userId: number) => {
    return query("UPDATE entries SET is_deleted = 1 AND deleted_by = ? AND deleted_at = NOW()", [entriesId, userId])
}