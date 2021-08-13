import { query } from "../../../config/baseFunction"
import moment from 'moment';

interface Type {
    startDate: any;
    endDate: any;
    key: string;
    column: string;
    direction: string;
    limitQuery: string;
    subtract: number;
    media: string
}

// const orderBy = (direction: string, column: string) => {
//     const directionType =
//         direction == "ASC" ? "ASC" : direction == "DESC" ? "DESC" : "";
//     if (column == "" || directionType == "") {
//         return " ORDER BY profiles.created_at DESC";
//     } else {
//         return ` ORDER BY ${column == "created_at"
//             ? "profiles.created_at"
//             : column == "sender"
//                 ? "profiles.sender"
//                 : column
//             } ${directionType}`;
//     }
// };
const orderBy = (direction: string, column: string) => {
    const directionType =
        direction == "ASC" ? "ASC" : direction == "DESC" ? "DESC" : "";
    if (column == "" || directionType == "") {
        return " ORDER BY entries.rcvd_time DESC";
    } else {
        return ` ORDER BY ${column}  ${directionType}`;
    }
};

const keyWhere = (key: string) => {
    if (key == "") {
        return "";
    } else {
        return ` AND (profiles.created_at LIKE "%${key}%" OR profiles.name LIKE "%${key}%" OR profiles.sender LIKE "%${key}%" OR profiles.hp LIKE "%${key}%" OR profiles.regency LIKE "%${key}%" OR profiles.id_number LIKE "%${key}%")`;
    }
};

const dateWhere = (startDate: any, endDate: any) => {
    if (startDate == "" || endDate == "") {
        return "";
    } else {
        return ` AND (DATE(profiles.created_at) BETWEEN "${startDate}" AND "${endDate}")`;
    }
};

const cutOfWhere = (subtract: number) => {
    if (subtract == 0) {
        return ""
    } else {
        return ` AND (DATE(profiles.created_at)<="${moment().subtract(2, "days").format("YYYY-MM-DD")}") AND (DATE(profiles.created_at)<="${moment().subtract(2, "days").format("YYYY-MM-DD")}")`
    }
}

const mediaWhere = (media: string) => {
    if (media == "") {
        return ""
    } else {
        return ` AND entries.media=${media}`
    }
}

export const countRegistration = (params: Type) => {
    let countQuery = `
    SELECT count(*) as counts,
sum(consumer.totalValid) as totalValid,
sum(consumer.totalInvalid) as totalInvalid,
sum(consumer.totalPending) as totalPending,
sum(totalValid+totalInvalid+totalPending) as total
from(SELECT SUM(CASE WHEN entries.is_valid = 1 THEN 1 ELSE 0 END) AS totalValid,
    SUM(CASE WHEN entries.is_valid = 0 THEN 1 ELSE 0 END) AS totalInvalid,
    SUM(CASE WHEN entries.is_valid IS NULL THEN 1 ELSE 0 END) AS totalPending
    FROM entries
    JOIN profiles ON entries.profile_id = profiles.id
    LEFT JOIN code_province ON code_province.code = profiles.province_ktp
    LEFT JOIN code_regency ON code_regency.code = profiles.regency_ktp
    WHERE entries.is_deleted = 0 ${keyWhere(
        params.key
    )}${dateWhere(params.startDate, params.endDate)}${cutOfWhere(params.subtract)}${mediaWhere(params.media)} group by profiles.id) as consumer`;
    return query(countQuery, "");
};

export const listRegistration = (params: Type) => {
    let listRegistrationQuery = `SELECT 
            DATE_FORMAT(profiles.created_at,"%Y-%m-%d %H:%i:%S") created_at, 
            entries.id AS id, 
	        profiles.name, 
            (CASE WHEN profiles.gender = "M" THEN "LAKI - LAKI" WHEN profiles.gender = "F" THEN "PEREMPUAN" ELSE "KTP INVALID" END) gender, 
            profiles.age, 
            profiles.birthdate, 
            profiles.sender, 
            profiles.hp, 
            profiles.id_number idNumber, 
            code_regency.name as city,
            code_province.name as province,
            profiles.regency As cityFormat
        FROM entries
        JOIN profiles ON entries.profile_id = profiles.id
        LEFT JOIN code_province ON code_province.code = profiles.province_ktp
        LEFT JOIN code_regency ON code_regency.code = profiles.regency_ktp
        WHERE entries.is_deleted = 0 ${keyWhere(
        params.key
    )}${dateWhere(params.startDate, params.endDate)}${cutOfWhere(params.subtract)}${mediaWhere(params.media)} GROUP BY profiles.id${orderBy(params.direction, params.column)} ${params.limitQuery
        }`;
    return query(listRegistrationQuery, "");
};

export const exportRegistration = (params: Type) => {
    let exportRegistrationquery = `SELECT profiles.created_at, entries.id AS entriesId, 
	profiles.name, profiles.sender, profiles.hp, city as city, profiles.id_number,
    SUM(CASE WHEN entries.is_valid = 1 THEN 1 ELSE 0 END) AS total_submit_valid,
      SUM(CASE WHEN entries.is_valid = 0 THEN 1 ELSE 0 END) AS total_submit_invalid,
      SUM(CASE WHEN entries.is_valid IS NULL THEN 1 ELSE 0 END) AS total_submit_pending,
      COUNT(*) AS total_submit
    FROM entries
    LEFT JOIN profiles ON entries.profile_id = profiles.id
    WHERE entries.is_deleted = 0 ${keyWhere(
        params.key
    )}${dateWhere(params.startDate, params.endDate)}${cutOfWhere(params.subtract)}${params.media} GROUP BY profiles.id${orderBy(params.direction, params.column)} ${params.limitQuery
        }`;
    return query(exportRegistrationquery, "");
};