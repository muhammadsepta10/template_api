import { query } from "../../../config/baseFunction"
import moment from 'moment';

interface Type {
    startDate: any;
    endDate: any;
    key: string;
    column: string;
    direction: string;
    limitQuery: string;
    subtract: number,
    media: string
}

const orderBy = (direction: string, column: string) => {
    const directionType =
        direction == "ASC" ? "ASC" : direction == "DESC" ? "DESC" : "";
    if (column == "" || directionType == "") {
        return " ORDER BY profiles.created_at DESC";
    } else {
        return ` ORDER BY ${column == "created_at"
            ? "profiles.created_at"
            : column == "sender"
                ? "profiles.sender"
                : column
            } ${directionType}`;
    }
};

const keyWhere = (key: string) => {
    if (key == "") {
        return "";
    } else {
        return ` AND (profiles.rcvd_time LIKE "${key}" OR profiles.birthdate LIKE "%${key}%" OR profiles.name LIKE "%${key}%" OR profiles.sender LIKE "%${key}%" OR profiles.hp LIKE "%${key}%" OR profiles.regency LIKE "%${key}%" OR profiles.id_number LIKE "%${key}%")`;
    }
};

const dateWhere = (startDate: any, endDate: any) => {
    if (startDate == "" || endDate == "") {
        return "";
    } else {
        return ` AND (DATE(profiles.created_at)>="${startDate}" AND DATE(profiles.created_at)<="${endDate}") AND (DATE(profiles.created_at)>="${startDate}" AND DATE(profiles.created_at)<="${endDate}")`;
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
        return ` AND (media=${media})`
    }
}

export const countConsumerData = (params: Type) => {
    let countQuery = `
    SELECT count(*) as counts,
sum(consumer.totalValid) as totalValid,
sum(consumer.totalInvalid) as totalInvalid,
sum(totalValid+totalInvalid) as total
from(SELECT SUM(CASE WHEN entries.is_valid = 1 THEN 1 ELSE 0 END) AS totalValid,
    SUM(CASE WHEN entries.is_valid = 0 THEN 1 ELSE 0 END) AS totalInvalid
    FROM entries
    JOIN profiles ON entries.profile_id = profiles.id
    WHERE entries.is_deleted = 0 ${keyWhere(
        params.key
    )}${dateWhere(params.startDate, params.endDate)}${cutOfWhere(params.subtract)}${mediaWhere(params.media)} group by profiles.id) as consumer`;
    return query(countQuery, "");
};

export const listConsumerData = (params: Type) => {
    let listConsumerQuery = `
    SELECT profiles.created_at,
           entries.id AS id,
	       profiles.name,
           profiles.sender,
           profiles.hp,
           profiles.id_number,
           regency AS city,
           SUM(CASE WHEN entries.is_valid = 1 THEN 1 ELSE 0 END) AS total_submit_valid,
           SUM(CASE WHEN entries.is_valid = 0 THEN 1 ELSE 0 END) AS total_submit_invalid,
           COUNT(*) AS total_submit
    FROM entries
    JOIN profiles ON entries.profile_id = profiles.id
    WHERE entries.is_deleted = 0 ${keyWhere(
        params.key
    )}${dateWhere(params.startDate, params.endDate)}${cutOfWhere(params.subtract)}${mediaWhere(params.media)} GROUP BY profiles.id${orderBy(params.direction, params.column)} ${params.limitQuery
        }`;
    return query(listConsumerQuery, "");
};

export const exportConsumer = (params: Type) => {
    let exportConsumerquery = `
    SELECT profiles.created_at,
           entries.id AS id,
	       profiles.name,
           profiles.sender,
           profiles.hp,
           profiles.id_number,
           regency AS city,
           SUM(CASE WHEN entries.is_valid = 1 THEN 1 ELSE 0 END) AS total_submit_valid,
           SUM(CASE WHEN entries.is_valid = 0 THEN 1 ELSE 0 END) AS total_submit_invalid,
           COUNT(*) AS total_submit
    FROM entries
    JOIN profiles ON entries.profile_id = profiles.id
    WHERE entries.is_deleted = 0 ${keyWhere(
        params.key
    )}${dateWhere(params.startDate, params.endDate)}${cutOfWhere(params.subtract)} GROUP BY profiles.id${orderBy(params.direction, params.column)} ${params.limitQuery
        }`;
    return query(exportConsumerquery, "");
};